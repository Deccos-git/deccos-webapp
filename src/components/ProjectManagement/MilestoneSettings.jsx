import LeftSideBar from "../LeftSideBar";
import LeftSideBarFullScreen from "../LeftSideBarFullScreen";
import MenuStatus from "../../hooks/MenuStatus";
import { db } from "../../firebase/config.js"
import { useState, useEffect } from "react";
import {useFirestore, useFirestoreResults } from "../../firebase/useFirestore"
import { client } from "../../hooks/Client"
import progressIcon from '../../images/icons/progress-icon.png'
import resultsIcon from '../../images/icons/results-icon.png'
import { useHistory } from "react-router-dom";
import plusIcon from '../../images/icons/plus-icon.png'
import { Link } from "react-router-dom";
import activityIcon from '../../images/icons/activity-icon.png'

const MilestoneSettings = () => {
    const [color, setColor] = useState('')
    const [succes, setSucces] = useState(false)

    const menuState = MenuStatus()
    const history = useHistory()

    const milestones = useFirestore('Milestones')
   
    const milestoneLink = (e) => {

        const ID = e.target.dataset.id

        history.push(`/${client}/MilstoneDetail/${ID}`)

    }

    const MilestoneProgress = ({output}) => {
        const [goal, setGoal] = useState(0)

        const results = useFirestoreResults(output)

        useEffect(() => {
            milestones && milestones.forEach(milestone => {

                setGoal(milestone.Number)
                setSucces(milestone.Succes)

            })
         },[milestones])

        const width = results.length*100/goal

        const percentage = `${width}%`

         const succesColor = () => {
            if(succes === true){
                return '#00cd00'
            } else {
                return '#63cadc'
            }
         }

        return(
            <div className='milestone-progress-container'>
                <div className='percentage-container'>
                    <p>Huidig: {results.length} ({width}%)</p>
                    <p>Doel: {goal}</p>
                </div>
                
                <div className='progressbar-outer-bar'>
                    <div className='progressbar-progress' style={{width: percentage, backgroundColor: succesColor()}}></div>
                </div>
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
            <div className='card-container milestone-card-container'>
            {milestones && milestones.map(milestone => (
                    <div className='instrument-card'>
                        <h2>{milestone.Title}</h2>
                        <div className='task-detail-inner-container'>
                        <div className='activity-meta-title-container'>
                                <img src={activityIcon} alt="" />
                                <h3>Activiteit</h3>
                            </div>
                            <p className='questionnaire-results-container'>{milestone.Activity}</p>
                            <div className='activity-meta-title-container'>
                                <img src={resultsIcon} alt="" />
                                <h3>Output</h3>
                            </div>
                            <p className='questionnaire-results-container'>{milestone.OutputTitle}</p>
                            <div>
                                <div className='activity-meta-title-container'>
                                    <img src={progressIcon} alt="" />
                                    <h3>Voortgang</h3>
                                </div>
                                <MilestoneProgress output={milestone.OutputID}/>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default MilestoneSettings