import RightSideBar from "../rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "../LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "../LeftSideBarAuthProfileFullScreen";
import MenuStatus from "../../hooks/MenuStatus";
import {useFirestore, useFirestoreUsers} from "../../firebase/useFirestore"
import { useState, useEffect, useContext } from 'react'
import { Auth } from '../../StateManagment/Auth';
import uuid from 'react-uuid';
import { db, timestamp } from "../../firebase/config.js"
import { client } from "../../hooks/Client"
import completeIcon from '../../images/icons/complete-icon.png'
import deleteIcon from '../../images/icons/delete-icon.png'

const TaskSettings = () => {
    const [authO] = useContext(Auth)

    const menuState = MenuStatus()

    const tasks = useFirestore("Tasks")
    const activities = useFirestore("Activities")
    const users = useFirestoreUsers(false)
    const banners = useFirestore('Banners')


    const [activityTitle, setActivityTitle] = useState('')
    const [activityID, setActivityID] = useState('')
    const [taskTitle, setTaskTitle] = useState('')
    const [date, setDate] = useState('')
    const [userID, setUserID] = useState('')
    const [userName, setUserName] = useState('')
    const [userPhoto, setUserPhoto] = useState('')
    const [userEmail, setUserEmail] = useState('')
    const [priority, setPriority] = useState('')
    const [headerPhoto, setHeaderPhoto] = useState('')

    useEffect(() => {
        banners && banners.forEach(banner => {
            const header = banner.NewGoal
            setHeaderPhoto(header)
        })
    }, [banners])

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

        const ID = uuid()

        db.collection('Tasks')
        .doc()
        .set({
            Activity: activityTitle,
            ActivityID: activityID,
            ID: ID,
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
            db.collection("AllActivity")
            .doc()
            .set({
                Title: taskTitle,
                Type: "NewTask",
                Compagny: client,
                Timestamp: timestamp,
                ID: uuid(),
                Description: "heeft een nieuwe taak toegevoegd:",
                ButtonText: "Bekijk taak",
                User: authO.UserName,
                UserPhoto: authO.Photo,
                UserID: authO.ID,
                Banner: headerPhoto,
                Link: `TaskDetail/${ID}`
            }) 
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
                    <h3>Taak toevoegen</h3>
                    <h4>Selecteer een activiteit</h4>
                    <select name="" id="" onChange={activityHandler}>
                        <option value="">-- Selecteer een activiteit --</option>
                        {activities && activities.map(activity => (
                            <option value="" key={activity.ID} data-id={activity.ID} data-title={activity.Activity}>{activity.Activity}</option>
                        ))}
                    </select>
                    <h4>Prioriteit</h4>
                    <select name="" id="" onChange={priorityHandler}>
                        <option value="no-prioority">-- selecteer prioriteit --</option>
                        <option value="urgent-important">Urgent en belangrijk</option>
                        <option value="urgent-not-important">Urgent en niet belangrijk</option>
                        <option value="not-urgent-important">Niet urgent en belangrijk</option>
                        <option value="not-urgent-not-important">Niet urgent en niet belangrijk</option>
                    </select>
                    <h4>Beschrijf taak</h4>
                    <input type="text" placeholder='Beschrijf hier je taak' onChange={taskHandler}/>
                    <h4>Vervaldatum</h4>
                    <input type="date" onChange={dateHandler} />
                    <h4>Taak toewijzen aan</h4>
                        <select className="userrole-select" name="" id="" onChange={userHandler}>
                            <option value="">--- Selecteer ---</option>
                            {users && users.map(user => (
                                <option key={user.ID} data-id={user.ID} data-name={user.UserName} data-photo={user.Photo} data-email={user.Email} key={user.ID}>{user.UserName}</option>
                            ))}
                        </select>
                    <button className='button-simple' onClick={saveTask}>Opslaan</button>
                </div>
                <div className='divider'>
                    <h3>Community taken</h3>
                    {tasks && tasks.map(task => (
                        <div className='channel-container'>
                            <p>{task.Task}</p>
                            <img src={deleteIcon} alt="" className="userrole-users-delete-button" data-docid={task.docid} onClick={deleteTask}/>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        <RightSideBar />
        </div>
    )
}

export default TaskSettings
