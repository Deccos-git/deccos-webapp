import LeftSideBar from "../LeftSideBar";
import LeftSideBarFullScreen from "../LeftSideBarFullScreen";
import MenuStatus from "../../hooks/MenuStatus";
import { useState, useEffect } from "react";
import {useFirestore, useFirestoreResults } from "../../firebase/useFirestore"
import { client } from "../../hooks/Client"
import progressIcon from '../../images/icons/progress-icon.png'
import resultsIcon from '../../images/icons/results-icon.png'
import { useHistory } from "react-router-dom";
import activityIcon from '../../images/icons/activity-icon.png'
import penIcon from '../../images/icons/pen-icon-white.png'
import { NavLink } from "react-router-dom";
import Premium from "../../hooks/Premium";
import PremiumNotice from "../PremiumNotice";
import NoContentNotice from "../../hooks/NoContentNotice";
import ScrollToTop from "../../hooks/ScrollToTop";

const MilestoneSettings = () => {

    const menuState = MenuStatus()
    const premium = Premium() 
    ScrollToTop()

    const milestones = useFirestore('Milestones')
   

    const MilestoneProgress = ({milestone}) => {
        const [progress, setProgress] = useState([])

        const results = useFirestoreResults(milestone.OutputID)

        const progressArray = []

        useEffect(() => {
            results && results.forEach(result => {

                progressArray.push(result.Result)

                setProgress(progressArray)

            })

        },[results])

        const sum = progress.reduce((partialSum, a) => partialSum + a, 0);
        
        const width = sum*100/milestone.Number

         const succesColor = () => {
            if(milestone.Succes === true){
                return '#00cd00'
            } else {
                return '#63cadc'
            }
         }

         const total = () => {

            if(sum > milestone.Number){
                return `${milestone.Number} of meer`
            } else {
                return sum
            }
         }

         const percentage = () => {
             if(width > 100){
                 return `(100%)`
             } else {
                return `(${(Math.round(width * 100) / 100).toFixed(2)}%)`
             }
         }

        return(
            <div className='milestone-progress-container'>
                <div className='percentage-container'>
                    <p>Huidig: {total()} {percentage()}</p>
                    <p>Doel: {milestone.Number}</p>
                </div>
                
                <div className='progressbar-outer-bar'>
                    <div className='progressbar-progress' style={{width: `${width}%`, backgroundColor: succesColor()}}></div>
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
                <p>Creëer stippen aan de horinzon om naar toe te werken</p>
                <div className='edit-icon-header-container'>
                    <NavLink activeClassName='active' to={`/${client}/MeasureOutput`}>
                        <img src={penIcon} alt="" />
                    </NavLink>
                </div>
            </div>
            <div className='card-container milestone-card-container' style={{display: premium ? 'flex' : 'none'}}>
            {milestones && milestones.map(milestone => (
                    <div className='instrument-card'>
                        <h2>{milestone.Number} {milestone.Title.toLowerCase()}</h2>
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
                                <MilestoneProgress milestone={milestone}/>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div style={{display: premium ? 'none' : 'flex'}}>
                <PremiumNotice/>
            </div>
            {NoContentNotice(milestones, 'MeasureOutput')}
        </div>
    </div>
  )
}

export default MilestoneSettings