import RightSideBar from "../rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "../LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "../LeftSideBarAuthProfileFullScreen";
import MenuStatus from "../../hooks/MenuStatus";
import {useFirestore, useFirestoreActivities} from "../../firebase/useFirestore"
import { useState, useEffect, useContext } from 'react'
import { Auth } from '../../StateManagment/Auth';
import uuid from 'react-uuid';
import { db, timestamp } from "../../firebase/config.js"
import { client } from "../../hooks/Client"
import { useHistory } from "react-router-dom";
import ArrowRightIcon from '../../images/icons/arrow-right-icon.png'
import ButtonClicked from "../../hooks/ButtonClicked";
import { Link } from "react-router-dom";

const AddOutput = () => {
    const [authO] = useContext(Auth)

    const [goalID, setGoalID] = useState(null)
    const [activityTitle, setActivityTitle] = useState('')
    const [activityID, setActivityID] = useState(null)
    const [title, setTitle] = useState('')

    const menuState = MenuStatus()
    const history = useHistory()

    const goals = useFirestore("Goals")

    const goalHandler = (e) => {
        const goalID = e.target.options[e.target.selectedIndex].dataset.id

        setGoalID(goalID)
    }

    if(goalID === undefined){
        setGoalID('')
    }

    const activities = useFirestoreActivities(goalID)

    const activityHandler = (e) => {

        const activityTitle = e.target.options[e.target.selectedIndex].dataset.title
        const activityID = e.target.options[e.target.selectedIndex].dataset.id

        setActivityTitle(activityTitle)
        setActivityID(activityID)

    }

    const titleHandler = (e) => {
      const title = e.target.value 

      setTitle(title)
    }

    

    const saveOutput = (e) => {

      ButtonClicked(e, 'Opgeslagen')

      db.collection('Outputs')
      .doc()
      .set({
          ActivityTitle: activityTitle,
          ActivityID: activityID,
          Title: title,
          ID: uuid(),
          Compagny: client,
          Timestamp: timestamp,
          User: authO.UserName,
          UserPhoto: authO.Photo,
          UserID: authO.ID,
          Type: `Activiteit "${activityTitle}"`
      })
    }

    const nextStep = () => {

        history.push(`/${client}/Output`)

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
                    <h2>Selecteer een doel</h2>
                    <select name="" id="" onChange={goalHandler}>
                        <option value="">-- Selecteer een doel --</option>
                        {goals && goals.map(goal => (
                            <option value="" key={goal.ID} data-id={goal.ID} data-title={goal.Title}>{goal.Title}</option>
                        ))}
                    </select>
                    <div style={{display: goalID ? 'block' : 'none'}}>
                        <h2>Selecteer een activiteit</h2>
                        <select name="" id="" onChange={activityHandler}>
                            <option value="">-- Selecteer een activiteit --</option>
                            {activities && activities.map(activity => (
                                <option value="" key={activity.ID} data-id={activity.ID} data-title={activity.Activity}>{activity.Activity}</option>
                            ))}
                    </select>
                    </div>
                </div>
                <div className='divider'>
                    <div>
                      <h2>Geef de output een titel</h2>
                      <input type="text" placeholder='Schrijf hier de titel van het resultaat' onChange={titleHandler} />
                    </div>
                </div>
            </div>
            <div id="button-add-goal" style={{display: activityID ? 'block' : 'none'}}>
                <Link to={`/${client}/Output`}><button onClick={saveOutput}>Opslaan</button></Link>
            </div>
            <div className='next-step-impact'>
                <img src={ArrowRightIcon} alt="" onClick={nextStep}/>
                <h3 onClick={nextStep}>Volgende stap: meetinstrumenten toevoegen</h3>
            </div>
        </div>
        <RightSideBar />
        </div>
  )
}

export default AddOutput