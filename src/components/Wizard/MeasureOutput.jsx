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
import Premium from "../../hooks/Premium";
import PremiumNotice from "../PremiumNotice";
import ImpactGuideMenu from "../../hooks/ImpactGuideMenu";
import eyeIcon from '../../images/icons/eye-icon.png'
import dashboardIcon from '../../images/icons/dashboard-icon.png'
import ScrollToTop from "../../hooks/ScrollToTop";
import { SavedIcon } from "../../StateManagment/SavedIcon";

const MeasureOutput = () => {
    const [saved, setSaved] = useContext(SavedIcon)

    const [outputID, setOutputID] = useState('')
    const [outputTitle, setOutputTitle] = useState('')
    const [activityID, setActivityID] = useState('')
    const [activityTitle, setActivityTitle] = useState('')
    const [number, setNumber] = useState('')
    const [deadline, setDeadline] = useState('')
    const [modalOpen, setModalOpen] = useState(false);
    const [singular, setSingular] = useState('')
    const [subdivision, setSubdivision] = useState(1)

    const history = useHistory()
    const menuState = MenuStatus() 
    const id = uuid()
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
    const milestones = useFirestoreMilestonesOutput(outputID && outputID)

    const outputHandler = (e) => {
        const outputID = e.target.options[e.target.selectedIndex].value
        const outputTitle = e.target.options[e.target.selectedIndex].dataset.title
        const activity = e.target.options[e.target.selectedIndex].dataset.activity
        const activityID = e.target.options[e.target.selectedIndex].dataset.activityid
        const singular = e.target.options[e.target.selectedIndex].dataset.singular

        setOutputID(outputID)
        setOutputTitle(outputTitle)
        setActivityID(activityID)
        setActivityTitle(activity)
        setSingular(singular)
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
            CompagnyID: client,
            Timestamp: timestamp,
            Title: outputTitle,
            ActivityID: activityID,
            Activity: activityTitle,
            Number: number,
            Succes: false,
            SuccesDate: timestamp,
            Deadline: deadline,
        })
        .then(() => {

        let division = 1 

        if(number/subdivision < 1){
            division = 1
        } else{
            division = number/subdivision
        }

        let task = ''

        if(subdivision === 1){
            task = `${subdivision} ${singular.toLowerCase()}`
        } else if(subdivision === 5){
            task = `${subdivision} ${outputTitle.toLocaleLowerCase()}`
        } else if(subdivision === 10){
            task = `${subdivision} ${outputTitle.toLocaleLowerCase()}`
        } else if(subdivision === 20){
            task = `${subdivision} ${outputTitle.toLocaleLowerCase()}`
        } else if(subdivision === 100){
            task = `${subdivision} ${outputTitle.toLocaleLowerCase()}`
        } else {
            task = ''
        }

        for (let i = 0; i < division; i++) {

            createTasks(task, division)
            }
            
        })
        .then(() => {
            closeModal()
        })
    }

    const createTasks = (task, division) => {

        db.collection('Tasks')
        .doc()
        .set({
            ID: uuid(),
            Compagny: client,
            CompagnyID: client,
            Timestamp: timestamp,
            Title: task,
            Subdivision: subdivision,
            Division: division,
            Number: number,
            AppointedID: '',
            AppointedName: '',
            AppointedPhoto: '',
            AppointedEmail: '',
            Completed: false,
            Icon: completeIcon,
            Singular: singular.toLowerCase(),
            Type: 'Task',
            Priority: '',
            OutputID: outputID,
            OutputTitle: outputTitle,
            ActivityID: activityID,
            ActivityTitle: activityTitle
        })
    }

    const subdivisionHandler = (e) => {

        const value = e.target.options[e.target.selectedIndex].value

        setSubdivision(parseInt(value))
    }


    const numberHandler = (e) => {

        const number = e.target.value 

        setNumber(number)

    }

    const titleHandler = (e) => {

        const title = e.target.value 
        const docid = e.target.dataset.docid

        db.collection('Milestones')
        .doc(docid)
        .update({
            Title: title
        })
        .then(() => {
            setSaved('flex')
         })

    }

    const deadlineHandler = (e) => {

        const deadline = e.target.value 
        
        const docid = e.target.dataset.docid

        setDeadline(deadline)

        if(docid === undefined){
            return
        } else {
            db.collection('Milestones')
            .doc(docid)
            .update({
                Deadline: deadline
            })
            .then(() => {
                setSaved('flex')
             })
        }

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
                    {ImpactGuideMenu(16)}
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
                    <div className='text-section'>
                        <p><b>Mijlpalen zijn doelen die een stip aan de horizon geven.</b></p>
                        <p>Voor jezelf en je team 
                            geeft dit een mooi vergezicht en voor je stakeholders geeft dit een beeld 
                            van jullie ambities en voortgang.
                        </p>
                        <p>
                            Mijlpalen zijn aantallen outputs. Ze zijn dus zo concreet dat je ermee kunt rekenen.
                        </p>
                        <p>Wanneer je een mijlpaal toevoegt kies je een naam voor de mijlpaal en een aantal. 
                            Bij het invullen van de naam noteer je het doel voor jullie outputs in woorden. Bijvoorbeeld:</p>
                        <ul>
                            <li>Tien klanten</li>
                            <li>Tien deelnemers aan training</li>
                            <li>Honderd kg opgeruimd plastic</li>
                            <li>Vijftig verkochte producten</li>
                        </ul>
                        <p>Bij het invullen van het aantal noteer je het nummer dat je in de naam hebt genoemd. 
                            Zo weet de software waar het mee moet rekenen.</p>
                    </div>
                </div>
                <Modal
                    isOpen={modalOpen}
                    onRequestClose={closeModal}
                    style={modalStyles}
                    contentLabel="Upload banner"
                    >
                    <img src={growIcon} alt="" />
                    <p><b>Geef de mijlpaal een aantal</b></p>
                    <input type="number" onChange={numberHandler} />
                    <p><b>Selecteer een subdivisie</b></p>
                    <select name="" id="milestone-modal-select" onChange={subdivisionHandler}>
                        <option value="">-- Selecteer een subdivisie --</option>
                        <option value="1">1</option>
                        <option value='5'>5</option>
                        <option value='10'>10</option>
                        <option value='20'>20</option>
                        <option value='100'>100</option>
                    </select>
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
                <div className='text-section'>
                    <div style={{display: premium ? 'block' : 'none'}}>
                        <p><b>1. Selecteer een output waaraan je de mijlpaal wilt koppelen</b></p>
                        <select name="" id="" onChange={outputHandler}>
                            <option value="">-- Selecteer een output --</option>
                            {outputs && outputs.map(output => (
                                <option key={output.ID} value={output.ID} data-title={output.Title} data-docid={output.docid} data-activity={output.Activity} data-singular={output.Singular} data-activityid={output.ActivityID}>{output.Title} (Activiteit: {output.Activity})</option>
                            ))}
                        </select>
                        <div style={{display: outputID ? 'block' : 'none'}}>
                            <p><b>2. Beheer je mijlpalen </b></p>
                            <div className='list-container'>
                                <div className='list-top-row-container'>
                                    <img src={plusButton} onClick={() => setModalOpen(true)} alt="" />
                                </div>
                                <div className='table-container'>
                                    <table>
                                        <tr>
                                            <th>AANTAL</th>
                                            <th>TITLE</th>
                                            <th>DEADLINE</th>
                                            <th>VERWIJDER</th>
                                        </tr>
                                        {milestones && milestones.map(milestone => (
                                            <tr key={milestone.ID}>
                                                 <td>
                                                     <p>{milestone.Number}</p>
                                                </td>
                                                <td>
                                                    <input type="text" placeholder='Geef je milestone een titel' defaultValue={milestone.OutputTitle} data-docid={milestone.docid} onChange={titleHandler} />
                                                </td>
                                               
                                                <td>
                                                    <input type="date" placeholder='0' defaultValue={milestone.Deadline} data-docid={milestone.docid} onChange={deadlineHandler} />
                                                </td>
                                                <td>
                                                    <img className='table-delete-icon' data-docid={milestone.docid} onClick={deleteMilestone} src={deleteIcon} alt="" />
                                                </td>
                                            </tr>
                                        ))}
                                    </table>
                                </div>
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
                        <p><b>Je kunt je de mijlpalen hier terug vinden:</b></p>
                        <div className="channel-inner-div">
                            <div className='activity-meta-title-container'>
                                <img src={growIcon} alt="" />
                                <NavLink activeClassName='active' to={`/${client}/MilestoneSettings`}>Mijlpalen</NavLink>
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
                        <p>In de volgende stap ga je vragenlijsten toevoegen.</p>
                        <NavLink to={`/${client}/Questionnaires`} ><button>Volgende stap</button></NavLink>
                    </div>
                </div>
            </div> 
        </div>
    </div>
  )
}

export default MeasureOutput