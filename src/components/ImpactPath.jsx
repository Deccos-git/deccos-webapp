import LeftSideBar from "./LeftSideBar"
import LeftSideBarFullScreen from "./LeftSideBarFullScreen"
import RightSideBar from "./rightSideBar/RightSideBar"
import MenuStatus from "../hooks/MenuStatus";
import { useFirestore, useFirestoreActivities } from "../firebase/useFirestore";
import { useHistory } from "react-router-dom"
import { client } from "../hooks/Client"
import { useState, useEffect } from 'react';
import arrowDownIcon from '../images/icons/arrow-down-icon.png'

const ImpactPath = () => {
    const [goal, setGoal] = useState('')

    const menuState = MenuStatus()

    const history = useHistory()

    const impactPaths = useFirestore("ImpactPaths")
    const activities = useFirestoreActivities(goal)

    useEffect(() => {
        impactPaths && impactPaths.forEach(impactPath => {
            const goal = impactPath.Goal

            setGoal(goal)

        })
    }, [impactPaths])

    const linkGoal = (e) => {

        const goalid = e.target.dataset.goalid 

        history.push(`/${client}/GoalDetail/${goalid}`)

    }

    return (
        <div className="main">
            <LeftSideBar />
            <LeftSideBarFullScreen/>
            <div className="main-container" style={{display: menuState}}>
                <div className="page-header">
                    <h1>Impactpad</h1>
                </div>
                {impactPaths && impactPaths.map(impactPath => (
                <div className='impactpath-container' key={impactPath.ID}>
                    <div className='impact-path-section-container'>
                        <h2>Maatschappelijk probleem</h2>
                        <div>
                            <p data-goalid={impactPath.GoalID} onClick={linkGoal}>{impactPath.Goal}</p>
                        </div>
                    </div>
                    <div className='impact-path-section-container'>
                        <h2>Doelgroep</h2>
                        <div>
                            <p>{impactPath.TargetGroup}</p>
                        </div>
                    </div>
                    <div className='arrow-down-container'>
                        <img src={arrowDownIcon} alt=""/>
                    </div>
                    <div className='impact-path-section-container'>
                        <h2>Activiteiten</h2>
                        {activities && activities.map(activity => (
                        <div key={activity.ID}>
                            <h3>{activity.Activity}</h3>
                            <div className='activity-details-container'>
                                <h4>Resultaten</h4>
                                <div className='activity-details-inner-container'>
                                    <p><b>Korte termijn:</b> {activity.EffectShort}</p>
                                    <p><b>Middellange termijn:</b> {activity.EffectMiddle}</p>
                                    <p><b>Lange termijn:</b> {activity.EffectLong}</p>
                                </div>
                                
                            </div>
                            <div className='activity-details-container'>
                                <h4>Randvoorwaarden</h4>
                                <div className='activity-details-inner-container'>
                                    <p>{activity.Ingredients}</p>
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                    <div className='arrow-down-container'>
                        <img src={arrowDownIcon} alt=""/>
                    </div>
                    <div className='impact-path-section-container'>
                        <h2>Impact doelgroep</h2>
                        <div>
                            <p>{impactPath.ImpactTargetGroup}</p>
                        </div>
                    </div>
                    <div className='impact-path-section-container'>
                        <h2>Impact maatschappij</h2>
                        <div>
                            <p>{impactPath.ImpactSociety}</p>
                        </div>
                    </div>
                </div>
                 ))}
            </div>
            <RightSideBar />
        </div>
    )
}

export default ImpactPath
