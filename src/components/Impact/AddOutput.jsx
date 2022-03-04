import RightSideBar from "../rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "../LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "../LeftSideBarAuthProfileFullScreen";
import MenuStatus from "../../hooks/MenuStatus";
import { Link } from "react-router-dom";
import { client } from "../../hooks/Client"
import { useState, useEffect, useContext } from 'react'
import ButtonClicked from "../../hooks/ButtonClicked";
import { db, timestamp } from "../../firebase/config.js"
import uuid from 'react-uuid';
import { Auth } from '../../StateManagment/Auth';
import Location from "../../hooks/Location"
import { useFirestore } from "../../firebase/useFirestore";
import AddQuestionnaire from "./AddQuestionnaire";
import { useHistory } from "react-router-dom";
import ArrowRightIcon from '../../images/icons/arrow-right-icon.png'

const AddOutput = () => {
    const [activityID, setActivityID] = useState('')
    const [activityTitle, setActivityTitle] = useState('')
    const [title, setTitle] = useState('')

    const menuState = MenuStatus()
    const history = useHistory()

    const activities = useFirestore('Activities')

    const activityHandler = (e) => {
        const activityID = e.target.options[e.target.selectedIndex].value
        const activityTitle = e.target.options[e.target.selectedIndex].dataset.title

        setActivityID(activityID)
        setActivityTitle(activityTitle)
    }

    const titleHandler = (e) => {
        const title = e.target.value 

        setTitle(title)
    }

    const saveOutput = (e) => {

        ButtonClicked(e, 'Opgeslagen')

        const id = uuid()

        db.collection('Outputs')
        .doc()
        .set({
            ID: id,
            Compagny: client,
            Timestamp: timestamp,
            Activity: activityTitle,
            ActivityID: activityID,
            Title: title,
        })
    }

    const nextStep = () => {

        history.push(`/${client}/MilestoneSettings`)
    
    }

  return (
     <div className="main">
    <LeftSideBarAuthProfile />
    <LeftSideBarAuthProfileFullScreen/>
    <div className="profile profile-auth-profile" style={{display: menuState}}>
        <div className="settings-inner-container">
            <div className="divider card-header">
                <h1>Output toevoegen</h1>
            </div>
            <div className='divider'>
                <h2>Selecteer een activiteit</h2>
                <select name="" id="" onChange={activityHandler}>
                    <option value="">-- Selecteer een activiteit --</option>
                    {activities && activities.map(activity => (
                        <option value={activity.ID} data-title={activity.Activity}>{activity.Activity}</option>
                    ))}
                </select>
            </div>
            <div className='divider'>
                <h2>Geef de output een titel</h2>
                <input type="text" onChange={titleHandler} />
            </div>
            <div>
                <button onClick={saveOutput}>Opslaan</button>
            </div>
        </div>
        <div className='next-step-impact'>
                <img src={ArrowRightIcon} alt="" onClick={nextStep}/>
                <h3 onClick={nextStep}>Volgende stap: mijlpalen toevoegen</h3>
        </div>
    </div>
    <RightSideBar />
    </div>
  )
}

export default AddOutput