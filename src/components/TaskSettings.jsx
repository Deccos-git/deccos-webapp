import RightSideBar from "./rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "./LeftSideBarAuthProfileFullScreen";
import MenuStatus from "../hooks/MenuStatus";
import {useFirestore, useFirestoreUsers} from "../firebase/useFirestore"
import { useState, useEffect, useContext } from 'react'
import { Auth } from '../StateManagment/Auth';
import uuid from 'react-uuid';
import { db, timestamp } from "../firebase/config.js"
import { client } from "../hooks/Client"
import completeIcon from '../images/icons/complete-icon.png'

const TaskSettings = () => {
    const [authO] = useContext(Auth)

    const menuState = MenuStatus()

    const tasks = useFirestore("Tasks")
    const activities = useFirestore("Activities")
    const users = useFirestoreUsers(false)

    const [activityTitle, setActivityTitle] = useState('')
    const [activityID, setActivityID] = useState('')
    const [taskTitle, setTaskTitle] = useState('')
    const [userID, setUserID] = useState('')
    const [userName, setUserName] = useState('')
    const [userPhoto, setUserPhoto] = useState('')
    const [userEmail, setUserEmail] = useState('')

    const activityHandler = (e) => {
        const activityTitle = e.target.options[e.target.selectedIndex].dataset.title
        const activityID = e.target.options[e.target.selectedIndex].dataset.id

        setActivityTitle(activityTitle)
        setActivityID(activityID)
    }

    const taskHandler = (e) => {

        const title = e.target.value 

        setTaskTitle(title)

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

        db.collection('Tasks')
        .doc()
        .set({
            Activity: activityTitle,
            ActivityID: activityID,
            ID: uuid(),
            Compagny: client,
            Timestamp: timestamp,
            User: authO.UserName,
            UserPhoto: authO.Photo,
            UserID: authO.ID,
            Task: taskTitle,
            AppointedID: userID,
            AppointedName: userName,
            AppointedPhoto: userPhoto,
            AppointedEmail: userEmail,
            Completed: false,
            Icon: completeIcon
        })
    }

    const deleteTask = (e) => {
        const docid = e.target.dataset.docid

        db.collection('Tasks')
        .doc(docid)
        .delete()
    }

    return (
        <div className="main">
        <LeftSideBarAuthProfile />
        <LeftSideBarAuthProfileFullScreen/>
        <div className="profile profile-auth-profile" style={{display: menuState}}>
            <div className="settings-inner-container">
                <div className="divider card-header">
                    <h1>Taken</h1>
                    <p>Pas de instellingen aan de taken aan</p>
                </div>
                <div className='divider'>
                    <h3>Community taken</h3>
                    {tasks && tasks.map(task => (
                        <div className='channel-container'>
                            <p>{task.Task}</p>
                            <p className='userrole-users-delete-button' data-docid={task.docid} onClick={deleteTask}>Verwijderen</p>
                        </div>
                    ))}
                </div>
                <div className='divider'>
                    <h3>Taak toevoegen</h3>
                    <h4>Selecteer een activiteit</h4>
                    <select name="" id="" onChange={activityHandler}>
                        <option value="">-- Selecteer een activiteit --</option>
                        {activities && activities.map(activity => (
                            <option value="" key={activity.ID} data-id={activity.ID} data-title={activity.Activity}>{activity.Activity}</option>
                        ))}
                    </select>
                    <h4>Beschrijf taak</h4>
                    <input type="text" placeholder='Beschrijf hier je taak' onChange={taskHandler}/>
                    <h4>Taak toewijzen aan</h4>
                        <select className="userrole-select" name="" id="" onChange={userHandler}>
                            <option value="">--- Selecteer ---</option>
                            {users && users.map(user => (
                                <option key={user.ID} data-id={user.ID} data-name={user.UserName} data-photo={user.Photo} data-email={user.Email} key={user.ID}>{user.UserName}</option>
                            ))}
                        </select>
                    <button className='button-simple' onClick={saveTask}>Opslaan</button>
                </div>
            </div>
        </div>
        <RightSideBar />
        </div>
    )
}

export default TaskSettings
