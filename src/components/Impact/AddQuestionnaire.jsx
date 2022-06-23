import LeftSideBar from "../LeftSideBar"
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import Location from "../../hooks/Location"
import MenuStatus from "../../hooks/MenuStatus";
import { useFirestoreID, useFirestoreQuestionnaireFields, useFirestore } from "../../firebase/useFirestore"
import { useState, useEffect, useContext } from 'react';
import { db, timestamp } from "../../firebase/config";
import { client } from "../../hooks/Client";
import uuid from 'react-uuid';
import ButtonClicked from "../../hooks/ButtonClicked";
import arrowLeft from '../../images/icons/arrow-left-icon.png'
import capIcon from '../../images/icons/cap-icon.png'
import rocketIcon from '../../images/icons/rocket-icon.png'
import bulbIcon from '../../images/icons/bulb-icon.png'
import feetIcon from '../../images/icons/feet-icon.png'
import {ReactComponent as QuestionIcon}  from '../../images/icons/question-icon.svg'
import { NavLink, Link } from "react-router-dom";
import deleteIcon from '../../images/icons/delete-icon.png'
import ScrollToTop from "../../hooks/ScrollToTop";
import { SavedIcon } from "../../StateManagment/SavedIcon";

const AddQuestionnaire = () => {
    const [saved, setSaved] = useContext(SavedIcon)

    const [color, setColor] = useState('')
    const [title, setTitle ] = useState('')
    const [docid, setDocid ] = useState('')
    const [showParagraph, setShowParagraph] = useState('block')
    const [showScale, setShowScale] = useState('none')
    const [type, setType ] = useState('paragraph')
    const [question, setQuestion] = useState(null)
    const [reachStart, setReachStart] = useState(0)
    const [reachEnd, setReachEnd] = useState(0)
    const [reachStartLabel, setReachStartlabel] = useState(null)
    const [reachEndLabel, setReachEndLabel] = useState(null)

    const menuState = MenuStatus()
    const route = Location()[3]
    ScrollToTop()

    const questionnares = useFirestoreID('Questionnaires', route)
    const questionnaireFields = useFirestoreQuestionnaireFields(route)
    const colors = useFirestore('Colors')

    useEffect(() => {
        colors && colors.forEach(color => {
            const background = color.Background 

            setColor(background)
        })

    },[colors])

    useEffect(() => {
        questionnares && questionnares.forEach(questionnare => {
            setTitle(questionnare.Title)
            setDocid(questionnare.docid)
        })
    }, [questionnares])

    const titleHandler = (e) => {

        const title = e.target.value 

        setTitle(title)

        db.collection('Questionnaires')
        .doc(docid)
        .update({
            Title: title
        })
        .then(() => {
            setSaved('flex')
         })
    }

    const typeHandler = (e) => {

        const type = e.target.options[e.target.selectedIndex].value

        setType(type)

        if(type === 'paragraph'){
            setShowParagraph('block')
            setShowScale('none')
        } else if(type === 'scale'){
            setShowParagraph('none')
            setShowScale('block')
        }
    }

    const questionHandler = (e) => {

        const question = e.target.value 

        setQuestion(question)

    }

    const reachStartHandler = (e) => {

        const reachStart = e.target.options[e.target.selectedIndex].value 

        setReachStart(reachStart)

    }

    const reachStartLabelHandler = (e) => {

        const reachStartLabel = e.target.value 

        setReachStartlabel(reachStartLabel)

    }

    const reachEndHandler = (e) => {

        const reachEnd = e.target.options[e.target.selectedIndex].value 

        setReachEnd(reachEnd)

    }

    const reachEndLabelHandler = (e) => {

        const reachEndLabel = e.target.value 

        setReachEndLabel(reachEndLabel)

    }

    const addField = (e) => {

        ButtonClicked(e, 'Toegevoegd')

        setTimeout(() => {
            e.target.innerText = 'Nog een toevoegen' 
            e.target.style.color = 'green'
        }, 2000)

        db.collection('QuestionnaireFields')
        .doc()
        .set({
            Compagny: client,
            ID: uuid(),
            Timestamp: timestamp,
            QuestionnaireID: route,
            Type: type,
            Question: question,
            ReachStart: parseInt(reachStart),
            ReachStartLable: reachStartLabel,
            ReachEnd: parseInt(reachEnd),
            ReachEndLabel: reachEndLabel,
            Key: uuid()
        })
    }

    const QuestionnaireField = ({field}) => {

        const [range, setRange] = useState(null)

        const deleteField = (e) => {
            const docid = e.target.dataset.docid 

            db.collection('QuestionnaireFields')
            .doc(docid)
            .delete()
        }

        const start = field.ReachStart
        const end = field.ReachEnd

        useEffect(() => {

        if(field.Type === 'scale'){
            const range = (start, end) => {
                return Array(end - start + 1).fill().map((_, idx) => start + idx)
            }
    
            const result = range(start, end)
              
            setRange(result)
        }

        }, [field])

        const questionTitleHandler = (e) => {
            const title = e.target.value 
            const docid = e.target.dataset.docid 
    
            db.collection('QuestionnaireFields')
            .doc(docid)
            .update({
                Question: title
            })
            .then(() => {
                setSaved('flex')
             })
        }

        if(field.Type === 'paragraph'){
            return(
                <div className='question-type-display-container'>
                    <input type='text' data-docid={field.docid} defaultValue={field.Question} onChange={questionTitleHandler} />
                    <p id='questionnaire-field-text'>Text antwoord</p>
                    <div className='questionnaire-field-delete-icon-container'>
                        <img className='questionnaire-field-delete-icon' src={deleteIcon} alt="" />
                   </div>
                </div>
            )
        } else if(field.Type === 'scale'){
            return(
                <div className='question-type-display-container'>
                   <input type='text' data-docid={field.docid} defaultValue={field.Question} onChange={questionTitleHandler} />
                   <div id='scale-container'>
                       {field.ReachStartLable}
                       {range && range.map(btn => (
                           <div id='question-type-label-container'>
                                <input type="radio" value={btn} />
                                <label htmlFor={btn}>{btn}</label>
                           </div>
                       ))}
                       {field.ReachEndLabel}
                   </div>
                   <div className='questionnaire-field-delete-icon-container'>
                        <img className='questionnaire-field-delete-icon' data-docid={field.docid} onClick={deleteField} src={deleteIcon} alt="" />
                   </div>
                </div>
            )
        }

    }

    return (
        <div className="main">
        <LeftSideBar />
        <LeftSideBarFullScreen/>
        <div className="main-container" style={{display: menuState}}>
            <div className="page-header">
                <h1>Vragenlijst creëeren</h1>
                <div className='wizard-sub-nav-introduction'>
                    <NavLink to={`/${client}/Questionnaires`} >
                        <div className='step-container'>
                            <p>Vragenlijsten</p>
                            <img src={arrowLeft} alt="" />
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
                    <div className='text-section' style={{backgroundColor: color}}>
                        <p><b>Een vragenlijst kan waardevol instrument om inzicht te krijgen 
                            in de impact te maakt bij je doelgroep.
                        </b></p>

                        <p>In dit onderdeel van de Impact Guide ga je aan de slag met het maken van een vragenlijst. 
                            Er zijn twee type vragen die je kunt gebruiken:
                        </p>

                        <ul>
                            <li>Tekstvraag</li>
                            <li>Schaalvraag</li>
                        </ul>

                        <p>
                            Een <b>tekstvraag</b> geeft de respondent van de vragenlijst de mogelijkheid om uitgebreider op een vraag
                            in te gaan. Uit een dergelijke kwalitatieve vraag kan een dieper inzicht worden opgedaan dan uit het antwoord op een schaalvraag.
                        </p>

                        <p>Een <b>schaalvraag</b> geeft de mogelijkheid om de respondenten de kans te bieden om een kwantatief antwoord
                            te geven (uitgedrukt in een cijfer). Het voordeel van een schaalvraag is dat deze eenvoudiger zijn om te analyseren.
                            Wanneer je er bijvoorbeeld voor kiest om een voor- en naonderzoek te doen aan de hand van een vragenlijst kunnen je de verschillende
                            antwoorden eenvoudig vergelijken en analyseren. Het nadeel van een schaalvraag is dat je weinig nuance en diepgang krijgt uit de respons.
                        </p>
                        
                    </div>
                </div>
                <div>
                    <div className='activity-meta-title-container'>
                        <img src={rocketIcon} alt="" />
                        <h3>Aan de slag</h3>
                    </div> 
                    <div className='text-section' style={{backgroundColor: color}}>
                        <p><b>Titel</b></p>
                        <input type="text" placeholder='Titel' defaultValue={title} onChange={titleHandler} />
                        <p><b>Vraag toevoegen</b></p>
                        <select name="" id="" onChange={typeHandler}>
                            <option value="paragraph">Tekstvraag</option>
                            <option value="scale">Schaalvraag</option>
                        </select>
                        <div className='question-type-display-container'>
                            <input type="text" id='questionnaire-question' placeholder='Noteer hier de vraag' onChange={questionHandler} />
                            <div className='questionnaire-field-text-container' style={{display: showParagraph}}>
                                <p id='questionnaire-field-text'>Text antwoord</p>
                            </div>
                            <div className='questionnaire-field-scale-container' style={{display: showScale}}>
                                <div className='select-scale-container'>
                                    <select name="" id="" onChange={reachStartHandler}>
                                        <option value="">-- Selecteer onderwaarde ---</option>
                                        <option value="0">0</option>
                                        <option value="1">1</option>
                                    </select>
                                    <input type="text" placeholder='Voeg label toe' onChange={reachStartLabelHandler} />
                                </div>
                                <p id='scale-reach-symbol'>t/m</p>
                                <div className='select-scale-container'>
                                    <select name="" id="" onChange={reachEndHandler}>
                                        <option value="">-- Selecteer bovenwaarde --</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                        <option value="7">7</option>
                                        <option value="8">8</option>
                                        <option value="9">9</option>
                                        <option value="10">10</option>
                                    </select>
                                    <input type="text" placeholder='Voeg label toe' onChange={reachEndLabelHandler} />
                                </div>
                            </div>
                        </div>
                        <div>
                            <button className='button-simple' onClick={addField}>Toevoegen</button>
                        </div>
                        <div>
                            <p><b>Vragenlijst</b></p>
                            {questionnaireFields && questionnaireFields.map(field => (
                                <div key={field.ID}>
                                    <QuestionnaireField field={field}/>
                                </div>
                            ))}

                        </div>
                    </div>
                </div>
                    <div>
                        <div className='activity-meta-title-container'>
                            <img src={bulbIcon} alt="" />
                            <h3>Tips</h3>
                        </div> 
                        <div className='text-section' style={{backgroundColor: color}}>
                            <ol>
                                <li>Kom je er niet uit of heb je behoefte aan ondersteuning van een impactexpert? 
                                    Klik op het <QuestionIcon style={{width: '19px', height: '19px'}}/> icon in de 
                                    bovenbalk (onderbalk op mobiel) voor alle ondersteuningsmogelijkheden.</li>
                                <li>Benieuwd naar de impact van andere sociale MKB'ers? Neem eens een kijkje in de <a href="https://deccos.nl/Milestones">Deccos Impactclub</a>.</li>
                            </ol>
                        </div>
                    </div>
                    <div>
                        <div className='activity-meta-title-container'>
                            <img src={feetIcon} alt="" />
                            <h3>Volgende stap</h3>
                        </div> 
                        <div className='text-section' style={{backgroundColor: color}}>
                            <p>Terug naar vragenlijsten:</p>
                            <NavLink to={`/${client}/Questionnaires`} ><button>Naar vragenlijsten</button></NavLink>
                        </div>
                    </div>
                </div>
            </div> 
        </div>
    )
}

export default AddQuestionnaire