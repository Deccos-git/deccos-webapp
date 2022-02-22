import LeftSideBar from "../LeftSideBar";
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import RightSideBar from "../rightSideBar/RightSideBar"
import MenuStatus from "../../hooks/MenuStatus";
import { useFirestoreID, useFirestoreMessages, } from "../../firebase/useFirestore"
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
    const reactions = useFirestoreMessages("Messages", route )

    useEffect(() => {

        tasks && tasks.forEach(task => {
            setTask(task.Task)
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

    const userLink = (e) => {

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
        }
    }

    const priorityHandler = (e) => {

        const priority = e.target.options[e.target.selectedIndex].value 
        const id = e.target.dataset.id

        savePriority(priority, id)

    }

    const savePriority = (priority, id) => {

        db.collection('Tasks')
        .doc(id)
        .update({
            Priority: priority
        })
    } 

    const titleHandler = (e) => {
        const title = e.target.value

        saveTitle(title)

    }

    const saveTitle = (title, id) => {

        db.collection('Tasks')
        .doc(taskDocid)
        .update({
            Task: title,
            Title: title
        })
    }

    return (
         <div className="main">
        <LeftSideBar />
        <LeftSideBarFullScreen/>
        <div className="main-container" style={{display: menuState}}>
            <div className="previous-message-container" onClick={backToOverview}>
                <img src={ArrowLeftIcon} alt="" />
                <p>Taak overzicht</p>
            </div>
            <div className='page-header task-detail-header'>
                <input id='input-task-edit-title' type="text" defaultValue={task} onChange={titleHandler}/>
                {tasks && tasks.map(task => (
                <div className='task-detail-container'>
                    <div className='task-detail-inner-container'>
                        <div>
                            <h3>Afgerond</h3>
                            <p>{taskCompleted()}</p>
                        </div>
                        <div className='pointer'>
                            <h3>Activiteit</h3>
                            <p data-id={task.ActivityID} onClick={activityLink}>{task.Activity}</p>
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
                            <p>{task.Date}</p>
                        </div>
                        <div>
                            <h3>Toegewezen aan</h3>
                            <div className='task-detail-user-container'>
                                <img src={task.AppointedPhoto ? task.AppointedPhoto : userIcon} data-id={task.AppointedID} onClick={appointedLink} alt=""/>
                                <p data-id={task.AppointedID} onClick={appointedLink}>{task.AppointedName}</p>
                            </div>
                            
                        </div>
                        <div>
                            <h3>Gecreerd door</h3>
                            <div className='task-detail-user-container'>
                                <img src={task.UserPhoto} data-id={task.UserID} onClick={userLink} alt=""/>
                                <p data-id={task.UserID} onClick={userLink}>{task.User}</p>
                            </div>
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
        <RightSideBar />
        </div>
    )
}

export default TaskDetail
