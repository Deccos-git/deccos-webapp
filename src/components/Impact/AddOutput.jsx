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
    const [outputArray, setOutputArray] = useState([])
    const [output, setOutput] = useState('')
    const [matchesSwitch, setMatchesSwitch] = useState(false)
    const [membersSwitch, setMembersSwitch] = useState(false)

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

    // Switches

      const ToggleSwitchMatches = () => {
        return (
          <div className="container">
            <div className="toggle-switch">
              <input type="checkbox" className="checkbox" 
                     name={'matches'} id={'matches'} onChange={() => { setMatchesSwitch(true)}} />
              <label className="label" htmlFor={'matches'}>
                <span className="inner"/>
                <span className="switch"/>
              </label>
            </div>
          </div>
        );
      };

      const ToggleSwitchMembers = () => {
        return (
          <div className="container">
            <div className="toggle-switch">
              <input type="checkbox" className="checkbox"
                     name={'members'} id={'members'} onChange={() => { setMembersSwitch(true)}} />
              <label className="label" htmlFor={'members'}>
                <span className="inner"/>
                <span className="switch"/>
              </label>
            </div>
          </div>
        );
      };

      const ToggleSwitchCustom= ({output}) => {
        return (
          <div className="container">
            <div className="toggle-switch">
              <input type="checkbox" className="checkbox" defaultChecked={true}
                     name={output} id={output} data-output={output} onChange={customSwitchHandler} />
              <label className="label" htmlFor={output}>
                <span className="inner"/>
                <span className="switch"/>
              </label>
            </div>
          </div>
        );
      };

      const customSwitchHandler = (e) => {
        const output = e.target.dataset.output 

        if(outputArray.includes(output)){
          const index = outputArray.indexOf(output)
          outputArray.splice(index, 1)
        }
      }

      const customIndicatorHandler = (e) => {
          const input = e.target.value 

          setOutput(input)
      }

       // Save ouput to database

       const saveOutput = (e) => {

        ButtonClicked(e, 'Opgeslagen')

        const totalArray = []

        if(matchesSwitch === true){
          totalArray.push('matches')
        }

        if(membersSwitch === true){
          totalArray.push('members')
        }

        outputArray && outputArray.forEach(output => {
          totalArray.push(output)
        })

        totalArray && totalArray.forEach(output => {

          db.collection('Outputs')
          .doc()
          .set({
              ActivityTitle: activityTitle,
              ActivityID: activityID,
              ID: uuid(),
              Compagny: client,
              Timestamp: timestamp,
              User: authO.UserName,
              UserPhoto: authO.Photo,
              UserID: authO.ID,
              Output: output,
          })
        })
    }

    const nextStep = () => {

        history.push(`/${client}/QuestionnaireSettings`)

    }

    const addIndicator = (e) => {

      setOutputArray([...outputArray, output])

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
                    <h4>Selecteer een doel</h4>
                    <select name="" id="" onChange={goalHandler}>
                        <option value="">-- Selecteer een doel --</option>
                        {goals && goals.map(goal => (
                            <option value="" key={goal.ID} data-id={goal.ID} data-title={goal.Title}>{goal.Title}</option>
                        ))}
                    </select>
                    <div style={{display: goalID ? 'block' : 'none'}}>
                        <h4>Selecteer een activiteit</h4>
                        <select name="" id="" onChange={activityHandler}>
                            <option value="">-- Selecteer een activiteit --</option>
                            {activities && activities.map(activity => (
                                <option value="" key={activity.ID} data-id={activity.ID} data-title={activity.Activity}>{activity.Activity}</option>
                            ))}
                    </select>
                    </div>
                    <div style={{display: activityID ? 'block' : 'none'}}>
                        <h4>Selecteer een indicator</h4>
                        <div className='functionality-container'>
                            <p>Aantal matches</p>
                            <ToggleSwitchMatches/>
                        </div>
                        <div className='functionality-container'>
                            <p>Aantal communityleden</p>
                            <ToggleSwitchMembers/>
                        </div>
                        {outputArray && outputArray.map(output => (
                          <div className='functionality-container'>
                            <p>{output}</p>
                            <ToggleSwitchCustom output={output}/>
                          </div>
                        ))}
                        <div>
                            <h4>Voeg een eigen indicator toe</h4>
                            <input type="text" placeholder='Wat wil je meten?' onChange={customIndicatorHandler} />
                            <button className='button-simple' onClick={addIndicator}>Toevoegen</button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="button-add-goal" style={{display: activityID ? 'block' : 'none'}}>
                    <Link to={`/${client}/Output`}><button onClick={saveOutput}>Opslaan</button></Link>
                </div>
            <div className='next-step-impact'>
                <img src={ArrowRightIcon} alt="" onClick={nextStep}/>
                <h3 onClick={nextStep}>Volgende stap: vragenlijst toevoegen</h3>
            </div>
        </div>
        <RightSideBar />
        </div>
  )
}

export default AddOutput