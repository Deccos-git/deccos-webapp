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

const Research = () => {
    const [color, setColor] = useState('')
    const [outputID, setOutputID] = useState('')
    const [outputTitle, setOutputTitle] = useState('')
    const [activityID, setActivityID] = useState('')
    const [activityTitle, setActivityTitle] = useState('')
    const [modalOpen, setModalOpen] = useState(false);
    const [title, setTitle] = useState('')

    const menuState = MenuStatus() 
    const history = useHistory()
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

    const addMoment = (e) => {

        const researchID = e.target.dataset.researchid
        const researchTitle = e.target.dataset.researchtitle

        db.collection('MeasureMoments')
        .doc()
        .set({
            OutputID: outputID,
            OutputTitle: outputTitle,
            ResearchID: researchID,
            ResearchTitle: researchTitle,
            Moment: '',
            Title: 'Titel',
            ID: uuid(),
            Compagny: client,
            Timestamp: timestamp,
            ActivityID: activityID,
            Activity: activityTitle,
        })
    }

    const MeasureMoments = ({research}) => {

        const moments = useFirestoreMeasureMoments(research.ID)

        return(
            <div>
                {moments && moments.map(moment => (
                    <div className='measure-moments-inner-container'>
                        <div>
                            <p>Titel</p>
                            <input type="text" defaultValue={moment.Title} data-docid={moment.docid} onChange={momentTitleHandler} />
                        </div>
                        <div>
                            <p>Meetmoment</p>
                            <input type="date" defaultValue={moment.Moment} data-docid={moment.docid} onChange={momentDateHandler} />
                        </div>
                        <div>
                            <p>Actie</p>
                            <img className='table-delete-icon' data-docid={moment.docid} onClick={deleteMoment} src={deleteIcon} alt="" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    const momentTitleHandler = (e) => {
        const title = e.target.value
        const docid = e.target.dataset.docid

        db.collection('MeasureMoments')
        .doc(docid)
        .update({
            Title: title
        })

    }

    const momentDateHandler = (e) => {
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
                    <p>1 van de 12</p>
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
                                            <img className='add-item-button' src={plusButton} alt="" data-researchid={research.ID} data-researchtitle={research.Title} onClick={addMoment} alt="" />
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
                        <p>In de volgende stap lees je meer over wat impactmanagement inhoudt.</p>
                        <button>Volgende stap</button>
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
    </div>
)
}

export default Research