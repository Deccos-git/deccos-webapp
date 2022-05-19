import LeftSideBar from "../LeftSideBar"
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import MenuStatus from "../../hooks/MenuStatus";
import arrowLeft from '../../images/icons/arrow-left-icon.png'
import arrowRight from '../../images/icons/arrow-right-icon.png'
import capIcon from '../../images/icons/cap-icon.png'
import rocketIcon from '../../images/icons/rocket-icon.png'
import bulbIcon from '../../images/icons/bulb-icon.png'
import feetIcon from '../../images/icons/feet-icon.png'
import { useFirestore, useFirestoreMilestonesOutput } from "../../firebase/useFirestore";
import { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import uuid from 'react-uuid';
import {ReactComponent as QuestionIcon}  from '../../images/icons/question-icon.svg'
import { client } from '../../hooks/Client';
import { NavLink, Link } from "react-router-dom";
import { db, timestamp } from "../../firebase/config.js"
import plusButton from '../../images/icons/plus-icon.png'
import deleteIcon from '../../images/icons/delete-icon.png'
import growIcon from '../../images/icons/grow-icon.png'
import Modal from 'react-modal';
import ButtonClicked from "../../hooks/ButtonClicked";
import completeIcon from '../../images/icons/complete-icon.png'

const MeasureOutput = () => {
    const [outputID, setOutputID] = useState('')
    const [outputTitle, setOutputTitle] = useState('')
    const [activityID, setActivityID] = useState('')
    const [activityTitle, setActivityTitle] = useState('')
    const [title, setTitle] = useState('')
    const [number, setNumber] = useState('')
    const [deadline, setDeadline] = useState('')
    const [color, setColor] = useState('')
    const [modalOpen, setModalOpen] = useState(false);

    const history = useHistory()
    const menuState = MenuStatus() 
    const id = uuid()
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
    
    const colors = useFirestore('Colors')
    const outputs = useFirestore('Outputs')
    const milestones = useFirestoreMilestonesOutput(outputID && outputID)

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

    const addMilestone = (e) => {

        ButtonClicked(e, 'Opgeslagen')

        db.collection('Milestones')
        .doc()
        .set({
            OutputID: outputID,
            OutputTitle: outputTitle,
            ID: id,
            Compagny: client,
            Timestamp: timestamp,
            Title: title,
            ActivityID: activityID,
            Activity: activityTitle,
            Number: number,
            Succes: false,
            Deadline: deadline
        })
        .then(() => {

            for (let i = 0; i < number; i++) {
                createTasks()
              }

        })
        .then(() => {
            closeModal()
        })
    }

    const createTasks = () => {

        db.collection('Tasks')
        .doc()
        .set({
            ID: uuid(),
            Compagny: client,
            Timestamp: timestamp,
            Title: `Nieuwe ${outputTitle}`,
            AppointedID: '',
            AppointedName: '',
            AppointedPhoto: '',
            AppointedEmail: '',
            Completed: false,
            Icon: completeIcon,
            Type: 'Task',
            Priority: '',
            OutputID: outputID,
            OutputTitle: outputTitle,
            ActivityID: activityID,
            ActivityTitle: activityTitle
        })
    }

    const titleHandler = (e) => {

        const title = e.target.value 
        
        setTitle(title)

    }

    const numberHandler = (e) => {

        const number = e.target.value 
        
        setNumber(number)

    }

    const deadlineHandler = (e) => {

        const deadline = e.target.value 
        
        setDeadline(deadline)

    }

    const deleteMilestone = (e) => {
        const docid = e.target.dataset.docid

        db.collection('Milestones')
        .doc(docid)
        .delete()
    }

    const closeModal = () => {
        setModalOpen(false);
      }

  return (
    <div className="main">
        <LeftSideBar />
        <LeftSideBarFullScreen/>
        <div className="main-container" style={{display: menuState}}>
            <div className="page-header">
                <h1>Mijlpalen stellen</h1>
                <div className='wizard-sub-nav'>
                    <NavLink to={`/${client}/AddSROI`} >
                        <div className='step-container'>
                            <img src={arrowLeft} alt="" />
                            <p>SROI</p>
                        </div>
                    </NavLink>  
                    <p>16 van de 12</p>
                    <NavLink to={`/${client}/Questionnaires`} >
                        <div className='step-container'>
                            <p>Vragenlijsten</p>
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
                        <p>Mijlpalen zijn doelen die een stip aan de horizon geven. Voor jezelf en je team 
                            geeft dit een mooi vergezicht en voor je stakeholders geeft dit een beeld 
                            van jullie ambities en voortgang.</p>
                    </div>
                </div>
                <Modal
                    isOpen={modalOpen}
                    onRequestClose={closeModal}
                    style={modalStyles}
                    contentLabel="Upload banner"
                    >
                    <img src={growIcon} alt="" />
                    <p><b>Geef de mijlpaal een titel</b></p>
                    <input type="text" onChange={titleHandler} />
                    <p><b>Geef de mijlpaal een aantal</b></p>
                    <input type="number" onChange={numberHandler} />
                    <p><b>Bepaal een deadline</b></p>
                    <input type="date" onChange={deadlineHandler} />
                    <div className='button-container-margin-top'>
                        <button onClick={addMilestone}>Opslaan</button>
                    </div>
                </Modal>
                <div>
                    <div className='activity-meta-title-container'>
                        <img src={rocketIcon} alt="" />
                        <h3>Aan de slag</h3>
                    </div> 
                <div className='text-section' style={{backgroundColor: color}}>
                    <p><b>1. Selecteer een output waaraan je de mijlpaal wilt koppelen</b></p>
                    <select name="" id="" onChange={outputHandler}>
                        <option value="">-- Selecteer een output --</option>
                        {outputs && outputs.map(output => (
                            <option value={output.ID} data-title={output.Title} data-docid={output.docid} data-activity={output.Activity} data-activityid={output.ActivityID}>{output.Title} (Activiteit: {output.Activity})</option>
                        ))}
                    </select>
                    <div style={{display: outputID ? 'block' : 'none'}}>
                        <p><b>2. Beheer je mijlpalen </b></p>
                        <div className='list-container'>
                            <div className='list-top-row-container'>
                                <img src={plusButton} onClick={() => setModalOpen(true)} alt="" />
                            </div>
                            <div className='list-top-row-container'>
                                <p>MIJLPAAL</p>
                                <p>AANTAL</p>
                                <p>DEADLINE</p>
                                <p>ACTIE</p>
                            </div>
                            {milestones && milestones.map(milestone => (
                                <div className='list-row-container'>
                                    <input type="text" placeholder='Titel' defaultValue={milestone.Title} data-docid={milestone.docid} onChange={titleHandler}/>
                                    <input type="number" placeholder='0' defaultValue={milestone.Number} data-docid={milestone.docid} onChange={numberHandler} />
                                    <input type="date" placeholder='0' defaultValue={milestone.Deadline} data-docid={milestone.docid} onChange={deadlineHandler} />
                                    <img data-docid={milestone.docid} onClick={deleteMilestone} src={deleteIcon} alt="" />
                                </div>  
                            ))}
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
                        </ol>
                    </div>
                </div>
                <div>
                    <div className='activity-meta-title-container'>
                        <img src={feetIcon} alt="" />
                        <h3>Volgende stap</h3>
                    </div> 
                    <div className='text-section' style={{backgroundColor: color}}>
                        <p>In de volgende stap ga je een probleemanalyse maken.</p>
                        <button>Volgende stap</button>
                    </div>
                </div>
            </div> 
        </div>
    </div>
  )
}

export default MeasureOutput