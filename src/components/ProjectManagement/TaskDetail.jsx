import LeftSideBar from "../LeftSideBar";
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import MenuStatus from "../../hooks/MenuStatus";
import { useFirestoreUsersApproved, useFirestoreID, useFirestoreMessages, } from "../../firebase/useFirestore"
import { useState, useEffect } from 'react'
import Location from "../../hooks/Location"
import { useHistory } from "react-router-dom";
import { client } from "../../hooks/Client"
import ArrowLeftIcon from '../../images/icons/arrow-left-icon.png'
import { db } from "../../firebase/config";
import userIcon from '../../images/icons/user-icon.png'
import Reaction from "../Community/Reaction"
import MessageBar from "../Community/MessageBar"

const TaskDetail = () => {
    const [task, setTask] = useState(null)
    const [completed, setCompleted] = useState('')
    const [taskID, setTaskID] = useState('')
    const [taskDocid, setTaskDocid] = useState('')

    const menuState = MenuStatus()
    const route = Location()[3]
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const history = useHistory();

    const tasks = useFirestoreID('Tasks', route)
    const reactions = useFirestoreMessages("Messages", route)
    const users = useFirestoreUsersApproved(false)

    useEffect(() => {

        tasks && tasks.forEach(task => {
            setTask(task.Title)
            setCompleted(task.Completed)
            setTaskID(task.ActivityID)
            setTaskDocid(task.docid)
        })
    }, [tasks])

    const taskCompleted = () => {
        if(completed === false){
            return 'Nee'
        } else if (completed === true){
            return 'Ja'
        }
    }

    const backToOverview = () => {

        history.push(`/${client}/Tasks`)

    }

    const appointedLink = (e) => {

        const id = e.target.dataset.id

        history.push(`/${client}/PublicProfile/${id}`)

    }

    const activityLink = (e) => {

        const id = e.target.dataset.id

        history.push(`/${client}/ActivityDetail/${id}`)

    }

    const PriorityColorContainer = ({priority}) => {

        if(priority === 'urgent-important'){
            return <div className='priority-color-container' >
                        <div className='priority-color' style={{backgroundColor: 'red'}}></div>
                        <p>Urgent en belangrijk</p>
                </div>
        } else if(priority === 'urgent-not-important'){
            return <div className='priority-color-container'>
                            <div className='priority-color' style={{backgroundColor: 'orange'}}></div>
                            <p>Urgent en niet belangrijk</p>
                    </div>
        } else if(priority === 'not-urgent-important'){
            return <div className='priority-color-container'>
                            <div className='priority-color' style={{backgroundColor: 'yellow'}}></div>
                            <p>Niet urgent en belangrijk</p>
                    </div>
        } else if(priority === 'not-urgent-not-important'){
            return <div className='priority-color-container'>
                            <div className='priority-color' style={{backgroundColor: 'green'}}></div>
                            <p>Niet urgent en niet belangrijk</p>
                    </div>
        } else if(priority === undefined){
            return null
        } else if(priority === ''){
            return null
        }
    }

    const priorityHandler = (e) => {

        const priority = e.target.options[e.target.selectedIndex].value 
        const id = e.target.dataset.id

        db.collection('Tasks')
        .doc(id)
        .update({
            Priority: priority
        })

    }

    const titleHandler = (e) => {
        const title = e.target.value

        db.collection('Tasks')
        .doc(taskDocid)
        .update({
            Title: title
        })

    }

    const deadlineHandler = (e) => {
        const deadline = e.target.value

        db.collection('Tasks')
        .doc(taskDocid)
        .update({
            Deadline: deadline
        })

    }

    const appointedHandler = (e) => {
        const appointed = e.target.options[e.target.selectedIndex].value 
        const appointedID = e.target.options[e.target.selectedIndex].dataset.id
        const appointedPhoto = e.target.options[e.target.selectedIndex].dataset.photo
        const appointedEmail = e.target.options[e.target.selectedIndex].dataset.email

        db.collection('Tasks')
        .doc(taskDocid)
        .update({
            AppointedName: appointed,
            AppointedID: appointedID,
            AppointedPhoto: appointedPhoto,
            ApppointedEmail: appointedEmail
        })

    }

    return (
         <div className="main">
        <LeftSideBar />
        <LeftSideBarFullScreen/>
        <div className="main-container" style={{display: menuState}}>
            <div className='page-header task-detail-header'>
                <h1>{task}</h1>
                {tasks && tasks.map(task => (
                <div className='task-detail-container'>
                    <div className='task-detail-inner-container'>
                        <div>
                            <h3>Afgerond</h3>
                            <p>{taskCompleted()}</p>
                        </div>
                        <div className='pointer'>
                            <h3>Activiteit</h3>
                            <p data-id={task.ActivityID} onClick={activityLink}>{task.ActivityTitle}</p>
                        </div>
                        <div>
                            <h3>Prioriteit</h3>
                            <PriorityColorContainer priority={task.Priority && task.Priority}/>
                            <select name="" id="" data-id={task.docid} onChange={priorityHandler}>
                                <option value="no-prioority">-- selecteer prioriteit --</option>
                                <option value="urgent-important">Urgent en belangrijk</option>
                                <option value="urgent-not-important">Urgent en niet belangrijk</option>
                                <option value="not-urgent-important">Niet urgent en belangrijk</option>
                                <option value="not-urgent-not-important">Niet urgent en niet belangrijk</option>
                            </select>
                        </div>
                        <div>
                            <h3>Vervaldatum</h3>
                            <input type="date" defaultValue={task.Deadline} onChange={deadlineHandler} />
                            <p>{task.Date}</p>
                        </div>
                        <div>
                            <h3>Toegewezen aan</h3>
                            <select name="" id="" defaultValue={task.AppointedName} onChange={appointedHandler}>
                                <option value="">-- Selecteer gebruiker --</option>
                                {users && users.map(user => (
                                    <option data-id={user.ID} data-photo={user.Photo} data-email={user.Email} value={user.UserName}>{user.UserName}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <h3>Gecreerd op</h3>
                            <p>{task.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                        </div>
                    </div>
                </div>
            ))}
            </div>
            <h2>Berichten</h2>
            <MessageBar/>
            <div className="reaction-area">
                {reactions && reactions.map(reaction => (
                    <Reaction message={reaction}/>
                ))}
            </div>
        </div>
    </div>
    )
}

export default TaskDetail
