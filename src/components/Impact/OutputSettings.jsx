import LeftSideBar from "../LeftSideBar";
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import MenuStatus from "../../hooks/MenuStatus";
import { Link } from "react-router-dom";
import { client } from "../../hooks/Client"
import plusIcon from '../../images/icons/plus-icon.png'
import deleteIcon from '../../images/icons/delete-icon.png'
import {useFirestore, useFirestoreMilestones, useFirestoreResults, useFirestoreOutputEffects, useFirestoreResearch} from "../../firebase/useFirestore"
import settingsIcon from '../../images/icons/settings-icon.png'
import { db } from "../../firebase/config.js"
import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import growIcon from '../../images/icons/grow-icon.png'
import researchIcon from '../../images/icons/research-icon.png'
import resultsIcon from '../../images/icons/results-icon.png'
import activityIcon from '../../images/icons/activity-icon.png'
import penIcon from '../../images/icons/pen-icon-white.png'
import { NavLink } from "react-router-dom";
import NoContentNotice from "../../hooks/NoContentNotice";
import ScrollToTop from "../../hooks/ScrollToTop";

const OutputSettings = () => {
    const [outputID, setOutputID] = useState('')
    const menuState = MenuStatus()
    const history = useHistory()
    ScrollToTop()

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

    const Effects = ({output}) => {

        const effects = useFirestoreOutputEffects(output.ID)

        return(
                <ul>
                {effects && effects.map(effect => (
                    <li key={effect.ID}>{effect.Effect}</li>
                ))}
                </ul>
        )
    }

    const Research = ({output}) => {

        const researches = useFirestoreResearch(output.ID) 

        const researchLink = () => {
            history.push(`/${client}/ResearchSettings/`)
        }

        return(
            <ul>
                {researches && researches.map(research => (
                    <li style={{cursor: 'pointer'}} onClick={researchLink}>{research.Title}</li>
                ))}
            </ul>
        )
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
                            <Effects output={output}/>
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
                               <Research output={output}/>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {NoContentNotice(outputs, 'AddOutput')}
        </div>
    </div>
  )
}

export default OutputSettings