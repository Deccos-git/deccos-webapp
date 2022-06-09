import LeftSideBar from "../LeftSideBar";
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import MenuStatus from "../../hooks/MenuStatus";
import { useFirestore, useFirestoreMyTasks } from "../../firebase/useFirestore"
import { client } from "../../hooks/Client"
import { useHistory } from "react-router-dom";
import { db, timestamp } from "../../firebase/config";
import completeIcon from '../../images/icons/complete-icon.png'
import userIcon from '../../images/icons/user-icon.png'
import deleteTaskIcon from '../../images/icons/delete-task-icon.png'
import plusIcon from '../../images/icons/plus-icon.png'
import deleteIcon from '../../images/icons/delete-icon.png'
import { useContext, useState, useEffect } from 'react';
import settingsIcon from '../../images/icons/settings-icon.png'
import uuid from 'react-uuid';
import { Auth } from '../../StateManagment/Auth';
import Premium from "../../hooks/Premium";
import PremiumNotice from "../PremiumNotice";

const Tasks = () => {
    const [authO] = useContext(Auth)

    const [activityFilter, setActivityFilter] = useState('')
    const [priorityFilter, setPriorityFilter] = useState('')
    const [completedFilter, setCompletedFilter] = useState('')
    const [appointedFilter, setAppointedFilter] = useState('')
    const [tasksOverview, setTasksOverview] = useState([])

    const menuState = MenuStatus()
    const history = useHistory();
    const premium = Premium()

    const tasks = useFirestore("Tasks")
    const activities = useFirestore('Activities')
    const projectManagers = useFirestore('ProjectManagers')

    const allTasks = () => {

        const taskArray = []

        tasks && tasks.forEach(task => {

            const taskObject = {
                ID: task.ID,
                Title: task.Title,
                docid: task.docid,
                BackgroundColor: task.BackgroundColor,
                Completed: task.Completed,
                Deadline: task.Deadline,
                Icon: task.Icon,
                Task: task.Title,
                AppointedID: task.AppointedID,
                AppointedPhoto: task.AppointedPhoto,
                Activity: task.ActivityTitle,
                OutputID: task.OutputID,
                Priority: task.Priority,
                Tags:[task.ActivityTitle, task.Priority, task.Completed.toString(), task.AppointedID, 'All', '',]
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
                Title: task.Title,
                BackgroundColor: task.BackgroundColor,
                Completed: task.Completed,
                Icon: task.Icon,
                Deadline: task.Deadline,
                Task: task.Title,
                AppointedID: task.AppointedID,
                AppointedPhoto: task.AppointedPhoto,
                Activity: task.ActivityTitle,
                OutputID: task.OutputID,
                Priority: task.Priority,
                Tags:[task.ActivityTitle, task.Priority, task.Completed.toString(), task.AppointedID, 'All', '', ]
            }

            taskArray.push(taskObject)

        })

        setTasksOverview(taskArray)

    },[tasks])

    const taskLink = (e) => {
        const id = e.target.dataset.id

        history.push(`/${client}/TaskDetail/${id}`)

    }

    const taskCompleted = (e) => {

        const docid = e.target.dataset.docid 
        const completed = e.target.dataset.completed
        const outputID = e.target.dataset.outputid

        if(completed === 'false'){
            db.collection('Tasks')
            .doc(docid)
            .update({
                Completed: true,
                BackgroundColor: '#63cadc',
                Icon: deleteTaskIcon
            })
            .then(() => {
                db.collection('Results')
                .doc()
                .set({
                    Compagny: client,
                    CompagnyID: client,
                    ID: uuid(),
                    Result: 1,
                    Timestamp: timestamp,
                    OutputID: outputID,
                    User: authO.UserName,
                    UserPhoto: authO.Photo,
                    UserID: authO.ID,
                })
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

    const addTaskLink = () => {
        
        history.push(`/${client}/TaskSettings`)

    }

    const deleteTask = (e) => {
        const id = e.target.dataset.id 

        db.collection('Tasks')
        .doc(id)
        .delete()
    }

    return (
    <div className="main">
        <LeftSideBar />
        <LeftSideBarFullScreen/>
        <div className="main-container" style={{display: menuState}}>
            <div className='page-header'>
                <h1>Taken</h1>
            </div>
            <div id='task-filter-container' style={{display: premium ? 'flex' : 'none'}}>
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
            <div id='tasks-outer-container' style={{display: premium ? 'flex' : 'none'}}>
                <div className='task-overview-container add-task-container' onClick={addTaskLink}>
                    <div className='task-inner-container'>
                        <img id='add-task-icon' src={plusIcon} alt="" />
                        <p>Taak toevoegen</p>
                    </div>
                </div>
                {tasksOverview && tasksOverview.map(task => (
                    <div className='task-overview-container' key={task.ID}>
                        <div className='task-container' style={{backgroundColor: task.BackgroundColor}}>
                            <div className='task-inner-container'>
                                {console.log(task.Title)}
                                <img src={task.Icon} data-docid={task.docid} data-outputid={task.OutputID} data-completed={task.Completed} onClick={taskCompleted} alt=""/>
                                <p className='task-description'>{task.Title}</p>
                                <p>{task.Deadline && task.Deadline}</p>
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
            <div style={{display: premium ? 'none' : 'flex'}}>
                <PremiumNotice/>
            </div>
        </div>
    </div>
    )
}

export default Tasks
