import LeftSideBar from "../LeftSideBar"
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import MenuStatus from "../../hooks/MenuStatus";
import arrowRight from '../../images/icons/arrow-right-icon.png'
import arrowLeft from '../../images/icons/arrow-left-icon.png'
import capIcon from '../../images/icons/cap-icon.png'
import rocketIcon from '../../images/icons/rocket-icon.png'
import bulbIcon from '../../images/icons/bulb-icon.png'
import feetIcon from '../../images/icons/feet-icon.png'
import { useFirestore, useFirestoreID, useFirestoreMeasureMoments, useFirestoreQuestionnaireFields, useFirestoreQuestionnairesResponsesResearch, useFirestoreQuestionnairesResponses, useFirestoreConclusions } from "../../firebase/useFirestore";
import { useState, useEffect, useContext } from "react";
import {ReactComponent as MagicIcon}  from '../../images/icons/magic-icon.svg'
import {ReactComponent as QuestionIcon}  from '../../images/icons/question-icon.svg'
import { client } from '../../hooks/Client';
import uuid from 'react-uuid';
import { useHistory } from "react-router-dom"
import { NavLink, Link } from "react-router-dom";
import Premium from "../../hooks/Premium";
import PremiumNotice from "../PremiumNotice";
import ImpactGuideMenu from "../../hooks/ImpactGuideMenu";
import ScrollToTop from "../../hooks/ScrollToTop";
import deleteIcon from '../../images/icons/delete-icon.png'
import plusButton from '../../images/icons/plus-icon.png'
import { db, timestamp } from "../../firebase/config";
import ResearchResultsGraph from "../Impact/ResearchResultsGraph";

