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
import deleteIcon from '../../images/icons/delete-icon.png'
import { useHistory } from "react-router-dom";
import ArrowRightIcon from '../../images/icons/arrow-right-icon.png'
import spinnerRipple from '../../images/spinner-ripple.svg'
import firebase from 'firebase'
import { bucket } from '../../firebase/config';
import ButtonClicked from "../../hooks/ButtonClicked";

const AddMilestone = () => {
  const [activityID, setActivityID] = useState(null)
  const [activityTitle, setActivityTitle] = useState(null)
  const [goalID, setGoalID] = useState(null)
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState(0)
  const [deadline, setDeadline] = useState('')

  const menuState = MenuStatus()
  const history = useHistory()

  const goals = useFirestore('Goals')
  const activities = useFirestoreActivities(goalID && goalID)

  const goalHandler = (e) => {
    const goalID = e.target.options[e.target.selectedIndex].value 

    setGoalID(goalID)
  }

  const activityHandler = (e) => {
    const activityID = e.target.options[e.target.selectedIndex].dataset.id 
    const activityTitle = e.target.options[e.target.selectedIndex].dataset.title

    setActivityID(activityID)
    setActivityTitle(activityTitle)
  }

  const titleHandler = (e) => {
    const title = e.target.value 

    setTitle(title)
  }

  const amountHandler = (e) => {
    const amount = e.target.value 

    setAmount(amount)
  }

  const deadlineHandler = (e) => {
    const deadline = e.target.value 

    setDeadline(deadline)
  }

  const saveMilestone = (e) => {

    ButtonClicked(e, 'Opgeslagen')

    db.collection('Milestones')
    .doc()
    .set({
      ID: uuid(),
      Compagny: client,
      Timestamp: timestamp,
      Activity: activityTitle,
      ActivityID: activityID,
      Title: title,
      TargetAmount: amount,
      Deadline: deadline,
      CurrentAmount: 0
    })

  }

  const nextStep = () => {

    history.push(`/${client}/TaskSettings`)

}


  return (
    <div className="main">
    <LeftSideBarAuthProfile />
    <LeftSideBarAuthProfileFullScreen/>
    <div className="profile profile-auth-profile" style={{display: menuState}}>
        <div className="settings-inner-container">
            <div className="divider card-header">
                <h1>Mijlpaal toevoegen</h1>
            </div>
            <div className='divider'>
              <div>
                <h2>Selecteer een doel <sup>*</sup></h2>
                <select name="" id="" onChange={goalHandler}>
                  <option value="">-- Selecteer een doel --</option>
                  {goals && goals.map(goal => (
                    <option value={goal.ID} key={goal.ID}>{goal.Title}</option>
                  ))}
                </select>
              </div>
              <div>
                <h2>Selecteer een activiteit<sup>*</sup></h2>
                <select name="" id="" onChange={activityHandler}>
                  <option value="">-- Selecteer een activiteit --</option>
                  {activities && activities.map(activity => (
                    <option data-id={activity.ID} data-title={activity.Activity} key={activity.ID}>{activity.Activity}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className='divider'>
              <h2>Geef de mijlpaal een titel</h2>
              <input type="text" onChange={titleHandler} />
            </div>
            <div className='divider'>
              <h2>Quantificeer je mijlpaal</h2>
              <input type="number" onChange={amountHandler} />
            </div>
            <div className='divider'>
              <h2>Selecteer een deadline</h2>
              <input type="date" onChange={deadlineHandler} />
            </div>
            <button onClick={saveMilestone}>Opslaan</button>
        </div>
        <div className='next-step-impact'>
            <img src={ArrowRightIcon} alt="" onClick={nextStep}/>
            <h3 onClick={nextStep}>Volgende stap: taken toevoegen</h3>
        </div>
    </div>
    <RightSideBar />
    </div>
  )
}

export default AddMilestone