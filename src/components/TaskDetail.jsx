import LeftSideBar from "./LeftSideBar";
import LeftSideBarFullScreen from "./LeftSideBarFullScreen"
import RightSideBar from "./rightSideBar/RightSideBar"
import MenuStatus from "../hooks/MenuStatus";
import { useFirestoreID } from "../firebase/useFirestore"
import { useState, useEffect } from 'react'
import Location from "../hooks/Location"
import { useHistory } from "react-router-dom";
import { client } from "../hooks/Client"
import ArrowLeftIcon from '../images/icons/arrow-left-icon.png'

const TaskDetail = () => {
    const [task, setTask] = useState(null)
    const [completed, setCompleted] = useState('')
    const [taskID, setTaskID] = useState('')

    const menuState = MenuStatus()
    const route = Location()[3]
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const history = useHistory();

    const tasks = useFirestoreID('Tasks', route)

    useEffect(() => {

        tasks && tasks.forEach(task => {
            setTask(task.Task)
            setCompleted(task.Completed)
            setTaskID(task.ActivityID)
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

        history.push(`/${client}/ActivityDetail/${taskID}`)

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
            <div className='page-header'>
                <h1>{task}</h1>
            </div>
            {tasks && tasks.map(task => (
                <div className='task-detail-container'>
                    <div className='task-detail-inner-container'>
                        <div>
                            <h3>Afgerond</h3>
                            <p>{taskCompleted()}</p>
                        </div>
                        <div>
                            <h3>Activiteit</h3>
                            <p data-id={task.ID}>{task.Activity}</p>
                        </div>
                        <div>
                            <h3>Toegewezen aan</h3>
                            <div className='task-detail-user-container'>
                                <img src={task.AppointedPhoto} alt=""/>
                                <p>{task.AppointedName}</p>
                            </div>
                            
                        </div>
                        <div>
                            <h3>Gecreerd door</h3>
                            <div className='task-detail-user-container'>
                                <img src={task.UserPhoto} alt=""/>
                                <p>{task.User}</p>
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
        <RightSideBar />
        </div>
    )
}

export default TaskDetail
