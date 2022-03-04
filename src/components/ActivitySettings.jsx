import RightSideBar from "./rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "./LeftSideBarAuthProfileFullScreen";
import MenuStatus from "../hooks/MenuStatus";
import {useFirestore} from "../firebase/useFirestore"
import { useState, useEffect, useContext } from 'react'
import { Auth } from '../StateManagment/Auth';
import uuid from 'react-uuid';
import { db, timestamp } from "../firebase/config.js"
import { client } from "../hooks/Client"
import deleteIcon from '../images/icons/delete-icon.png'
import settingsIcon from '../images/icons/settings-icon.png'
import { useHistory } from "react-router-dom";
import plusIcon from '../images/icons/plus-icon.png'
import { Link } from "react-router-dom";

const ActivitySettings = () => {

    const menuState = MenuStatus()
    const history = useHistory()

    const activities = useFirestore('Activities')

    const activityLink = (e) => {

        const ID = e.target.dataset.id

        history.push(`/${client}/ActivitySettingsDetail/${ID}`)

    }

    const deleteActivity = (e) => {

        const docid = e.target.dataset.docid

        db.collection('Activities')
        .doc(docid)
        .delete()

    }

  return (
    <div className="main">
        <LeftSideBarAuthProfile />
        <LeftSideBarAuthProfileFullScreen/>
        <div className="profile profile-auth-profile" style={{display: menuState}}>
            <div className="settings-inner-container">
                <div className="divider card-header">
                    <h1>Activiteiten</h1>
                    <p>Pas de instellingen aan de activiteiten aan</p>
                </div>
                <div className='divider'>
                    <h3>Activiteit toevoegen</h3>
                    <Link to={`/${client}/AddActivity`} ><img id="plus-icon-goal-settings" src={plusIcon} alt="" /></Link>
                </div>
                <div className='divider'>
                    <h2>Activiteiten</h2>
                    {activities && activities.map(activity => (
                        <div id="members-container" key={activity.ID}>
                            <p id={activity.ID} >{activity.Activity}</p>
                            <div className='icon-container-activities'>
                                <img src={settingsIcon} alt="" className="userrole-users-delete-button" data-id={activity.ID} onClick={activityLink}/>
                                <img src={deleteIcon} alt="" className="userrole-users-delete-button" data-docid={activity.docid} onClick={deleteActivity} />
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </div>
        <RightSideBar />
    </div>
  )
}

export default ActivitySettings
