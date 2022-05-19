import LeftSideBar from "../LeftSideBar";
import LeftSideBarFullScreen from "../LeftSideBarFullScreen";
import MenuStatus from "../../hooks/MenuStatus";
import { client } from "../../hooks/Client"
import { useState, useEffect, useContext } from 'react'
import ButtonClicked from "../../hooks/ButtonClicked";
import { db, timestamp } from "../../firebase/config.js"
import uuid from 'react-uuid';
import { Auth } from '../../StateManagment/Auth';
import Location from "../../hooks/Location"
import { useFirestore, useFirestoreOutputs } from "../../firebase/useFirestore";
import AddQuestionnaire from "./AddQuestionnaire";
import { useHistory } from "react-router-dom";
import arrowLeft from '../../images/icons/arrow-left-icon.png'
import arrowRight from '../../images/icons/arrow-right-icon.png'
import capIcon from '../../images/icons/cap-icon.png'
import rocketIcon from '../../images/icons/rocket-icon.png'
import bulbIcon from '../../images/icons/bulb-icon.png'
import feetIcon from '../../images/icons/feet-icon.png'
import { NavLink, Link } from "react-router-dom";
import plusButton from '../../images/icons/plus-icon.png'
import deleteIcon from '../../images/icons/delete-icon.png'

const AddOutput = () => {
    const [activityID, setActivityID] = useState(null)
    const [activityTitle, setActivityTitle] = useState('')
    const [color, setColor] = useState('')

    const menuState = MenuStatus()

    const activities = useFirestore('Activities')
    const outputs = useFirestoreOutputs(activityID && activityID)
    const colors = useFirestore('Colors')

    useEffect(() => {
        colors && colors.forEach(color => {
            const background = color.Background 

            setColor(background)
        })

    },[colors])

    const activityHandler = (e) => {
        const activityID = e.target.options[e.target.selectedIndex].dataset.id
        const activityTitle = e.target.options[e.target.selectedIndex].dataset.title

        setActivityID(activityID)
        setActivityTitle(activityTitle)
    }

    const outputHandler = (e) => {
        const title = e.target.value 
        const docid = e.target.dataset.docid

        db.collection('Outputs')
        .doc(docid)
        .update({
            Title: title
        })
    }

    const addOutput = (e) => {
    

        db.collection('Outputs')
        .doc()
        .set({
            ID: uuid(),
            Compagny: client,
            Timestamp: timestamp,
            Activity: activityTitle,
            ActivityID: activityID,
            Title: '',
        })
    }

    const deleteOutput = (e) => {

        const docid = e.target.dataset.docid

        db.collection('Outputs')
        .doc(docid)
        .delete()

    }


  return (
    <div className="main">
    <LeftSideBar />
    <LeftSideBarFullScreen/>
    <div className="main-container" style={{display: menuState}}>
        <div className="page-header">
            <h1>Outputs</h1>
            <div className='wizard-sub-nav'>
                <NavLink to={`/${client}/ImpactActivity`} >
                    <div className='step-container'>
                        <img src={arrowLeft} alt="" />
                        <p>Impact van activiteit</p>
                    </div>
                </NavLink>  
                <p>12 van de 12</p>
                <NavLink to={`/${client}/OutputEffects`} >
                    <div className='step-container'>
                        <p>Effecten van output</p>
                        <img src={arrowRight} alt="" />
                    </div>
                </NavLink>
            </div>
        </div>
        <div className='profile profile-auth-profile'>
            <div>
                <div className='activity-meta-title-container'>
                    <img src={capIcon} alt="" />
                    <h3>Uitleg</h3>
                </div> 
                <div className='text-section' style={{backgroundColor: color}}>
                    <p><b>Je output zijn de meetbare eenheden die door de activiteiten worden voortgebracht.</b></p>

                    <p>Denk aan:</p>
                    <ul>
                        <li>Aantal klanten</li>
                        <li>Aantal deelnemers aan workshops</li>
                        <li>Aantal verkochte producten</li>
                        <li>Aantal geplante bomen</li>
                        <li>Opgeruimd aantal kilo’s plastic</li>
                    </ul>

                    <p>Een output is tastbaar en concreet. Ze zijn zo concreet dat je er mee kunt rekenen.</p>
                </div>
            </div>
        <div>
        <div className='activity-meta-title-container'>
            <img src={rocketIcon} alt="" />
            <h3>Aan de slag</h3>
        </div> 
        <div className='text-section' style={{backgroundColor: color}}>
            <div>
                <p><b>1. Selecteer de activiteit waar je de output aan wilt koppelen</b></p>
                <select name="" id="" onChange={activityHandler}>
                    <option data-id={''} data-title={''} value="">-- Selecteer een activiteit --</option>
                {activities && activities.map(activity => (
                    <option data-docid={activity.docid} data-id={activity.ID} data-title={activity.Activity}>{activity.Activity}</option>
                ))}
                </select>
            </div >
                <div style={{display: activityID ? 'block' : 'none'}}>
                    <p><b>2. Beheer je outputs</b></p>
                    <div className='list-container'>
                        <div className='list-top-row-container'>
                                <img src={plusButton} alt="" onClick={addOutput}/>
                        </div>
                        <div className='list-top-row-container'>
                            <p>OUTPUT</p>
                            <p>ACTIE</p>
                        </div>
                        {outputs && outputs.map(output => (
                            <div className='list-row-container'>
                                <input type="text" data-docid={output.docid} defaultValue={output.Title} placeholder='Output' onChange={outputHandler} />
                                <img data-docid={output.docid} onClick={deleteOutput} src={deleteIcon} alt="" />
                            </div>  
                        ))}
                    </div>
                </div>
            </div>
        </div>
            <div>
                <div className='activity-meta-title-container'>
                    <img src={bulbIcon} alt="" />
                    <h3>Tips</h3>
                </div> 
                <div className='text-section' style={{backgroundColor: color}}>
                    <p>1. Kom je er niet uit of heb je behoefte aan een second opinion van een impactexpert? Twijfel niet en klik hier.</p>
                    <p>2. Voeg een sprekend plaatje toe om het belang van jullie doel kracht bij te zetten. <a href="https://www.pexels.com/nl-nl/">Hier</a> vind je een heleboel mooie plaatjes die je gratis kunt gebruiken.</p>
                </div>
            </div>
            <div>
                <div className='activity-meta-title-container'>
                    <img src={feetIcon} alt="" />
                    <h3>Volgende stap</h3>
                </div> 
                <div className='text-section' style={{backgroundColor: color}}>
                    <p>In de volgende stap ga je de impactdoelen plannen in de tijd.</p>
                    <button>Volgende stap</button>
                </div>
            </div>
            </div>
        </div>
    </div>
  )
}

export default AddOutput
