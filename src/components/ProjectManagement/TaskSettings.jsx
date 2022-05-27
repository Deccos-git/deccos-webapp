import LeftSideBar from "../LeftSideBar";
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import MenuStatus from "../../hooks/MenuStatus";
import {useFirestore, useFirestoreUsersApproved} from "../../firebase/useFirestore"
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
    const banners = useFirestore('Banners')
    const users = useFirestoreUsersApproved(false)
    const outputs = useFirestore('Outputs')


    const [outputTitle, setOutputTitle] = useState('')
    const [outputID, setOutputID] = useState('')
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

    const outputHandler = (e) => {
        const outputTitle = e.target.options[e.target.selectedIndex].dataset.title
        const outputID = e.target.options[e.target.selectedIndex].dataset.id

        setOutputTitle(outputTitle)
        setOutputID(outputID)
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
            Output: outputTitle,
            OutputID: outputID,
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
    }

    return (
        <div className="main">
        <LeftSideBar />
        <LeftSideBarFullScreen/>
        <div className="main-container" style={{display: menuState}}>
            <div className="main-container">
                <div className="page-header">
                    <h1>Taak toevoegen</h1>
                </div>
                <div className='profile profile-auth-profile'>
                    <h4>Selecteer een output</h4>
                    <select name="" id="" onChange={outputHandler}>
                        <option value="">-- Selecteer een output --</option>
                        {outputs && outputs.map(output => (
                            <option value="" key={output.ID} data-id={output.ID} data-title={output.Title}>{output.Title} (Activiteit: {output.Activity})</option>
                        ))}
                    </select>
                    <h3>Prioriteit</h3>
                    <select name="" id="" onChange={priorityHandler}>
                        <option value="no-prioority">-- selecteer prioriteit --</option>
                        <option value="urgent-important">Urgent en belangrijk</option>
                        <option value="urgent-not-important">Urgent en niet belangrijk</option>
                        <option value="not-urgent-important">Niet urgent en belangrijk</option>
                        <option value="not-urgent-not-important">Niet urgent en niet belangrijk</option>
                    </select>
                    <h3>Beschrijf taak</h3>
                    <input type="text" placeholder='Beschrijf hier je taak' onChange={taskHandler}/>
                    <h3>Vervaldatum</h3>
                    <input type="date" onChange={dateHandler} />
                    <h3>Taak toewijzen aan</h3>
                    <select className="userrole-select" name="" id="" onChange={userHandler}>
                        <option value="">--- Selecteer ---</option>
                        {users && users.map(user => (
                            <option key={user.UserID} data-id={user.ID} data-name={user.UserName} data-photo={user.Photo} data-email={user.Email} key={user.ID}>{user.UserName}</option>
                        ))}
                    </select>
                    <div className='button-container-margin-top'>
                        <button className='button-simple' onClick={saveTask}>Opslaan</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default TaskSettings
