import LeftSideBar from "../LeftSideBar";
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import RightSideBar from "../rightSideBar/RightSideBar"
import MenuStatus from "../../hooks/MenuStatus";
import { useFirestore, useFirestoreMyTasks } from "../../firebase/useFirestore"
import { client } from "../../hooks/Client"
import { useHistory } from "react-router-dom";
import { db } from "../../firebase/config";
import completeIcon from '../../images/icons/complete-icon.png'
import userIcon from '../../images/icons/user-icon.png'
import deleteTaskIcon from '../../images/icons/delete-task-icon.png'
import Location from "../../hooks/Location"
import { useContext, useState, useEffect } from 'react';
import Calendar from "../Calender";
import settingsIcon from '../../images/icons/settings-icon.png'
import TaskSettings from "./TaskSettings";

const Tasks = () => {
    const [allTasksDisplay, setAllTasksDisplay] = useState('flex')
    const [myTasksDisplay, setMyTasksDisplay] = useState('none')
    const [calendarDisplay, setCalendarDisplay] = useState('none')
    const [allTasksTab, setAllTasksTab] = useState('active-tab')
    const [myTasksTab, setMyTasksTab] = useState('not-active-tab')
    const [calendarTab, setCalendarTab] = useState('not-active-tab')
    const [activityFilter, setActivityFilter] = useState('')
    const [priorityFilter, setPriorityFilter] = useState('')
    const [completedFilter, setCompletedFilter] = useState('')
    const [appointedFilter, setAppointedFilter] = useState('')

    const [tasksOverview, setTasksOverview] = useState([])

    const menuState = MenuStatus()
    const history = useHistory();
    const route = Location()[3]

    const tasks = useFirestore("Tasks")
    const activities = useFirestore('Activities')
    const projectManagers = useFirestore('ProjectManagers')

    const allTasks = () => {

        const taskArray = []

        tasks && tasks.forEach(task => {

            const taskObject = {
                ID: task.ID,
                docid: task.docid,
                BackgroundColor: task.BackgroundColor,
                Completed: task.Completed,
                Icon: task.Icon,
                Task: task.Task,
                AppointedID: task.AppointedID,
                AppointedPhoto: task.AppointedPhoto,
                Activity: task.Activity,
                Priority: task.Priority,
                Tags:[task.Activity, task.Priority, task.Completed.toString(), task.AppointedID, 'All', '',]
            }

            taskArray.push(taskObject)

        })

        return taskArray
    }

    useEffect(() => {

        const taskArray = []

        tasks && tasks.forEach(task => {

            const taskObject = {
                ID: task.ID,
                docid: task.docid,
                BackgroundColor: task.BackgroundColor,
                Completed: task.Completed,
                Icon: task.Icon,
                Task: task.Task,
                AppointedID: task.AppointedID,
                AppointedPhoto: task.AppointedPhoto,
                Activity: task.Activity,
                Priority: task.Priority,
                Tags:[task.Activity, task.Priority, task.Completed.toString(), task.AppointedID, 'All', '', ]
            }

            taskArray.push(taskObject)

        })

        setTasksOverview(taskArray)

    },[tasks])

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
        setCalendarDisplay('none')
        setAllTasksTab('active-tab')
        setCalendarTab('not-active-tab')
    }

    const showCalendar = () => {
        setAllTasksDisplay('none')
        setCalendarDisplay('flex')
        setAllTasksTab('not-active-tab')
        setCalendarTab('active-tab')
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
        }
    }

    const priorityFilterHandler = (e) => {

        const priority = e.target.options[e.target.selectedIndex].value 

        setPriorityFilter(priority)

    }

    const activityFilterHandler = (e) => {

        const activity = e.target.options[e.target.selectedIndex].value

        setActivityFilter(activity)
        
    }

    const completedHandler = (e) => {

        const completed = e.target.options[e.target.selectedIndex].value

        setCompletedFilter(completed)

    }

    const appointedHandler = (e) => {

        const appointed = e.target.options[e.target.selectedIndex].value

        setAppointedFilter(appointed)

    }

    const filter = () => {

        const filterArray = [activityFilter, priorityFilter, completedFilter, appointedFilter]

        const newArray = []

        console.log(filterArray)

        allTasks() && allTasks().forEach(task => {
           
            if(filterArray.every(tag => task.Tags.includes(tag))){
                newArray.push(task)
            }
        })

        setTasksOverview(newArray)

    }

    console.log(tasksOverview)

    return (
        <div className="main">
        <LeftSideBar />
        <LeftSideBarFullScreen/>
        <div className="main-container" style={{display: menuState}}>
            <div className='chat-header'>
                <h1>Taken</h1>
                <div className='group-navigation-container'>
                    <p className={allTasksTab} onClick={showAllTasks}>Lijst</p>
                    <p className={calendarTab} onClick={showCalendar}>Agenda</p>
                </div>
            </div>
            <div id='task-filter-container'>
                <div className='task-filter-inner-container'>
                    <h3>Toegewezen aan</h3>
                    <select name="" id="" onChange={appointedHandler}>
                        <option value="All">-- Alle --</option>
                        {projectManagers && projectManagers.map(manager => (
                            <option value={manager.UserID}>{manager.UserName}</option>
                        ))}
                    </select>

                </div>
                <div className='task-filter-inner-container'>
                    <h3>Activiteit</h3>
                    <select name="" id="" data-categorie={'activities'} onChange={activityFilterHandler}>
                        <option value='All'>-- alle -- </option>
                        {activities && activities.map(activity => (
                            <option value={activity.Activity} data-categorie={'activities'} key={activity.ID}>{activity.Activity}</option>
                        ))}
                    </select>
                </div>
                <div className='task-filter-inner-container'>
                    <h3>Prioriteit</h3>
                    <select name="" id="" data-categorie={'priorities'} onChange={priorityFilterHandler}>
                        <option value="All">-- alle --</option>
                        <option value="urgent-important">Urgent en belangrijk</option>
                        <option value="urgent-not-important">Urgent en niet belangrijk</option>
                        <option value="not-urgent-important">Niet urgent en belangrijk</option>
                        <option value="not-urgent-not-important">Niet urgent en niet belangrijk</option>
                    </select>
                </div>
                <div className='task-filter-inner-container'>
                    <h3>Afgerond</h3>
                    <select name="" id="" onChange={completedHandler}>
                        <option value="All">-- Alle --</option>
                        <option value={true}>Ja</option>
                        <option value={false}>Nee</option>
                    </select>
                </div>
                <div id='button-tasks-filter-container'>
                    <button onClick={filter}>Filter</button>
                </div>
            </div>
            {tasksOverview && tasksOverview.map(task => (
                <div className='task-overview-container' key={task.ID} style={{display: allTasksDisplay}}>
                     <div className='task-container' style={{backgroundColor: task.BackgroundColor}}>
                         <div className='task-inner-container'>
                            <img src={task.Icon} data-docid={task.docid} data-completed={task.Completed} onClick={taskCompleted} alt=""/>
                            <p className='task-description'>{task.Task}</p>
                            <TaskPriority task={task}/>
                            <div className='appointed-container'>
                                <img className='task-appointed-photo' onClick={linkProfile} src={appointedPhoto(task)} data-id={task.AppointedID} alt=""/>
                            </div>
                            <img src={settingsIcon} alt="" data-id={task.ID} onClick={taskLink}/>
                         </div>
                    </div>
                </div>
            ))}
            <div className='task-calendar-container' style={{display: calendarDisplay}}>
                <Calendar events={tasks}/>
            </div>
        </div>
        <RightSideBar/>
        </div>
    )
}

export default Tasks
