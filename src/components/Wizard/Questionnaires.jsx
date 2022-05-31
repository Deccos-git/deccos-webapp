import LeftSideBar from "../LeftSideBar"
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import MenuStatus from "../../hooks/MenuStatus";
import arrowLeft from '../../images/icons/arrow-left-icon.png'
import arrowRight from '../../images/icons/arrow-right-icon.png'
import capIcon from '../../images/icons/cap-icon.png'
import rocketIcon from '../../images/icons/rocket-icon.png'
import bulbIcon from '../../images/icons/bulb-icon.png'
import feetIcon from '../../images/icons/feet-icon.png'
import { useFirestore, useFirestoreQuestionnaireFields } from "../../firebase/useFirestore";
import { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import uuid from 'react-uuid';
import {ReactComponent as QuestionIcon}  from '../../images/icons/question-icon.svg'
import { client } from '../../hooks/Client';
import { NavLink, Link } from "react-router-dom";
import penIcon from '../../images/icons/pen-icon.png'
import deleteIcon from '../../images/icons/delete-icon.png'
import plusButton from '../../images/icons/plus-icon.png'
import { db, timestamp } from "../../firebase/config.js"
import Premium from "../../hooks/Premium";
import PremiumNotice from "../PremiumNotice";
import ImpactGuideMenu from "../../hooks/ImpactGuideMenu";
import eyeIcon from '../../images/icons/eye-icon.png'
import dashboardIcon from '../../images/icons/dashboard-icon.png'
import listIcon from '../../images/icons/list-icon.png'

const Questionnaires = () => {

    const [name, setName] = useState('')

    const history = useHistory()
    const menuState = MenuStatus() 
    const id = uuid()
    const premium = Premium() 
    
    const questionnaires = useFirestore('Questionnaires')
    const researchedQuestionnaires = useFirestore('ResearchedQuestionnnaires')
    const compagny = useFirestore('CompagnyMeta')

    useEffect(() => {
        compagny && compagny.forEach(comp => {
            setName(comp.CommunityName)
        })
    })

    const deleteQuestionnaire = (e) => {
        const docid = e.target.dataset.docid

        db.collection('Questionnaires')
        .doc(docid)
        .delete()
    }

    const viewQuestionnaire = (e) => {

        const id = e.target.dataset.id

        history.push(`/${client}/AddQuestionnaire/${id}`)
    }

    const addQuestionnaire = () => {
        db.collection('Questionnaires')
        .doc()
        .set({
            ID: id,
            Timestamp: timestamp,
            Compagny: client,
        })
    }

    const titleHandler = (e) => {
        const docid = e.target.dataset.docid 
        const title = e.target.value

        db.collection('Questionnaires')
        .doc(docid)
        .update({
            Title: title
        })

    }

    const FieldCount = ({questionnaire}) => {

        const questionnaireFields = useFirestoreQuestionnaireFields(questionnaire.ID)

        return(
            <p>{questionnaireFields.length}</p>
        )

    }

  return (
    <div className="main">
        <LeftSideBar />
        <LeftSideBarFullScreen/>
        <div className="main-container" style={{display: menuState}}>
            <div className="page-header">
                <h1>Vragenlijsten</h1>
                <div className='wizard-sub-nav'>
                    <NavLink to={`/${client}/MeasureOutput`} >
                        <div className='step-container'>
                            <img src={arrowLeft} alt="" />
                            <p>Mijlpalen stellen</p>
                        </div>
                    </NavLink>  
                    {ImpactGuideMenu(17)}
                    <NavLink to={`/${client}/Research`} >
                        <div className='step-container'>
                            <p>Onderzoek opzetten</p>
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
                   <p><b>Vragenlijsten zijn een handig middel om de impact die je 
                       maakt op je doelgroep te achterhalen.</b></p>
                    <p>
                        Op Deccos kun je zelf een vragenlijst maken en delen of gebruik maken van bestaande vragenlijsten.
                    </p>
                </div>
                <div>
                    <div className='activity-meta-title-container'>
                        <img src={rocketIcon} alt="" />
                        <h3>Aan de slag</h3>
                    </div> 
                    <div className='text-section'>
                        <div style={{display: premium ? 'block' : 'none'}}>
                            <p><b>Vragenlijsten</b></p>
                            <div className='list-container'>
                                <div className='list-top-row-container'>
                                        <img src={plusButton} alt="" onClick={addQuestionnaire}/>
                                </div>
                                <div className='table-container'>
                                    <table>
                                        <tr>
                                            <th>TITEL</th>
                                            <th>VRAGEN</th>
                                            <th>AANPASSEN</th>
                                            <th>VERWIJDER</th>
                                        </tr>
                                        {questionnaires && questionnaires.map(questionnaire => (
                                            <tr key={questionnaires.ID}>
                                                <td>
                                                    <input type="text" placeholder="Schrijf hier te titel" data-docid={questionnaire.docid} defaultValue={questionnaire.Title} onChange={titleHandler}/>
                                                </td>
                                                <td>
                                                    <FieldCount questionnaire={questionnaire}/>
                                                </td>
                                                <td>
                                                    <img className='table-delete-icon' data-id={questionnaire.ID} onClick={viewQuestionnaire} src={penIcon} alt="" />
                                                </td>
                                                <td>
                                                    <img className='table-delete-icon' data-docid={questionnaire.docid} onClick={deleteQuestionnaire} src={deleteIcon} alt="" />
                                                </td>
                                            </tr>
                                        ))}
                                    </table>
                                </div>
                            </div>
                            {/* <p><b>Open source vragenlijsten</b></p>
                            <div className='list-container'>
                                <div className='table-container'>
                                    <table>
                                        <tr>
                                            <th>TITEL</th>
                                            <th>DOEL</th>
                                            <th>TOEVOEGEN</th>
                                        </tr>
                                        {researchedQuestionnaires && researchedQuestionnaires.map(questionnaire => (
                                            <tr key={questionnaire.ID}>
                                                <td>
                                                    <p>{questionnaire.Title}</p>
                                                </td>
                                                <td>
                                                    <img className='table-delete-icon' data-id={questionnaire.ID} onClick={viewQuestionnaire} src={penIcon} alt="" />
                                                </td>
                                                <td>

                                                </td>
                                            </tr>
                                        ))}
                                    </table>
                                </div>
                            </div> */}
                        </div>
                        <div style={{display: premium ? 'none' : 'flex'}}>
                            <PremiumNotice/>
                        </div>
                    </div>
                    </div>
                </div>
                <div>
                    <div className='activity-meta-title-container'>
                        <img src={eyeIcon} alt="" />
                        <h3>Bekijk</h3>
                    </div> 
                    <div className='text-section'>
                        <p><b>Je kunt je de vragenlijsten hier terug vinden:</b></p>
                        <div className="channel-inner-div">
                        <div className='activity-meta-title-container'>
                            <img src={listIcon} alt="" />
                            <NavLink activeClassName='active' to={`/${client}/QuestionnaireSettings`}>Vragenlijsten</NavLink>
                        </div>
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
                        <p>In de volgende stap ga je een onderzoek vormgeven.</p>
                        <NavLink to={`/${client}/Research`} ><button>Volgende stap</button></NavLink>
                    </div>
                </div>
            </div> 
        </div>
    </div>
  )
}

export default Questionnaires