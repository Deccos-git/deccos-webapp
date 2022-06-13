import LeftSideBar from "./LeftSideBar";
import LeftSideBarFullScreen from "./LeftSideBarFullScreen"
import RightSideBar from "./rightSideBar/RightSideBar"
import MenuStatus from "../hooks/MenuStatus";
import { useFirestoreActivities, useFirestoreID } from "../firebase/useFirestore"
import { client } from "../hooks/Client"
import { useHistory } from "react-router-dom";
import { useState, useEffect } from 'react'
import Location from "../hooks/Location"
import ArrowLeftIcon from '../images/icons/arrow-left-icon.png'
import ScrollToTop from "../hooks/ScrollToTop";

const ActivitieGoal = () => {
    const [progression, setProgression] = useState(0)
    const [goal, setGoal] = useState('')

    const menuState = MenuStatus()
    const history = useHistory();
    const route = Location()[3]
    ScrollToTop()

    const activities = useFirestoreActivities(route)  
    const goals = useFirestoreID('Goals', route) 
    
    useEffect(() => {
        goals && goals.forEach(goal => {
            const goalTitle = goal.Title
            setGoal(goalTitle)
        })
    }, [goals])

    const activityLink = (e) => {

        const id = e.target.dataset.id

        history.push(`/${client}/ActivityDetail/${id}`)

    }

    const backToGoal = (e) => {
        history.push(`/${client}/GoalDetail/${route}`)
    }


    return (
        <div className="main">
        <LeftSideBar />
        <LeftSideBarFullScreen/>
        <div className="main-container" style={{display: menuState}}>
            <div className="previous-message-container" onClick={backToGoal}>
                <img src={ArrowLeftIcon} alt="" />
                <p>Doel</p>
            </div>
            <div className='page-header goal-activity-header'>
                <h1>Activiteiten</h1>
                <p>{goal}</p>
            </div>
            {activities && activities.map(activity => (
                <div className='activity-container' key={activity.ID}>
                    <div className='activity-inner-container'>
                        <h3>{activity.Activity}</h3>
                        <div className='progression-container-activity-detail'>
                            <p>Voortgang {Math.trunc(activity.Progression)}%</p>
                            <div className='progressionbar-outer-bar'>
                                <div className='progressionbar-completed' style={{width: `${activity.Progression}%`}}></div>
                            </div>
                        </div>
                        <button className='button-simple' data-id={activity.ID} onClick={activityLink}>Details</button>
                    </div>
                </div>
            ))}

        </div>
        <RightSideBar />
        </div>
    )
}

export default ActivitieGoal
