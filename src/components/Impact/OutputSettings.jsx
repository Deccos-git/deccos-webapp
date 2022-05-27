import LeftSideBar from "../LeftSideBar";
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import MenuStatus from "../../hooks/MenuStatus";
import { Link } from "react-router-dom";
import { client } from "../../hooks/Client"
import plusIcon from '../../images/icons/plus-icon.png'
import deleteIcon from '../../images/icons/delete-icon.png'
import {useFirestore, useFirestoreMilestones, useFirestoreResults} from "../../firebase/useFirestore"
import settingsIcon from '../../images/icons/settings-icon.png'
import { db } from "../../firebase/config.js"
import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import growIcon from '../../images/icons/grow-icon.png'
import researchIcon from '../../images/icons/research-icon.png'
import resultsIcon from '../../images/icons/results-icon.png'
import activityIcon from '../../images/icons/activity-icon.png'
import penIcon from '../../images/icons/pen-icon.png'
import { NavLink } from "react-router-dom";

const OutputSettings = () => {
    const [outputID, setOutputID] = useState('')
    const menuState = MenuStatus()
    const history = useHistory()

    const outputs = useFirestore('Outputs')
    const milestones = useFirestoreMilestones(outputID) 

    useEffect(() => {
        outputs && outputs.forEach(output => {
            setOutputID(output.ID)
        })
    },[outputs])

    const MilestoneProgess = ({milestone}) => {
        const [succes, setSucces] = useState(false)

        const [goal, setGoal] = useState(0)

        const results = useFirestoreResults(milestone.OutputID)

        console.log(results)

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

    const guideLink = () => {
        history.push(`/${client}/AddOutput`)
    }

  return (
    <div className="main">
        <LeftSideBar />
        <LeftSideBarFullScreen/>
        <div className="main-container" style={{display: menuState}}>
            <div className="page-header">
                <h1>Outputs</h1>
                <div className='edit-icon-header-container'>
                    <NavLink activeClassName='active' to={`/${client}/AddOutput`}>
                        <img src={penIcon} alt="" />
                    </NavLink>
                </div>
            </div>
            <div className='card-container'>
            {outputs && outputs.map(output => (
                    <div className='instrument-card output-card-container'>
                        <h2>{output.Title}</h2>
                        <div className='task-detail-inner-container'>
                        <div className='activity-meta-title-container'>
                                <img src={activityIcon} alt="" />
                                <h3>Activiteit</h3>
                            </div>
                            <p className='questionnaire-results-container'>{output.Activity}</p>
                            <div className='activity-meta-title-container'>
                                <img src={resultsIcon} alt="" />
                                <h3>Effect</h3>
                            </div>
                            <p className='questionnaire-results-container'>{output.Effect}</p>
                            <div>
                                <div className='activity-meta-title-container'>
                                    <img src={growIcon} alt="" />
                                    <h3>Mijlpalen</h3>
                                </div>
                                {milestones && milestones.map(milestone => (
                                    <MilestoneProgess milestone={milestone}/>
                                ))}
                            </div>
                            <div>
                                <div className='activity-meta-title-container'>
                                    <img src={researchIcon} alt="" />
                                    <h3>Onderzoeken</h3>
                                </div>
                               <ul>
                                   
                               </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className='empty-page-container' style={{display: outputs.length > 0 ? 'none' : 'flex'}}>
                <h2>Je hebt nog geen output(s) toegevoegd.</h2>
                <div className='button-container-margin-top'>
                    <button onClick={guideLink}>Toevoegen</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default OutputSettings