const ResearchAnalysis = () => {
    const [researchID, setResearchID] = useState(null) 
    const [questionnaireID, setQuestionnaireID] = useState('')

    const menuState = MenuStatus() 
    const history = useHistory()
    const premium = Premium() 
    ScrollToTop()

    const researches = useFirestore('Research')
    const selectedResearch = useFirestoreID('Research', researchID && researchID)
    const measureMoments = useFirestoreMeasureMoments(researchID && researchID)
    const fields = useFirestoreQuestionnaireFields(questionnaireID && questionnaireID)
    const researchConclusions = useFirestoreConclusions(researchID && researchID)

    console.log(fields)

    const researchHandler = (e) => {
        const id = e.target.options[e.target.selectedIndex].dataset.id 

        setResearchID(id)
    }

    useEffect(() => {
        selectedResearch && selectedResearch.forEach(research => {
            setQuestionnaireID(research.QuestionnaireID)
        })

    },[selectedResearch])

    const Results = ({moment, field}) => {

        const results = useFirestoreQuestionnairesResponses(field.ID, moment.ID)

        console.log(results)

        const total = results.length 

        const resultsArray = []

        results && results.forEach(result => {
            resultsArray.push(parseInt(result.Input))
        })

        const sum = resultsArray.length > 0 ? resultsArray.reduce((partialSum, a) => partialSum + a, 0) : 0

        return(
            <div>
                <p>Responses: {total}</p>
                <p>Gemiddelde: { sum ? Math.round(sum/total * 10) / 10 : 0}</p>
            </div>   
        )
    }

    const Difference = ({field}) => {

        // Group function

        const groupBy = (array, property) => {
            return array.reduce((acc, obj) => {
              let key = obj[property]
              if (!acc[key]) {
                acc[key] = []
              }
              acc[key].push(obj)
              return acc
            }, {})
          }  
          
        // Get results from DB

        const results = useFirestoreQuestionnairesResponsesResearch(researchID, field.ID)

        // Get an object with momentID and score of the results in an array

        const resultsArray = []

        results && results.forEach(result => {
            const resultsObject = {
                Input: parseInt(result.Input),
                Position: result.Position,
            }

            resultsArray.push(resultsObject)
        })

        // Group the results array by momentID

        const array = Object.entries(groupBy(resultsArray, 'Position')) 

        console.log(array)

        // Get the average score in an array

        const totalArray = []

        array && array.forEach(arr => {

            const sumArray = []

            arr[1] && arr[1].forEach(a => {
                sumArray.push(Math.round(a.Input * 10) / 10)
            })

            const sum = array.length > 0 ? sumArray.reduce((partialSum, a) => partialSum + a, 0) : 0

            const total = sum/arr[1].length

            totalArray.push(total)

        })

        // Get the difference between the first and last average score

        const firstNumber = totalArray[totalArray.indexOf(totalArray[0])]
        const lastNumber = totalArray[totalArray.length-1]

        const difference = lastNumber - firstNumber

        return(
            <div>{difference ? Math.round(difference * 10) / 10 : ''}</div>
        )
    }

    const Development = ({field}) => {

        const groupBy = (array, property) => {
            return array.reduce((acc, obj) => {
              let key = obj[property]
              if (!acc[key]) {
                acc[key] = []
              }
              acc[key].push(obj)
              return acc
            }, {})
          }    

        const results = useFirestoreQuestionnairesResponsesResearch(researchID, field.ID)

        const resultsArray = []

        results && results.forEach(result => {
            const resultsObject = {
                Input: parseInt(result.Input),
                Position: result.Position,
            }

            resultsArray.push(resultsObject)
        })

        const array = Object.entries(groupBy(resultsArray, 'Position')) 

        const totalArray = []

        array && array.forEach(arr => {

            const sumArray = []

            arr[1] && arr[1].forEach(a => {
                sumArray.push(Math.round(a.Input * 10) / 10)
            })

            const sum = array.length > 0 ? sumArray.reduce((partialSum, a) => partialSum + a, 0) : 0

            const total = sum/arr[1].length

            const totalObject = {
                Title: arr[0],
                AvgScore: total
            }

            totalArray.push(totalObject)

        })

        return(
            <div>
                <ResearchResultsGraph results={totalArray}/>
            </div>
        )
    }


    const deleteConclusion = (e) => {
        const docid = e.target.dataset.docid

        db.collection('Conclusions')
        .doc(docid)
        .delete()
    }

    const conclusionHandler = (e) => {
        const title = e.target.value
        const docid = e.target.dataset.docid

        db.collection('Conclusions')
        .doc(docid)
        .update({
            Conclusion: title,
        })
    }

    const addConclusion = () => {

        db.collection('Conclusions')
        .doc()
        .set({
            CompagnyID: client,
            Conclusion: '',
            Timestamp: timestamp,
            ResearchID: researchID,
            ID: uuid()
        })
        
    }

    const typehandler = (e) => {
        const type= e.target.options[e.target.selectedIndex].value
        const docid = e.target.dataset.docid

        db.collection('Conclusions')
        .doc(docid)
        .update({
            Type: type,
        })
    }

  return (
    <div className="main">
        <LeftSideBar />
        <LeftSideBarFullScreen/>
        <div className="main-container" style={{display: menuState}}>
            <div className="page-header">
                <h1>Onderzoeksanalyse</h1>
                <div className='wizard-sub-nav'>
                    <NavLink to={`/${client}/Research`} >
                        <div className='step-container'>
                            <img src={arrowLeft} alt="" />
                            <p>Onderzoeken</p>
                        </div>
                    </NavLink>
                    {ImpactGuideMenu(19)}
                    <NavLink to={`/${client}/Projectmanagement`} >
                        <div className='step-container'>
                            <p>Projectbeheer</p>
                            <img src={arrowRight} alt="" />
                        </div>
                    </NavLink>
                </div>
            </div>
            <div className='profile profile-auth-profile'>
                <div>
                    <div className='activity-meta-title-container'>
                        <img src={capIcon} alt="" />
                        <h3>Uitleg</h3>
                    </div> 
                    <div className='text-section'>
                        <p><b>Nadat er onderzoek is afgerond kun je het gaan analyseren.</b></p>
                    </div>
                </div>
                <div>
                    <div className='activity-meta-title-container'>
                        <img src={rocketIcon} alt="" />
                        <h3>Aan de slag</h3>
                    </div> 
                    <div className='text-section'>
                        <div style={{display: premium ? 'block' : 'none'}}>
                            <p><b>1. Selecteer een onderzoek</b></p>
                            <select onChange={researchHandler}>
                                <option value="">-- Selecteer een onderzoek --</option>
                                {researches && researches.map(research => (
                                    <option key={research.ID} value={research.Title} data-id={research.ID}>{research.Title}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <p><b>2. Analyse</b></p>
                            <div id='questionnaire-title-container'>
                                <p id='questionnaire-title-container-key'> <i>Vragenlijst:</i> </p>
                                {selectedResearch && selectedResearch.map(research => (
                                    <p key={research.ID}>{research.QuestionnaireTitle}</p>
                                ))}
                            </div>
                            <div className='table-container'>
                                    <table>
                                        <tr>
                                            <th>VRAAG</th>
                                            {measureMoments && measureMoments.map(moment => (
                                                <th>{moment.Title.toUpperCase()}</th>
                                            ))}
                                            <th>ONTWIKKELING</th>
                                            <th>VERSCHIL</th>
                                        </tr>
                                        {fields && fields.map(field => (
                                            <tr key={field.ID}>
                                                <td>
                                                    <p>{field.Question}</p>
                                                </td>
                                                {measureMoments && measureMoments.map(moment => (
                                                    <td>
                                                        <Results moment={moment} field={field}/>
                                                    </td>
                                                ))}
                                                <td>
                                                    <Development field={field}/>
                                                </td>
                                                <td>
                                                    <Difference field={field}/>
                                                </td>
                                            </tr>
                                        ))}
                                    </table>
                                </div>
                            </div>
                        <div style={{display: researchID ? 'block' : 'none'}}>
                            <p><b>3. Conclusies</b></p>
                            <div className='table-container'>
                                <div className='list-top-row-container'>
                                    <img src={plusButton} onClick={addConclusion} alt="" />
                                </div>
                                <table>
                                    <tr>
                                        <th>CONCLUSIE</th>
                                        <th>TYPE</th>
                                        <th>VERWIJDER</th>
                                    </tr>
                                    {researchConclusions && researchConclusions.map(conclusion => (
                                        <tr key={conclusion.ID}>
                                        <td>
                                            <input type="text" data-docid={conclusion.docid} defaultValue={conclusion.Conclusion} placeholder='Conclusie' onChange={conclusionHandler} />
                                        </td>
                                        <td>
                                            <select name="" id="" data-docid={conclusion.docid} defaultValue={conclusion.Type} onChange={typehandler}>
                                                <option value="">-- Selecteer een type --</option>
                                                <option value="Learningpoint">Verbeterpunt</option>
                                                <option value="Plus">Pluspunt</option>
                                            </select>
                                        </td>
                                        <td>
                                            <img className='table-delete-icon' data-docid={conclusion.docid} onClick={deleteConclusion} src={deleteIcon} alt="" />
                                        </td>
                                    </tr>
                                    ))}
                                </table>
                            </div>
                        </div>
                        <div style={{display: premium ? 'none' : 'flex'}}>
                            <PremiumNotice/>
                        </div>
                    </div>
                </div>
                <div>
                    <div className='activity-meta-title-container'>
                        <img src={bulbIcon} alt="" />
                        <h3>Tips</h3>
                    </div> 
                    <div className='text-section'>
                        <ol>
                            <li>
                                Kom je er niet uit of heb je behoefte aan ondersteuning van een impactexpert? 
                                Klik op het 
                                <NavLink to={`/${client}/Support`} >
                                    <QuestionIcon style={{width: '19px', height: '19px'}}/> 
                                </NavLink>
                                icon in de 
                                bovenbalk (onderbalk op mobiel) voor alle ondersteuningsmogelijkheden.
                            </li>
                            <li>Benieuwd naar de impact van andere sociale MKB'ers? Neem eens een kijkje in de <a href="https://deccos.nl/Milestones">Deccos Impactclub</a>.</li>
                        </ol>
                    </div>
                </div>
                <div>
                    <div className='activity-meta-title-container'>
                        <img src={feetIcon} alt="" />
                        <h3>Volgende stap</h3>
                    </div> 
                    <div className='text-section'>
                        <p>In de volgende stap lees je meer over wat het projectbeheer van Deccos inhoudt.</p>
                        <NavLink to={`/${client}/Projectmanagement`} ><button>Volgende stap</button></NavLink>
                    </div>
                </div>
            </div> 
        </div>
    </div>
)
}

export default ResearchAnalysis