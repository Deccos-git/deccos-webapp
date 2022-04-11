import LeftSideBar from "../LeftSideBar";
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import RightSideBar from "../rightSideBar/RightSideBar"
import MenuStatus from "../../hooks/MenuStatus";
import Location from "../../hooks/Location"
import Colors from "../../hooks/Colors";
import impactIcon from '../../images/icons/impact-icon.png'
import plusIcon from '../../images/icons/plus-icon.png'
import completeIcon from '../../images/icons/complete-icon.png'
import userIcon from '../../images/icons/user-icon.png'
import deleteIcon from '../../images/icons/delete-icon.png'
import deleteTaskIcon from '../../images/icons/delete-task-icon.png'
import settingsIcon from '../../images/icons/settings-icon.png'
import typeIcon from '../../images/icons/type-icon.png'
import resultsIcon from '../../images/icons/results-icon.png'
import festiveIcon from '../../images/icons/festive-icon.png'
import outputIcon from '../../images/icons/output-icon.png'
import Modal from 'react-modal';
import { useState, useEffect, useContext  } from 'react'
import { useFirestoreID, 
    useFirestoreOutputs, 
    useFirestore, 
    useFirestoreTasks, 
    useFirestoreImpactInstrumentsActivity,
    useFirestoreMilestonesActivity,
    useFirestoreGroupsActivity,
    useFirestoreResults,
    useFirestoreMilestonesInstrument
} from "../../firebase/useFirestore"
import { Auth } from '../../StateManagment/Auth';
import uuid from 'react-uuid';
import { db, timestamp } from "../../firebase/config.js"
import { client } from "../../hooks/Client"
import { useHistory } from "react-router-dom";
import Calendar from "../Calender";
import ButtonClicked from "../../hooks/ButtonClicked";
import ChatScreen from "../Community/ChatScreen";
import ManualResultsGraph from "../Impact/ManualResultsGraph";
import eventIcon from '../../images/icons/event-icon.png'
import duplicateIcon from '../../images/icons/duplicate-icon.png'
import progressIcon from '../../images/icons/progress-icon.png'
import MemberGraph from "../MemberGraph";

