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
import Modal from 'react-modal';
import { useState, useEffect, useContext  } from 'react'
import { useFirestoreID, useFirestoreMessages, useFirestore , useFirestoreMilestoneSteps, useFirestoreTasks} from "../../firebase/useFirestore"
import { Auth } from '../../StateManagment/Auth';
import uuid from 'react-uuid';
import { db, timestamp } from "../../firebase/config.js"
import { client } from "../../hooks/Client"
import { useHistory } from "react-router-dom";

const Project = () => {
    const [authO] = useContext(Auth)

    const [tabTasks, setTabTasks] = useState('active-tab')
    const [outputTab, setOutputTab] = useState('not-active-tab')
    const [tasksDisplay, setTasksDisplay] = useState('block')
    const [outputsDisplay, setOutputsDisplay] = useState('none')

    const menuState = MenuStatus()
    const route = Location()[3]
    const history = useHistory();
    Modal.setAppElement('#root');

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

        const projectManagers = useFirestore('ProjectManagers')
        const banners = useFirestore('Banners')
        const tasks = useFirestoreTasks(route)

        useEffect(() => {
            banners && banners.forEach(banner => {
                const header = banner.NewGoal
                setHeaderPhoto(header)
            })
        }, [banners])

        const addTask = () => {
            setModalOpen(true)

        }

        const taskHandler = (e) => {

            const title = e.target.value 
    
            setTaskTitle(title)
    
        }
    
        const priorityHandler = (e) => {
    
            const priority = e.target.options[e.target.selectedIndex].value 
    
            setPriority(priority)
    
        }
    
        const dateHandler = (e) => {
            const date = e.target.value 
    
            setDate(date)
        }
    
        const userHandler = (e) => {
            const id = e.target.options[e.target.selectedIndex].dataset.id
            const photo = e.target.options[e.target.selectedIndex].dataset.photo
            const username = e.target.options[e.target.selectedIndex].dataset.name
            const email = e.target.options[e.target.selectedIndex].dataset.email
    
            setUserID(id)
            setUserName(username)
            setUserPhoto(photo)
            setUserEmail(email)
    
        }

        const saveTask = (e) => {

            e.target.innerText = 'Opgeslagen'
            e.target.style.color = '#959595'
    
            setTimeout(() => {
                e.target.innerText = 'Opslaan'
                e.target.style.color = 'green'
            }, 10000);
    
            const ID = uuid()
    
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
                Title: taskTitle,
                Date: date,
                AppointedID: userID,
                AppointedName: userName,
                AppointedPhoto: userPhoto,
                AppointedEmail: userEmail,
                Completed: false,
                Icon: completeIcon,
                Type: 'Task',
                Priority: priority
            })
            .then(() => {
                db.collection("Search")
                .doc()
                .set({
                    Name: taskTitle,
                    Compagny: client,
                    Type: 'Taak',
                    Link: `TasksDetail/${ID}`
                })
            })
            .then(() => {
                closeModal()
            })
        }

        const closeModal = () => {
            setModalOpen(false);
        }

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

        const taskCompleted = (e) => {

            const docid = e.target.dataset.docid 
            const completed = e.target.dataset.completed
    
            if(completed === 'false'){
                db.collection('Tasks')
                .doc(docid)
                .update({
                    Completed: true,
                    BackgroundColor: '#b2d7bb',
                    Icon: deleteTaskIcon
                })
            } else if (completed === 'true'){
                db.collection('Tasks')
                .doc(docid)
                .update({
                    Completed: false,
                    BackgroundColor: 'white',
                    Icon: completeIcon
                })
            }   
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

        return (
            <>
                <div className='task-overview-container add-task-container' style={{display: tasksDisplay}}>
                    <div className='task-inner-container' onClick={addTask}>
                        <img id='add-task-icon' src={plusIcon} alt="" />
                        <p>Taak toevoegen</p>
                    </div>
                    {tasks && tasks.map(task => (
                    <div className='task-overview-container' key={task.ID}>
                        <div className='task-container' style={{backgroundColor: task.BackgroundColor}}>
                            <div className='task-inner-container'>
                                <img src={task.Icon} data-docid={task.docid} data-completed={task.Completed} onClick={taskCompleted} alt=""/>
                                <p className='task-description'>{task.Task}</p>
                                <TaskPriority task={task}/>
                                <div className='appointed-container'>
                                    <img className='task-appointed-photo' onClick={linkProfile} src={task.AppointedPhoto ? task.AppointedPhoto : userIcon} data-id={task.AppointedID} alt=""/>
                                </div>
                                <img src={settingsIcon} alt="" data-id={task.ID} onClick={taskLink}/>
                                <img src={deleteIcon} alt="" data-id={task.docid} onClick={deleteTask}/>
                            </div>
                        </div>
                    </div>
                ))}
                </div>
                <Modal
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
                </Modal>
            </>
        )
    }

    const showTasks = () => {
        setTasksDisplay('block')
        setOutputsDisplay('none')
        setTabTasks('active-tab')
        setOutputTab('not-active-tab')
    }

    const showOutputs= () => {
        setTasksDisplay('none')
        setOutputsDisplay('flex')
        setTabTasks('not-active-tab')
        setOutputTab('active-tab')
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
                        <p className={outputTab} onClick={showOutputs}>Meetinstrumenten</p>
                        <p className={outputTab} onClick={showOutputs}>Mijlpalen</p>
                        <p className={outputTab} onClick={showOutputs}>Agenda</p>
                        <p className={outputTab} onClick={showOutputs}>Groep</p>
                    </div>
                </div>
                <Tasks project={project}/>
                </>
            ))}

        </div>
        <RightSideBar />
    </div>
  )
}

export default Project