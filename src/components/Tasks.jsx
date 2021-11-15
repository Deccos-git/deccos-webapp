import LeftSideBar from "./LeftSideBar";
import LeftSideBarFullScreen from "./LeftSideBarFullScreen"
import RightSideBar from "./rightSideBar/RightSideBar"
import MenuStatus from "../hooks/MenuStatus";
import { useFirestore, useFirestoreMyTasks } from "../firebase/useFirestore"
import { client } from "../hooks/Client"
import { useHistory } from "react-router-dom";
import { db } from "../firebase/config";
import completeIcon from '../images/icons/complete-icon.png'
import userIcon from '../images/icons/user-icon.png'
import deleteTaskIcon from '../images/icons/delete-task-icon.png'
import Location from "../hooks/Location"
import { useContext, useState, useEffect } from 'react';

const Tasks = () => {
    const [allTasksDisplay, setAllTasksDisplay] = useState('flex')
    const [myTasksDisplay, setMyTasksDisplay] = useState('none')
    const [allTasksTab, setAllTasksTab] = useState('active-tab')
    const [myTasksTab, setMyTasksTab] = useState('not-active-tab')

    const menuState = MenuStatus()
    const history = useHistory();
    const route = Location()[3]

    const tasks = useFirestore("Tasks")
    const myTasks = useFirestoreMyTasks(route)

    const taskLink = (e) => {
        const id = e.target.dataset.id

        history.push(`/${client}/TaskDetail/${id}`)

    }

    const appointedPhoto = (task) => {

        if(task.AppointedPhoto === ""){
            return userIcon
        } else if (task.AppointedPhoto !== ""){
            return task.AppointedPhoto
        }
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

    const showAllTasks = () => {
        setAllTasksDisplay('block')
        setMyTasksDisplay('none')
        setAllTasksTab('active-tab')
        setMyTasksTab('not-active-tab')
    }

    const showMyTasks = () => {
        setAllTasksDisplay('none')
        setMyTasksDisplay('flex')
        setAllTasksTab('not-active-tab')
        setMyTasksTab('active-tab')
    }

    const MyTasks = () => {
        return(
            <div className='mytask-overview-container' >
                {myTasks && myTasks.map(task => (
                    <div className='task-overview-container' key={task.ID} style={{display: myTasksDisplay}}>
                        <div className='task-container' style={{backgroundColor: task.BackgroundColor}}>
                            <div className='task-inner-container'>
                                <img src={task.Icon} data-docid={task.docid} data-completed={task.Completed} onClick={taskCompleted} alt=""/>
                                <p className='task-description'>{task.Task}</p>
                                <div className='appointed-container'>
                                    <img className='task-appointed-photo' onClick={linkProfile} src={appointedPhoto(task)} data-id={task.AppointedID} alt=""/>
                                </div>
                                <button className='button-simple button-activity-detail' data-id={task.ID} onClick={taskLink}>Details</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="main">
        <LeftSideBar />
        <LeftSideBarFullScreen/>
        <div className="main-container" style={{display: menuState}}>
            <div className='chat-header'>
                <h1>Taken</h1>
                <div className='group-navigation-container'>
                    <p className={allTasksTab} onClick={showAllTasks}>Alle taken</p>
                    <p className={myTasksTab} onClick={showMyTasks}>Mijn taken</p>
                </div>
            </div>
            {tasks && tasks.map(task => (
                <div className='task-overview-container' key={task.ID} style={{display: allTasksDisplay}}>
                     <div className='task-container' style={{backgroundColor: task.BackgroundColor}}>
                         <div className='task-inner-container'>
                            <img src={task.Icon} data-docid={task.docid} data-completed={task.Completed} onClick={taskCompleted} alt=""/>
                            <p className='task-description'>{task.Task}</p>
                            <div className='appointed-container'>
                                <img className='task-appointed-photo' onClick={linkProfile} src={appointedPhoto(task)} data-id={task.AppointedID} alt=""/>
                            </div>
                            <button className='button-simple button-activity-detail' data-id={task.ID} onClick={taskLink}>Details</button>
                         </div>
                    </div>
                </div>
            ))}
            <MyTasks/>
        </div>
        <RightSideBar />
        </div>
    )
}

export default Tasks