const Project = () => {
    const [authO] = useContext(Auth)

    const [tabTasks, setTabTasks] = useState('active-tab')
    const [tabInstruments, setTabInstruments] = useState('not-active-tab')
    const [tabMilestones, setTabMilestones] = useState('not-active-tab')
    const [tabAgenda, setTabAgenda] = useState('not-active-tab')
    const [tabGroup, setTabGroup] = useState('not-active-tab')
    const [tasksDisplay, setTasksDisplay] = useState('block')
    const [instrumentsDisplay, setInstrumentsDisplay] = useState('none')
    const [milestonesDisplay, setMilestonesDisplay] = useState('none')
    const [agendaDisplay, setAgendaDisplay] = useState('none')
    const [groupDisplay, setGroupDisplay] = useState('none')

    const menuState = MenuStatus()
    const route = Location()[3]
    const history = useHistory();
    Modal.setAppElement('#root');
    const options = { day: 'numeric', month: 'numeric', year: 'numeric'};

    const modalStyles = {
        content: {
          top: '50%',
          padding: '50px',
          borderRadius: '5px',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
        },
      };

    const projects = useFirestoreID('Projects', route)
    const tasks = useFirestoreTasks(route)

    const ActivityMeta = ({project}) => {
        const activities = useFirestoreID('Activities', project.ActivityID)

        return(
            <div>
                {activities && activities.map(activity => (
                    <div>
                        <div className='goal-meta-title-container'>
                            <img src={impactIcon} alt="" />
                            <h3>Impact</h3>
                        </div>
                        <p>{activity.Impact}</p>
                    </div>
                ))}
            </div>
        )
    }

    const Tasks = ({project}) => {
        const [modalOpen, setModalOpen] = useState(false);
        const [taskTitle, setTaskTitle] = useState('')
        const [date, setDate] = useState('')
        const [userID, setUserID] = useState('')
        const [userName, setUserName] = useState('')
        const [userPhoto, setUserPhoto] = useState('')
        const [userEmail, setUserEmail] = useState('')
        const [priority, setPriority] = useState('')
        const [headerPhoto, setHeaderPhoto] = useState('')
        const [instrumentID, setInstrumentID] = useState("")
        const [milestoneGoal, setMilestoneGoal] = useState('')
        const [milestoneDocid, setMilestoneDocid] = useState('')

        const projectManagers = useFirestore('ProjectManagers')
        const banners = useFirestore('Banners')
        const results = useFirestoreResults(instrumentID)
        const milestones = useFirestoreMilestonesInstrument(instrumentID)

        useEffect(() => {
            banners && banners.forEach(banner => {
                const header = banner.NewGoal
                setHeaderPhoto(header)
            })
        }, [banners])

        useEffect(() => {
            milestones && milestones.forEach(milestone => {
                setMilestoneGoal(milestone.Number)
                setMilestoneDocid(milestone.docid)
            })
        }, [milestones])
        

        // const addTask = () => {
        //     setModalOpen(true)

        // }

        // const taskHandler = (e) => {

        //     const title = e.target.value 
    
        //     setTaskTitle(title)
    
        // }
    
        // const priorityHandler = (e) => {
    
        //     const priority = e.target.options[e.target.selectedIndex].value 
    
        //     setPriority(priority)
    
        // }
    
        // const dateHandler = (e) => {
        //     const date = e.target.value 
    
        //     setDate(date)
        // }
    
        // const userHandler = (e) => {
        //     const id = e.target.options[e.target.selectedIndex].dataset.id
        //     const photo = e.target.options[e.target.selectedIndex].dataset.photo
        //     const username = e.target.options[e.target.selectedIndex].dataset.name
        //     const email = e.target.options[e.target.selectedIndex].dataset.email
    
        //     setUserID(id)
        //     setUserName(username)
        //     setUserPhoto(photo)
        //     setUserEmail(email)
    
        // }

        // const saveTask = (e) => {

        //     e.target.innerText = 'Opgeslagen'
        //     e.target.style.color = '#959595'
    
        //     setTimeout(() => {
        //         e.target.innerText = 'Opslaan'
        //         e.target.style.color = 'green'
        //     }, 10000);
    
        //     const ID = uuid()
    
        //     db.collection('Tasks')
        //     .doc()
        //     .set({
        //         ProjectID: project.ID,
        //         ID: uuid(),
        //         Compagny: client,
        //         Timestamp: timestamp,
        //         User: authO.UserName,
        //         UserPhoto: authO.Photo,
        //         UserID: authO.ID,
        //         Task: taskTitle,
        //         Title: taskTitle,
        //         Date: date,
        //         AppointedID: userID,
        //         AppointedName: userName,
        //         AppointedPhoto: userPhoto,
        //         AppointedEmail: userEmail,
        //         Completed: false,
        //         Icon: completeIcon,
        //         Type: 'Task',
        //         Priority: priority
        //     })
        //     .then(() => {
        //         db.collection("Search")
        //         .doc()
        //         .set({
        //             Name: taskTitle,
        //             Compagny: client,
        //             Type: 'Taak',
        //             Link: `TasksDetail/${ID}`
        //         })
        //     })
        //     .then(() => {
        //         closeModal()
        //     })
        // }

        // const closeModal = () => {
        //     setModalOpen(false);
        // }

        const deleteTask = (e) => {
            const id = e.target.dataset.id 
    
            db.collection('Tasks')
            .doc(id)
            .delete()
        }

        const taskLink = (e) => {
            const id = e.target.dataset.id
    
            history.push(`/${client}/TaskDetail/${id}`)
    
        }

        const totalResults = () => {

            const total = results.length 

            return total
        }

        const milestoneStatus = () => {

            const goal = milestoneGoal

            return goal

        }


        const taskCompleted = (e) => {

            const docid = e.target.dataset.docid 
            const completed = e.target.dataset.completed
            const id = e.target.dataset.instrumentid 

            setInstrumentID(id)

            console.log(totalResults())
            console.log(milestoneStatus())

            if(totalResults() === milestoneStatus()){

                db.collection('Milestones')
                .doc(milestoneDocid)
                .update({
                    Succes: true
                })
            }
    
            // if(completed === 'false'){
            //     db.collection('Tasks')
            //     .doc(docid)
            //     .update({
            //         Completed: true,
            //         BackgroundColor: '#b2d7bb',
            //         Icon: deleteTaskIcon
            //     })
            //     .then(() => {
            //         db.collection('Results')
            //         .doc()
            //         .set({
            //             Compagny: client,
            //             ID: uuid(),
            //             Result: 1,
            //             Timestamp: timestamp,
            //             InstrumentID: id,
            //             User: authO.UserName,
            //             UserPhoto: authO.Photo,
            //             UserID: authO.ID,
            //         })
            //     })
            // } else if (completed === 'true'){
            //     db.collection('Tasks')
            //     .doc(docid)
            //     .update({
            //         Completed: false,
            //         BackgroundColor: 'white',
            //         Icon: completeIcon
            //     })
            // }   
        }

        const linkProfile = (e) => {
            const id = e.target.dataset.id
    
            history.push(`/${client}/PublicProfile/${id}`)
        }

        const TaskPriority = ({task}) => {

            if(task.Priority === 'urgent-important'){
                return <div className='priority-color' style={{backgroundColor: 'red'}}></div>
            } else if(task.Priority === 'urgent-not-important'){
                return <div className='priority-color' style={{backgroundColor: 'orange'}}></div>
            } else if(task.Priority === 'not-urgent-important'){
                return <div className='priority-color' style={{backgroundColor: 'yellow'}}></div>
            } else if(task.Priority === 'not-urgent-not-important'){
                return <div className='priority-color' style={{backgroundColor: 'green'}}></div>
            } else if(task.Priority === undefined){
                return null
            } else if(task.Priority === ""){
                return null
            } else {
                return null
            }
        }

        const duplicateTask = (e) => {

            const taskTitle = e.target.dataset.task 
            const date = e.target.dataset.date 
            const userID = e.target.dataset.appointedid 
            const userName = e.target.dataset.appointedname
            const userPhoto = e.target.dataset.appointedphoto 
            const userEmail = e.target.dataset.appointedemail
            const priority = e.target.dataset.priority
            const activityID = e.target.dataset.activityid 
            const outputID = e.target.dataset.outputid 
            const instrumentID = e.target.dataset.instrumentid

            db.collection('Tasks')
            .doc()
            .set({
                ProjectID: project.ID,
                ID: uuid(),
                Compagny: client,
                Timestamp: timestamp,
                User: authO.UserName,
                UserPhoto: authO.Photo,
                UserID: authO.ID,
                Task: taskTitle,
                Date: date,
                AppointedID: userID,
                AppointedName: userName,
                AppointedPhoto: userPhoto,
                AppointedEmail: userEmail,
                Completed: false,
                Icon: completeIcon,
                Type: 'Task',
                Priority: priority,
                ActivityID: activityID,
                OutputID: outputID,
                InstrumentID: instrumentID
            })
        }

        return (
            <>
                <div className='task-overview-container add-task-container' style={{display: tasksDisplay}}>
                    {tasks && tasks.map(task => (
                    <div className='task-overview-container' key={task.ID}>
                        <div className='task-container' style={{backgroundColor: task.BackgroundColor}}>
                            <div className='task-inner-container'>
                                <img src={task.Icon} data-docid={task.docid} data-instrumentid={task.InstrumentID} data-completed={task.Completed} onClick={taskCompleted} alt=""/>
                                <p className='task-description'>{task.Task}</p>
                                <TaskPriority task={task}/>
                                <div className='appointed-container'>
                                    <img className='task-appointed-photo' onClick={linkProfile} src={task.AppointedPhoto ? task.AppointedPhoto : userIcon} data-id={task.AppointedID} alt=""/>
                                </div>
                                <img 
                                    src={duplicateIcon} 
                                    alt="" 
                                    data-task={task.Task} 
                                    data-date={task.Date} 
                                    data-priority={task.Priority} 
                                    data-appointedid={task.AppointedID} 
                                    data-appointedemail={task.AppointedEmail} 
                                    data-appointedphoto={task.AppointedPhoto} 
                                    data-appointedname={task.AppointedName}
                                    data-activityid={task.ActivityID}
                                    data-outputid={task.OutputID}
                                    data-instrumentid={task.InstrumentID}
                                    onClick={duplicateTask} 
                                />
                                <img src={settingsIcon} alt="" data-id={task.ID} onClick={taskLink}/>
                                <img src={deleteIcon} alt="" data-id={task.docid} onClick={deleteTask}/>
                            </div>
                        </div>
                    </div>
                ))}
                </div>
                {/* <Modal
                    isOpen={modalOpen}
                    onRequestClose={closeModal}
                    style={modalStyles}
                    contentLabel="Upload file"
                >
                <div className='add-image-container'>
                    <h2>Taak toevoegen</h2>
                    <h3>Beschrijf taak</h3>
                    <input type="text" placeholder='Beschrijf hier je taak' onChange={taskHandler}/>
                    <h3>Prioriteit</h3>
                    <select name="" id="" onChange={priorityHandler}>
                        <option value="no-prioority">-- selecteer prioriteit --</option>
                        <option value="urgent-important">Urgent en belangrijk</option>
                        <option value="urgent-not-important">Urgent en niet belangrijk</option>
                        <option value="not-urgent-important">Niet urgent en belangrijk</option>
                        <option value="not-urgent-not-important">Niet urgent en niet belangrijk</option>
                    </select>
                    <h3>Vervaldatum</h3>
                    <input type="date" onChange={dateHandler} />
                    <h3>Taak toewijzen aan</h3>
                        <select className="userrole-select" name="" id="" onChange={userHandler}>
                            <option value="">--- Selecteer ---</option>
                            {projectManagers&& projectManagers.map(user => (
                                <option key={user.UserID} data-id={user.UserID} data-name={user.UserName} data-photo={user.Photo} data-email={user.Email} key={user.ID}>{user.UserName}</option>
                            ))}
                        </select>
                    <button className='button-simple' onClick={saveTask}>Opslaan</button>
                </div>
                </Modal> */}
            </>
        )
    }

    const Instruments = ({project}) => {

        const instruments = useFirestoreImpactInstrumentsActivity(project.ActivityID)

        const Measures = ({instrument}) => {

            if(instrument.Output.Datatype === 'Manual'){
                 return(
                     <div>
                         <div className='activity-meta-title-container'>
                            <img src={resultsIcon} alt="" />
                            <h3>Resultaat</h3>
                        </div>
                        <div>
                            <ManualResultsGraph instrument={instrument}/>
                        </div>
                     </div>
                 )
            } else if(instrument.Output.Datatype === 'Questionnairy'){
                return(
                    <div>
                        <div className='activity-meta-title-container'>
                            <img src={resultsIcon} alt="" />
                            <h3>Resultaat van vragenlijst</h3>
                        </div>
                        <QuestionnaireResults instrument={instrument}/>
                    </div>
                )
            } else if(instrument.Output.Datatype === 'Members'){
                return(
                    <div>
                        <div className='activity-meta-title-container'>
                            <img src={resultsIcon} alt="" />
                            <h3>Resultaat</h3>
                        </div>
                        <MemberGraph/>
                    </div>
                )
            } 
            else {
                return(
                    <div>
                       
                    </div>
                )
            }
        }

        const datatype = (instrument) => {

            if(instrument.Output.Datatype === 'Manual'){
                return "Handmatig"
            } else if(instrument.Output.Datatype === 'Questionnairy'){
                return 'Vragenlijst'
            } else if(instrument.Output.Datatype === 'Members'){
                return 'Automatisch'
            }
        }

        const QuestionnaireResults = ({instrument}) => {

            const questionnaires = useFirestoreID('Questionnaires', instrument.Output.ID) 
    
            return(
                <div>
                    {questionnaires && questionnaires.map(questionnaire => (
                        <div className='questionnaire-results-container'>
                            <p>Aantal responses</p>
                            <p>{questionnaire.Responses}</p>
                            <p>Bekijk analyse</p>
                        </div>
                    ))}
                </div>
            )
        }

        return(
            <div className='card-container' style={{display: instrumentsDisplay}}>
                {instruments && instruments.map(instrument => (
                    <div className='instrument-card'>
                        <h2>{instrument.Output.Output} ({datatype(instrument)})</h2>
                        <div className='activity-meta-title-container'>
                            <img src={outputIcon} alt="" />
                            <h3>Output</h3>
                        </div>
                        <p className='questionnaire-results-container'>{instrument.OutputTitle}</p>
                        <div className='activity-meta-title-container'>
                            <img src={typeIcon} alt="" />
                            <h3>Type</h3>
                        </div>
                        <p className='questionnaire-results-container'>{datatype(instrument)}</p>
                        <Measures instrument={instrument}/>
                    </div>
                ))}
            </div>
        )
    }

    const Milestones = ({project}) => {
        const [color, setColor] = useState('')
        const [headerPhoto, setHeaderPhoto] = useState('')
        const [succes, setSucces] = useState(false)

        const colors = useFirestore('Colors')
        const banners = useFirestore('Banners')
        const milestones = useFirestoreMilestonesActivity(project.ActivityID)   

        useEffect(() => {
            colors && colors.forEach(color => {
                const background = color.Background 
    
                setColor(background)
            })
    
        },[colors])

        useEffect(() => {
            banners && banners.forEach(banner => {
                const header = banner.NewGoal
                setHeaderPhoto(header)
            })
          }, [banners])

        const MilestoneProgress = ({instrument}) => {
            const [goal, setGoal] = useState(0)

            const results = useFirestoreResults(instrument)

            useEffect(() => {
                milestones && milestones.forEach(milestone => {

                    setGoal(milestone.Number)
                    setSucces(milestone.Succes)

                })
             },[milestones])

             const succesColor = () => {
                 if(succes === true){
                     return '#b2d7bb'
                 }
             }

            return(
                <div style={{backgroundColor: succesColor()}}>
                    <div>
                        <p>Huidig: {results.length}</p>
                    </div>
                    <div>
                        <p>Doel: {goal}</p>
                    </div>

                </div>
            )
        }
   
        return(
            <div className='card-container' style={{display: milestonesDisplay}}>
                {milestones && milestones.map(milestone => (
                    <div className='instrument-card'>
                        <h2>{milestone.Title}</h2>
                        <div className='task-detail-inner-container'>
                            <div className='activity-meta-title-container'>
                                <img src={resultsIcon} alt="" />
                                <h3>Meetinstrument</h3>
                            </div>
                            <p className='questionnaire-results-container'>{milestone.Instrument}</p>
                            <div>
                                <div className='activity-meta-title-container'>
                                    <img src={progressIcon} alt="" />
                                    <h3>Voortgang</h3>
                                </div>
                                <MilestoneProgress instrument={milestone.InstrumentID}/>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    const Group = ({project}) => {

        const groups = useFirestoreGroupsActivity(project.ActivityID)
        
        return(
            <div style={{display: groupDisplay}} className='project-group-container'>
                {groups && groups.map(group => (
                    <ChatScreen group={group}/>
                ))}
            </div>
        )
    }

    const Agenda = () => {

        return(
            <div style={{display: agendaDisplay}} className='project-group-container'>
                <Calendar events={tasks}/>
            </div>
        )
    }

    const showTasks = () => {
        setTasksDisplay('block')
        setInstrumentsDisplay('none')
        setMilestonesDisplay('none')
        setAgendaDisplay('none')
        setGroupDisplay('none')
        setTabTasks('active-tab')
        setTabMilestones('not-active-tab')
        setTabGroup('not-active-tab')
        setTabAgenda('not-active-tab')
        setTabInstruments('not-active-tab')
    }

    const showInstruments= () => {
        setInstrumentsDisplay('block')
        setTasksDisplay('none')
        setMilestonesDisplay('none')
        setAgendaDisplay('none')
        setGroupDisplay('none')
        setTabTasks('not-active-tab')
        setTabMilestones('not-active-tab')
        setTabGroup('not-active-tab')
        setTabAgenda('not-active-tab')
        setTabInstruments('active-tab')
    }

    const showMilestones= () => {
        setMilestonesDisplay('block')
        setTasksDisplay('none')
        setInstrumentsDisplay('none')
        setAgendaDisplay('none')
        setGroupDisplay('none')
        setTabTasks('not-active-tab')
        setTabMilestones('active-tab')
        setTabGroup('not-active-tab')
        setTabAgenda('not-active-tab')
        setTabInstruments('not-active-tab')
    }

    const showAgenda= () => {
        setAgendaDisplay('block')
        setTasksDisplay('none')
        setInstrumentsDisplay('none')
        setMilestonesDisplay('none')
        setGroupDisplay('none')
        setTabTasks('not-active-tab')
        setTabMilestones('not-active-tab')
        setTabGroup('not-active-tab')
        setTabAgenda('active-tab')
        setTabInstruments('not-active-tab')
    }

    const showGroup= () => {
        setGroupDisplay('flex')
        setTasksDisplay('none')
        setInstrumentsDisplay('none')
        setMilestonesDisplay('none')
        setAgendaDisplay('none')
        setTabTasks('not-active-tab')
        setTabMilestones('not-active-tab')
        setTabGroup('active-tab')
        setTabAgenda('not-active-tab')
        setTabInstruments('not-active-tab')
    }

  return (
    <div className="main">
        <LeftSideBar />
        <LeftSideBarFullScreen/>
        <div className="main-container" style={{display: menuState}}>
            {projects && projects.map(project => (
                <>
                <div className='page-header'>
                    <h1>{project.Title}</h1>
                    <ActivityMeta project={project}/>
                    <div className='group-navigation-container'>
                        <p className={tabTasks} onClick={showTasks} >Taken</p>
                        <p className={tabInstruments} onClick={showInstruments}>Meetinstrumenten</p>
                        <p className={tabMilestones} onClick={showMilestones}>Mijlpalen</p>
                        <p className={tabAgenda} onClick={showAgenda}>Agenda</p>
                        <p className={tabGroup} onClick={showGroup}>Groep</p>
                    </div>
                </div>
                <Tasks project={project}/>
                <Instruments project={project}/>
                <Milestones project={project}/>
                <Agenda project={project}/>
                <Group project={project}/>
                </>
            ))}

        </div>
        <RightSideBar />
    </div>
  )
}

export default Project