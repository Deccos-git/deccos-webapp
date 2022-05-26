import LeftSideBar from "../LeftSideBar"
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import MenuStatus from "../../hooks/MenuStatus";
import arrowRight from '../../images/icons/arrow-right-icon.png'
import arrowLeft from '../../images/icons/arrow-left-icon.png'
import capIcon from '../../images/icons/cap-icon.png'
import rocketIcon from '../../images/icons/rocket-icon.png'
import bulbIcon from '../../images/icons/bulb-icon.png'
import feetIcon from '../../images/icons/feet-icon.png'
import plusButton from '../../images/icons/plus-icon.png'
import { useFirestore, useFirestoreMeasureMoments } from "../../firebase/useFirestore";
import { useState, useEffect, useContext } from "react";
import {ReactComponent as MagicIcon}  from '../../images/icons/magic-icon.svg'
import {ReactComponent as QuestionIcon}  from '../../images/icons/question-icon.svg'
import { client } from '../../hooks/Client';
import { useHistory } from "react-router-dom"
import { NavLink, Link } from "react-router-dom";
import Modal from 'react-modal';
import uuid from "react-uuid";
import ButtonClicked from "../../hooks/ButtonClicked";
import researchIcon from '../../images/icons/research-icon.png'
import deleteIcon from '../../images/icons/delete-icon.png'
import { db, timestamp } from "../../firebase/config.js"
import completeIcon from '../../images/icons/complete-icon.png'
import resultsIcon from '../../images/icons/results-icon.png'
import Premium from "../../hooks/Premium";
import PremiumNotice from "../PremiumNotice";
import ImpactGuideMenu from "../../hooks/ImpactGuideMenu";

