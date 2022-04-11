import LeftSideBar from "../LeftSideBar";
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import RightSideBar from "../rightSideBar/RightSideBar"
import MenuStatus from "../../hooks/MenuStatus";
import {useFirestore, useFirestoreTasks, useFirestoreTasksComplete} from "../../firebase/useFirestore"
import { client } from "../../hooks/Client"
import { useHistory } from "react-router-dom";
import { useState, useEffect, useContext  } from 'react'
import settingsIcon from '../../images/icons/settings-icon.png'
import goalIcon from '../../images/icons/goal-icon.png'
import completeIcon from '../../images/icons/complete-icon.png'
import eventIcon from '../../images/icons/event-icon.png'
import tasklistIcon from '../../images/icons/task-list-icon.png'
import festiveIcon from '../../images/icons/festive-icon.png'

const Milestones = () => {
    const menuState = MenuStatus()
    const history = useHistory();

    const milestones = useFirestore("Milestones")  
    
    const milestoneLink = (e) => {

        const id = e.target.dataset.id

        history.push(`/${client}/MilestoneDetail/${id}`)

    }

    const Progression = ({milestone}) => {
        const tasks = useFirestoreTasks(milestone.ID)
        const tasksCompleted = useFirestoreTasksComplete(milestone.ID)

        return(
            <div>
                <p>Totaal: {tasks.length}</p>
            </div>
        )
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
                    <div className='milestone-container'>
                        <h3>{milestone.Title}</h3>
                        <div>
                            <div className='activity-meta-title-container amount-container'>
                                <img src={tasklistIcon} alt="" />
                                <p>Taken</p>
                            </div>
                            <p className='activity-meta-title-description'><Progression milestone={milestone}/></p>
                        </div>
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