import LeftSideBar from "./LeftSideBar";
import LeftSideBarFullScreen from "./LeftSideBarFullScreen"
import RightSideBar from "./rightSideBar/RightSideBar"
import MenuStatus from "../hooks/MenuStatus";
import {useFirestore} from "../firebase/useFirestore"
import { client } from "../hooks/Client"
import { useHistory } from "react-router-dom";
import { useState, useEffect } from 'react'

const Activities = () => {
    const [progression, setProgression] = useState(0)

    const menuState = MenuStatus()
    const history = useHistory();

    const activities = useFirestore("Activities")    

    const activityLink = (e) => {

        const id = e.target.dataset.id

        history.push(`/${client}/ActivityDetail/${id}`)

    }

    return (
        <div className="main">
        <LeftSideBar />
        <LeftSideBarFullScreen/>
        <div className="main-container" style={{display: menuState}}>
            <div className='page-header'>
                <h1>Activiteiten</h1>
            </div>
            {activities && activities.map(activity => (
                <div className='activity-container' key={activity.ID}>
                    <div className='activity-inner-container'>
                        <h3>{activity.Activity}</h3>
                        <p>Voortgang {Math.trunc(activity.Progression)}%</p>
                        <button className='button-simple' data-id={activity.ID} onClick={activityLink}>Details</button>
                    </div>
                </div>
            ))}

        </div>
        <RightSideBar />
        </div>
    )
}

export default Activities
