import RightSideBar from "../rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "../LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "../LeftSideBarAuthProfileFullScreen";
import MenuStatus from "../../hooks/MenuStatus";
import { db } from "../../firebase/config.js"
import { useState, useEffect } from "react";
import {useFirestore } from "../../firebase/useFirestore"
import { client } from "../../hooks/Client"
import deleteIcon from '../../images/icons/delete-icon.png'
import settingsIcon from '../../images/icons/settings-icon.png'
import { useHistory } from "react-router-dom";
import plusIcon from '../../images/icons/plus-icon.png'
import { Link } from "react-router-dom";

const MilestoneSettings = () => {
    const [color, setColor] = useState('')

    const menuState = MenuStatus()
    const history = useHistory()

    const milestones = useFirestore('Milestones')
   
    const milestoneLink = (e) => {

        const ID = e.target.dataset.id

        history.push(`/${client}/MilstoneDetail/${ID}`)

    }

    const deleteMilestone = (e) => {

        const docid = e.target.dataset.docid

        db.collection('Milestones')
        .doc(docid)
        .delete()
    }

  return (
    <div className="main">
        <LeftSideBarAuthProfile />
        <LeftSideBarAuthProfileFullScreen/>
        <div className="profile profile-auth-profile" style={{display: menuState}}>
            <div className="card-header">
                <h1>Mijlpalen</h1>
                <p>Verander de instellingen van de mijlpalen</p>
            </div>
            <div className='divider'>
                <h2>Mijlpaal toevoegen</h2>
                <Link to={`/${client}/AddMilestone`} ><img id="plus-icon-goal-settings" src={plusIcon} alt="" /></Link>
            </div>
            <div>
                <h2>Mijlpalen</h2>
                {milestones && milestones.map(milestone => (
                    <div id="members-container" key={milestone.ID}>
                    <p>{milestone.Title}</p>
                    <div className='icon-container-activities'>
                        <img src={settingsIcon} alt="" className="userrole-users-delete-button" data-id={milestone.ID} onClick={milestoneLink}/>
                        <img src={deleteIcon} alt="" className="userrole-users-delete-button" data-docid={milestone.docid} onClick={deleteMilestone} />
                    </div>
                </div>
                ))}
            </div>
        </div>
        <RightSideBar />
    </div>
  )
}

export default MilestoneSettings