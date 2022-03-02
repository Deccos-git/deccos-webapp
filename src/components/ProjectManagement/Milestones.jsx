import LeftSideBar from "../LeftSideBar";
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import RightSideBar from "../rightSideBar/RightSideBar"
import MenuStatus from "../../hooks/MenuStatus";
import {useFirestore} from "../../firebase/useFirestore"
import { client } from "../../hooks/Client"
import { useHistory } from "react-router-dom";
import { useState, useEffect } from 'react'
import settingsIcon from '../../images/icons/settings-icon.png'

const Milestones = () => {

    const menuState = MenuStatus()
    const history = useHistory();

    const milestones = useFirestore("Milestones")    

    const milestoneLink = (e) => {

        const id = e.target.dataset.id

        history.push(`/${client}/MilestoneDetail/${id}`)

    }

  return (
     <div className="main">
        <LeftSideBar />
        <LeftSideBarFullScreen/>
        <div className="main-container" style={{display: menuState}}>
            <div className='page-header'>
                <h1>Mijlpalen</h1>
            </div>
            {milestones && milestones.map(milestone => (
                <div className="task-overview-container" key={milestone.ID}>
                    <div className='task-container'>
                        <h2>{milestone.Title}</h2>
                        <p>Beoogd aantal: {milestone.TargetAmount}</p>
                        <p>Huidig aantal: {milestone.CurrentAmount}</p>
                        <p>Deadline: {milestone.Deadline}</p>
                        <img src={settingsIcon} alt="" data-id={milestone.ID} onClick={milestoneLink}/>
                    </div>
                </div>
            ))}

        </div>
        <RightSideBar />
    </div>
  )
}

export default Milestones