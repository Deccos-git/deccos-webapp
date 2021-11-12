import LeftSideBar from "./LeftSideBar";
import LeftSideBarFullScreen from "./LeftSideBarFullScreen"
import RightSideBar from "./rightSideBar/RightSideBar"
import MenuStatus from "../hooks/MenuStatus";
import { useFirestoreID, useFirestoreTasks, useFirestoreTasksComplete } from "../firebase/useFirestore"
import Location from "../hooks/Location"
import { useState, useEffect } from 'react'
import completeIcon from '../images/icons/complete-icon.png'
import clockIcon from '../images/icons/clock-icon.png'
import hourglassIcon from '../images/icons/hourglass-icon.png'
import deleteTaskIcon from '../images/icons/delete-task-icon.png'
import { useHistory } from "react-router-dom";
import { client } from "../hooks/Client"
import { db } from "../firebase/config";

const ActivityDetail = () => {
    const [activity, setActivity] = useState(null)
    const [activityDocid, setActivityDocid] = useState('')
    const [effectShort, setEffectShort] = useState('')
    const [effectLong, setEffectLong] = useState('')
    const [progression, setProgression] = useState(0)

    const menuState = MenuStatus()
    const route = Location()[3]
    const history = useHistory();

    const tasks = useFirestoreTasks(route)
    const completedTasks = useFirestoreTasksComplete(route)
    const activities = useFirestoreID('Activities', route)

    useEffect(() => {

        activities && activities.forEach(activity => {
            setActivity(activity.Activity)
            setActivityDocid(activity.docid)
            setEffectShort(activity.EffectShort)
            setEffectLong(activity.EffectLong)
        })
    }, [activities])

    useEffect(() => {
            const progress = 100/tasks.length*completedTasks.length
            setProgression(progress) 
    }, [completedTasks])

    console.log(progression)

    const updateProgressActivity = () => {
        if(activityDocid != ''){
            db.collection('Activities')
            .doc(activityDocid)
            .update({
                Progression: progression
            })
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
            .then(() => {
                setTimeout(() => {
                    updateProgressActivity()
                }, 1000) 
            })
        } else if (completed === 'true'){
            db.collection('Tasks')
            .doc(docid)
            .update({
                Completed: false,
                BackgroundColor: 'white',
                Icon: completeIcon
            })
            .then(() => {
                setTimeout(() => {
                    updateProgressActivity()
                }, 1000) 
            })
        }

        
    }

    const taskLink = (e) => {
        const id = e.target.dataset.id

        history.push(`/${client}/TaskDetail/${id}`)

    }

    const ProgressionBar = () => {
        return(
        <div className='progression-container'>
            <p>Voortgang {Math.trunc(progression)}%</p>
            <div className='progressionbar-outer-bar'>
                <div className='progressionbar-completed' style={{width: `${progression}%`}}></div>
            </div>
        </div>
        )
    }

    return (
        <div className="main">
        <LeftSideBar />
        <LeftSideBarFullScreen/>
        <div className="main-container" style={{display: menuState}}>
            <div className='page-header page-container-activities'>
                <h1>{activity}</h1>
                <div className='activity-detail-effects-container'>
                    <div className='effect-title-container'>
                        <img src={clockIcon} alt=""/>
                        <h3>Kortetermijn effect</h3>
                    </div>
                    <p>{effectShort}</p>
                    <div className='effect-title-container'>
                        <img src={hourglassIcon} alt=""/>
                        <h3>Lange termijn effect</h3>
                    </div>        
                    <p>{effectLong}</p>
                </div>
                
            </div>
            <ProgressionBar/>
            <h2>Taken</h2>
            {tasks && tasks.map(task => (
                <div className='task-outer-container'>
                    <div className='task-container' key={task.ID} style={{backgroundColor: task.BackgroundColor}}>
                        <div className='task-inner-container'>
                            <img src={task.Icon} data-docid={task.docid} data-completed={task.Completed} onClick={taskCompleted} alt=""/>
                            <p>{task.Task}</p>
                            <button className='button-simple button-activity-detail' data-id={task.ID} onClick={taskLink}>Details</button>
                        </div>
                    </div>
                </div>
            ))}
            
        </div>
        <RightSideBar />
        </div>
    )
}

export default ActivityDetail
