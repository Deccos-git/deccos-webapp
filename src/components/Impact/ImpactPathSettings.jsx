import RightSideBar from "./rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "./LeftSideBarAuthProfileFullScreen";
import MenuStatus from "../hooks/MenuStatus";
import { Editor } from '@tinymce/tinymce-react';
import { useRef, useState, useContext, useEffect } from 'react';
import {useFirestore, useFirestoreActivities} from "../firebase/useFirestore"
import { useHistory } from "react-router-dom"
import { client } from "../hooks/Client"
import { Auth } from '../StateManagment/Auth';
import uuid from 'react-uuid';
import { db, timestamp } from "../firebase/config.js"
import settingsIcon from '../images/icons/settings-icon.png'

const ImpactPathSettings = () => {
    const [authO] = useContext(Auth)

    const [goalTitle, setGoalTitle] = useState('')
    const [goalID, setGoalID] = useState('')

    const impactPaths = useFirestore("ImpactPaths")
    const goals = useFirestore("Goals")
    
    const menuState = MenuStatus()
    const history = useHistory()

    const impactpathSettings = (e) => {
        const id = e.target.dataset.id

        history.push(`/${client}/ImpactPathSettingsDetail/${id}`)
    }

    const goalHandler = (e) => {
        const goalTitle = e.target.options[e.target.selectedIndex].dataset.title
        const goalID = e.target.options[e.target.selectedIndex].dataset.id

        setGoalTitle(goalTitle)
        setGoalID(goalID)
    }

    const saveImpactPath = () => {
        db.collection('ImpactPaths')
        .doc()
        .set({
            ID: uuid(),
            Compagny: client,
            Timestamp: timestamp,
            User: authO.UserName,
            UserPhoto: authO.Photo,
            UserID: authO.ID,
            Goal: goalTitle,
            GoalID: goalID,
        })
    }




    return (
        <div className="main">
            <LeftSideBarAuthProfile />
            <LeftSideBarAuthProfileFullScreen/>
            <div className='profile profile-auth-profile' style={{display: menuState}}>
                <div className="settings-inner-container">
                    <div className="divider card-header">
                        <h1>Impactpaden</h1>
                        <p>Pas de instellingen aan de impactpaden aan</p>
                    </div>
                    <div className="divider">
                        <h2>Impactpaden</h2>
                        {impactPaths && impactPaths.map(impactPath => (
                            <div className="channel-container">
                            <p>{impactPath.Goal}</p>
                            <div className="icon-container">
                                <img src={settingsIcon} data-id={impactPath.ID} onClick={impactpathSettings} />
                            </div>
                        </div>
                        ))}
                    </div>
                    <div className='divider'>
                        <h2>Creeer een nieuw impactpad</h2>
                        <h3>Selecteerd een doel</h3>
                        <select name="" id="" onChange={goalHandler}>
                            <option value="">-- Selecteer een doel --</option>
                            {goals && goals.map(goal => (
                                <option value="" key={goal.ID} data-id={goal.ID} data-title={goal.Title}>{goal.Title}</option>
                            ))}
                        </select>
                        <button className='button-simple' onClick={saveImpactPath}>Opslaan</button>
                    </div>
                </div>
            </div>
            <RightSideBar/>
        </div>
    )
}

export default ImpactPathSettings