const Research = () => {
    const [color, setColor] = useState('')
    const [outputID, setOutputID] = useState('')
    const [outputTitle, setOutputTitle] = useState('')
    const [activityID, setActivityID] = useState('')
    const [activityTitle, setActivityTitle] = useState('')
    const [modalOpen, setModalOpen] = useState(false);
    const [momentModalOpen, setMomentModalOpen] = useState(false);
    const [title, setTitle] = useState('')
    const [momentTitle, setMomentTitle] = useState('')
    const [momentDeadline, setMomentDeadline] = useState('')
    const [researchTitle, setResearchTitle] = useState('')
    const [researchID, setResearchID] = useState('')
    const [questionnaireID, setQuestionnaireID] = useState('')

    const menuState = MenuStatus() 
    const history = useHistory()
    const premium = Premium() 
    Modal.setAppElement('#root');

    const modalStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
        },
      };

    const outputs = useFirestore('Outputs')
    const colors = useFirestore('Colors')
    const researches = useFirestore('Research')
    const questionnaires = useFirestore('Questionnaires')

    useEffect(() => {
        colors && colors.forEach(color => {
            const background = color.Background 

            setColor(background)
        })

    },[colors])

    const outputHandler = (e) => {
        const outputID = e.target.options[e.target.selectedIndex].value
        const outputTitle = e.target.options[e.target.selectedIndex].dataset.title
        const activity = e.target.options[e.target.selectedIndex].dataset.activity
        const activityID = e.target.options[e.target.selectedIndex].dataset.activityid

        setOutputID(outputID)
        setOutputTitle(outputTitle)
        setActivityID(activityID)
        setActivityTitle(activity)
    }

    const titleHandler = (e) => {

        const title = e.target.value 
        
        setTitle(title)

    }

    const deleteResearch = (e) => {
        const docid = e.target.dataset.docid

        db.collection('Research')
        .doc(docid)
        .delete()

    }

    const addResearch = (e) => {

        ButtonClicked(e, 'Opgeslagen')

        db.collection('Research')
        .doc()
        .set({
            OutputID: outputID,
            OutputTitle: outputTitle,
            ID: uuid(),
            Compagny: client,
            Timestamp: timestamp,
            Title: title,
            ActivityID: activityID,
            Activity: activityTitle,
        })
        .then(() => {
            closeModal()
        })
    }

    const closeModal = () => {
        setModalOpen(false);
      }

      const closeMomentModal = () => {

        setMomentModalOpen(false);
      }

    const openMomentModal = (e) => {

        const researchTitle = e.target.dataset.researchtitle 
        const researchid = e.target.dataset.researchid 

        setResearchID(researchid)
        setResearchTitle(researchTitle)

       setMomentModalOpen(true)
    }

    const addMoment = (e) => {

        db.collection('MeasureMoments')
        .doc()
        .set({
            OutputID: outputID,
            OutputTitle: outputTitle,
            ResearchID: researchID,
            ResearchTitle: researchTitle,
            Moment: momentDeadline,
            Title: momentTitle,
            ID: uuid(),
            Compagny: client,
            Timestamp: timestamp,
            ActivityID: activityID,
            Activity: activityTitle,
            QuestionnaireID: questionnaireID
        })
        .then(() => {
            db.collection('Tasks')
            .doc()
            .set({
                ID: uuid(),
                Compagny: client,
                Timestamp: timestamp,
                Title: momentTitle,
                AppointedID: '',
                AppointedName: '',
                AppointedPhoto: '',
                AppointedEmail: '',
                Completed: false,
                Icon: completeIcon,
                Type: 'Task',
                Deadline: momentDeadline,
                Priority: '',
                OutputID: outputID,
                OutputTitle: outputTitle,
                ActivityID: activityID,
                ActivityTitle: activityTitle
            })
        })
        .then(() => {
            closeMomentModal()
        })
    }

    const MeasureMoments = ({research}) => {

        const moments = useFirestoreMeasureMoments(research.ID)

        return(
            <div>
                {moments && moments.map(moment => (
                    <div className='measure-moments-inner-container'>
                        <div>
                            <p><b>Titel</b></p>
                            <input type="text" defaultValue={moment.Title} data-docid={moment.docid} onChange={changeMomentTitleHandler} />
                        </div>
                        <div>
                            <p><b>Meetmoment</b></p>
                            <input type="date" defaultValue={moment.Moment} data-docid={moment.docid} onChange={changeMomentDateHandler} />
                        </div>
                        <div>
                            <p><b>Vragenlijst</b></p>
                            <select name="" id="" data-docid={moment.docid} defaultValue={moment.QuestionnaireID} onChange={changeQuestioinnaireHandler}>
                                <option value="">-- Selecteer een vragenlijst --</option>
                                {questionnaires && questionnaires.map(questionnaire => (
                                    <option value={questionnaire.ID}>{questionnaire.Title}</option>
                                ))}
                            </select>
                        </div>
                        <p className='delete-text' onClick={deleteMoment}>Verwijder</p>
                    </div>
                ))}
            </div>
        )
    }

    const changeQuestioinnaireHandler = (e) => {

        const questionnaireID = e.target.options[e.target.selectedIndex].value
        const docid = e.target.dataset.docid

        db.collection('MeasureMoments')
        .doc(docid)
        .update({
            QuestionnaireID: questionnaireID
        })
    }

    const changeMomentTitleHandler = (e) => {
        const title = e.target.value
        const docid = e.target.dataset.docid

        db.collection('MeasureMoments')
        .doc(docid)
        .update({
            Title: title
        })

    }

    const changeMomentDateHandler = (e) => {
        const date = e.target.value
        const docid = e.target.dataset.docid

        db.collection('MeasureMoments')
        .doc(docid)
        .update({
            Moment: date
        })

    }

    const deleteMoment = (e) => {
        const docid = e.target.dataset.docid

        db.collection('MeasureMoments')
        .doc(docid)
        .delete()

    }

    const momentTitleHandler = (e) => {

        const title = e.target.value 

        setMomentTitle(title)

    }

    const momentDeadlineHandler = (e) => {

        const deadline = e.target.value 

        setMomentDeadline(deadline)

    }

    const questioinnaireHandler = (e) => {

        const questionnaireID = e.target.options[e.target.selectedIndex].value

        setQuestionnaireID(questionnaireID)
    }

    


  return (
    <div className="main">
        <LeftSideBar />
        <LeftSideBarFullScreen/>
        <div className="main-container" style={{display: menuState}}>
            <div className="page-header">
                <h1>Onderzoek opzetten</h1>
                <div className='wizard-sub-nav'>
                    <NavLink to={`/${client}/Questionnaires`} >
                        <div className='step-container'>
                            <img src={arrowLeft} alt="" />
                            <p>Vragenlijsten</p>
                        </div>
                    </NavLink>
                    {ImpactGuideMenu(18)}
                    <NavLink to={`/${client}/ResearchAnalyses`} >
                        <div className='step-container'>
                            <p>Onderzoeksanalyse</p>
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
                    <div className='text-section' style={{backgroundColor: color}}>
                        <p><b>
                        Aan de hand van onderzoek kun je meetbare meetmomenten aan elkaar koppelen en de 
                        resultaten met elkaar vergelijken.
                        </b></p>
                        <p>
                        Zo krijg je een beeld over de ontwikkeling van je impact over een bepaalde periode.
                        </p>
                    </div>
                </div>
                <div>
                    <div className='activity-meta-title-container'>
                        <img src={rocketIcon} alt="" />
                        <h3>Aan de slag</h3>
                    </div> 
                    <div className='text-section' style={{backgroundColor: color}}>
                        <div style={{display: premium ? 'block' : 'none'}}>
                            <div className='list-container'>
                                <div className='list-top-row-container'>
                                    <img  src={plusButton} alt="" onClick={() => setModalOpen(true)} alt="" />
                                </div>
                                <div className='table-container'>
                                    <table>
                                        <tr>
                                            <th>ONDERZOEK</th>
                                            <th>MEETMOMENTEN</th>
                                            <th>ACTIE</th>
                                        </tr>
                                        {researches && researches.map(research => (
                                        <tr>
                                            <td>
                                                <input type="text" defaultValue={research.Title} />
                                            </td>
                                            <td>
                                                <img className='add-item-button' src={plusButton} alt="" data-researchid={research.ID} data-researchtitle={research.Title} onClick={openMomentModal} alt="" />
                                                <MeasureMoments research={research}/>
                                            </td>
                                            <td>
                                                <img className='table-delete-icon' data-docid={research.docid} onClick={deleteResearch} src={deleteIcon} alt="" />
                                            </td>
                                        </tr>
                                        ))}
                                    </table>
                                </div>
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
                    <div className='text-section' style={{backgroundColor: color}}>
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
                    <div className='text-section' style={{backgroundColor: color}}>
                        <p>In de volgende stap ga je een onderzoeksanalyse uitvoeren</p>
                        <NavLink to={`/${client}/ResearchAnalyses`} > <button>Volgende stap</button></NavLink>
                    </div>
                </div>
            </div> 
        </div>
        <Modal
            isOpen={modalOpen}
            onRequestClose={closeModal}
            style={modalStyles}
            contentLabel="Upload banner"
            >
            <img src={researchIcon} alt="" />
            <p><b>1. Selecteer een output waaraan je het onderzoek wilt koppelen</b></p>
            <select name="" id="" onChange={outputHandler}>
                <option value="">-- Selecteer een output --</option>
                {outputs && outputs.map(output => (
                    <option value={output.ID} data-title={output.Title} data-docid={output.docid} data-activity={output.Activity} data-activityid={output.ActivityID}>{output.Title} (Activiteit: {output.Activity})</option>
                ))}
            </select>
            <p><b>Geef het onderzoek een titel</b></p>
            <input type="text" onChange={titleHandler} />
            <div className='button-container-margin-top'>
                <button onClick={addResearch}>Opslaan</button>
            </div>
        </Modal>
        <Modal
            isOpen={momentModalOpen}
            onRequestClose={closeMomentModal}
            style={modalStyles}
            contentLabel="Upload banner"
            >
            <img src={resultsIcon} alt="" />
            <div>
                <p>Geef het meetmoment een titel</p>
                <input type="text" placeholder='Schrijf hier de titel van het meetmoment' onChange={momentTitleHandler} />
            </div>
            <div>
                <p>Geef het meetmoment een deadline</p>
                <input type="date" onChange={momentDeadlineHandler} />
            </div>
            <div>
                <p>Selecteer een vragenlijst</p>
                <select name="" id="" onChange={questioinnaireHandler}>
                    <option value="">-- Selecteer een vragenlijst --</option>
                    {questionnaires && questionnaires.map(questionnaire => (
                        <option value={questionnaire.ID}>{questionnaire.Title}</option>
                    ))}
                </select>
            </div>
            <div className='button-container-margin-top'>
                <button onClick={addMoment}>Opslaan</button>
            </div>
        </Modal>
    </div>
)
}

export default Research