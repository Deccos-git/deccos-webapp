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
import eyeIcon from '../../images/icons/eye-icon.png'
import dashboardIcon from '../../images/icons/dashboard-icon.png'
import sendIcon from '../../images/icons/send-icon.png'
import ScrollToTop from "../../hooks/ScrollToTop";
import { SavedIcon } from "../../StateManagment/SavedIcon";

const Research = () => {
    const [saved, setSaved] = useContext(SavedIcon)

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
    ScrollToTop()
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
    const researches = useFirestore('Research')
    const questionnaires = useFirestore('Questionnaires')
    const measureMoments = useFirestoreMeasureMoments(researchID && researchID)

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
            CompagnyID: client,
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

        const position = measureMoments.length + 1

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
            CompagnyID: client,
            Timestamp: timestamp,
            ActivityID: activityID,
            Activity: activityTitle,
            QuestionnaireID: questionnaireID,
            Responses: 0,
            Position: position
        })
        .then(() => {
            db.collection('Tasks')
            .doc()
            .set({
                ID: uuid(),
                Compagny: client,
                CompagnyID: client,
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
                    <div key={moment.ID} className='measure-moments-inner-container'>
                        <div className='moment-position-container'>
                            <p>{moment.Position}</p>
                        </div>
                        <div className='measure-moment-sub-container'>
                            <p><b>Titel</b></p>
                            <input type="text" defaultValue={moment.Title} data-docid={moment.docid} onChange={changeMomentTitleHandler} />
                        </div>
                        <div className='measure-moment-sub-container'>
                            <p><b>Meetmoment</b></p>
                            <input type="date" defaultValue={moment.Moment} data-docid={moment.docid} onChange={changeMomentDateHandler} />
                        </div>
                        <div className='measure-moment-sub-container' style={{display: research.QuestionnaireID ? 'block' : 'none'}}>
                            <p><b>Aantal reacties</b></p>
                            <h5>{moment.Responses}</h5>
                        </div>
                        <div className='measure-moment-sub-container' style={{display: research.QuestionnaireID ? 'block' : 'none'}}>
                            <p><b>Link naar vragenlijst</b></p>
                            <h5>{`https://deccos.nl/Questionnaires/${research.QuestionnaireID}/${moment.ID}/${research.ID}`}</h5>
                        </div>
                        <p className='delete-text-measure-moments' data-docid={moment.docid} onClick={deleteMoment}>Verwijder</p>
                    </div>
                ))}
            </div>
        )
    }

    const changeQuestioinnaireHandler = (e) => {

        const questionnaireID = e.target.options[e.target.selectedIndex].value
        const questionnaireTitle = e.target.options[e.target.selectedIndex].dataset.title
        const docid = e.target.dataset.docid

        db.collection('Research')
        .doc(docid)
        .update({
            QuestionnaireID: questionnaireID,
            QuestionnaireTitle: questionnaireTitle

        })
        .then(() => {
            setSaved('flex')
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
        .then(() => {
            setSaved('flex')
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
        .then(() => {
            setSaved('flex')
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

    const changeResearchTitle = (e) => {
        const docid = e.target.dataset.docid
        const title = e.target.value

        db.collection('Research')
        .doc(docid)
        .update({
            Title: title
        })
        .then(() => {
            setSaved('flex')
         })
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
                    <div className='text-section'>
                        <p><b>
                        Aan de hand van onderzoek kun je meetmomenten aan elkaar koppelen en de 
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
                    <div className='text-section'>
                        <div style={{display: premium ? 'block' : 'none'}}>
                            <div className='list-container'>
                                <div className='list-top-row-container'>
                                    <img  src={plusButton} alt="" onClick={() => setModalOpen(true)} alt="" />
                                    <p onClick={() => setModalOpen(true)}>Nieuw onderzoek</p>
                                </div>
                                <div className='table-container'>
                                    <table>
                                        <tr>
                                            <th>ONDERZOEK</th>
                                            <th>MEETINSTRUMENT</th>
                                            <th>MEETMOMENTEN</th>
                                            <th>VERWIJDER</th>
                                        </tr>
                                        {researches && researches.map(research => (
                                        <tr key={research.ID}>
                                            <td>
                                                <input type="text" data-docid={research.docid} onChange={changeResearchTitle} />
                                            </td>
                                            <td>
                                                <div className='measure-moment-sub-container'>
                                                    <p><b>Vragenlijst</b></p>
                                                    <select name="" id="" data-docid={research.docid} defaultValue={research.QuestionnaireID} onChange={changeQuestioinnaireHandler}>
                                                        <option value="">-- Selecteer een vragenlijst --</option>
                                                        {questionnaires && questionnaires.map(questionnaire => (
                                                            <option key={questionnaire.ID} value={questionnaire.ID} selected={research.QuestionnaireID} data-title={questionnaire.Title} >{questionnaire.Title}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </td>
                                            <td>
                                                <div className='list-top-row-container'>
                                                    <img className='add-item-button' src={plusButton} alt="" data-researchid={research.ID} data-researchtitle={research.Title} onClick={openMomentModal} alt="" />
                                                    <p onClick={openMomentModal}>Nieuw meetmoment</p>
                                                </div>
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
                        <img src={eyeIcon} alt="" />
                        <h3>Bekijk</h3>
                    </div> 
                    <div className='text-section'>
                        <p><b>Je kunt je de onderzoeken hier terug vinden:</b></p>
                        <div className="channel-inner-div">
                            <div className='activity-meta-title-container'>
                                <img src={researchIcon} alt="" />
                                <NavLink activeClassName='active' to={`/${client}/ResearchSettings`}>Onderzoeken</NavLink>
                            </div>
                        </div>
                        <div className="channel-inner-div">
                            <div className='activity-meta-title-container'>
                                <img src={dashboardIcon} alt="" />
                                <NavLink activeClassName='active' to={`/${client}/ImpactProgress`}>Dashboard</NavLink>
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
                        <p>In de volgende stap ga je een onderzoeksanalyse uitvoeren:</p>
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
                <input type="text" placeholder='Bijvoorbeeld "Vooronderzoek"' onChange={momentTitleHandler} />
            </div>
            <div>
                <p>Geef het meetmoment een deadline</p>
                <input type="date" onChange={momentDeadlineHandler} />
            </div>
            <div className='button-container-margin-top'>
                <button onClick={addMoment}>Opslaan</button>
            </div>
        </Modal>
    </div>
)
}

export default Research