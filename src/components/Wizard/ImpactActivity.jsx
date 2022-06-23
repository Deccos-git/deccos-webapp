import LeftSideBar from "../LeftSideBar"
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import MenuStatus from "../../hooks/MenuStatus";
import arrowLeft from '../../images/icons/arrow-left-icon.png'
import arrowRight from '../../images/icons/arrow-right-icon.png'
import capIcon from '../../images/icons/cap-icon.png'
import rocketIcon from '../../images/icons/rocket-icon.png'
import bulbIcon from '../../images/icons/bulb-icon.png'
import feetIcon from '../../images/icons/feet-icon.png'
import { useFirestore } from "../../firebase/useFirestore";
import { useState, useEffect, useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import { client } from '../../hooks/Client';
import { db, timestamp } from "../../firebase/config.js"
import ButtonClicked from "../../hooks/ButtonClicked";
import {ReactComponent as QuestionIcon}  from '../../images/icons/question-icon.svg'
import ImpactGuideMenu from "../../hooks/ImpactGuideMenu";
import eyeIcon from '../../images/icons/eye-icon.png'
import dashboardIcon from '../../images/icons/dashboard-icon.png'
import activityIcon from '../../images/icons/activity-icon.png'
import ScrollToTop from "../../hooks/ScrollToTop";
import { SavedIcon } from "../../StateManagment/SavedIcon";

const ImpactActivity = () => {
    const [saved, setSaved] = useContext(SavedIcon)

    const [activityDocid, setActivityDocid] = useState('')
    const [impact, setImpact] = useState('')

    const menuState = MenuStatus()
    ScrollToTop()
    
    const activities = useFirestore('Activities') 

    const activityHandler = (e) => {

        const docid = e.target.options[e.target.selectedIndex].dataset.docid 
        const impact = e.target.options[e.target.selectedIndex].dataset.impact

        setActivityDocid(docid)
        setImpact(impact)

    }

    const impactHandler = (e) => {

        const impact = e.target.value 

        db.collection('Activities')
        .doc(activityDocid)
        .update({
            Impact: impact
        })
        .then(() => {
            setSaved('flex')
         })

    }

  return (
    <div className="main">
    <LeftSideBar />
    <LeftSideBarFullScreen/>
    <div className="main-container" style={{display: menuState}}>
        <div className="page-header">
            <h1>Impact van activiteit</h1>
            <div className='wizard-sub-nav'>
                <NavLink to={`/${client}/AddActivity`} >
                    <div className='step-container'>
                        <img src={arrowLeft} alt="" />
                        <p>Activiteiten</p>
                    </div>
                </NavLink>  
                {ImpactGuideMenu(12)}
                <NavLink to={`/${client}/AddOutput`} >
                    <div className='step-container'>
                        <p>Outputs</p>
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
                <div className='text-section'>
                    <p><b>Wat is de concrete en meetbare impact die de activiteiten hebben op jouw doelgroep?</b></p>
                    <p>
                    Bekijk de impact door de ogen van je doelgroep. Welke positieve bijdrage heeft een specifieke 
                    activiteit die niet zou zijn ontstaan als jouw activiteit niet had plaatsgevonden?
                    </p>
                </div>
            </div>
            <div>
                <div className='activity-meta-title-container'>
                    <img src={rocketIcon} alt="" />
                    <h3>Aan de slag</h3>
                </div> 
                <div className='text-section'>
                    <p><b>1. Selecteer de activiteit waar je de impact aan wilt koppelen</b></p>
                    <select name="" id="" onChange={activityHandler}>
                        <option value="">-- Selecteer een activiteit --</option>
                    {activities && activities.map(activity => (
                        <option key={activity.ID} data-docid={activity.docid} data-impact={activity.Impact} value={activity.Activity}>{activity.Activity}</option>
                    ))}
                    </select>
                    <p><b>2. Formuleer de impact</b></p>
                    <textarea type="text" placeholder='Schrijf hier de impact' defaultValue={impact ? impact : ''} onChange={impactHandler} />
                </div>
            </div>
            <div>
                <div className='activity-meta-title-container'>
                    <img src={eyeIcon} alt="" />
                    <h3>Bekijk</h3>
                </div> 
                <div className='text-section'>
                    <p><b>Je kunt je impact op de activiteiten hier terug vinden:</b></p>
                    <div className="channel-inner-div">
                        <div className='activity-meta-title-container'>
                            <img src={activityIcon} alt="" />
                            <NavLink activeClassName='active' to={`/${client}/Activities`}>Activiteiten</NavLink>
                        </div>
                    </div>
                    <div className="channel-inner-div">
                        <div className='activity-meta-title-container'>
                            <img src={dashboardIcon} alt="" />
                            <NavLink activeClassName='active' to={`/${client}/ImpactProgress`}>Dashboard</NavLink>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div className='activity-meta-title-container'>
                    <img src={bulbIcon} alt="" />
                    <h3>Tips</h3>
                </div> 
                <div className='text-section'>
                    <ol>
                        <li>
                            Zorg ervoor dat de impact op de doelgroep concreet en meetbaar is.
                        </li>
                        <li>
                            Kom je er niet uit of heb je behoefte aan ondersteuning van een impactexpert? 
                            Klik op het 
                            <NavLink to={`/${client}/Support`} >
                                <QuestionIcon style={{width: '19px', height: '19px'}}/> 
                            </NavLink>
                            icon in de 
                            bovenbalk (onderbalk op mobiel) voor alle ondersteuningsmogelijkheden.
                        </li>
                        <li>Benieuwd naar de impact van andere sociale MKB'ers? Neem eens een kijkje in de <a href="https://deccos.nl/Milestones">Deccos Impactclub</a>.</li>
                    </ol>
                </div>
            </div>
            <div>
                <div className='activity-meta-title-container'>
                    <img src={feetIcon} alt="" />
                    <h3>Volgende stap</h3>
                </div> 
                <div className='text-section'>
                    <p>In de volgende stap ga je de outputs van de activiteiten omschrijven.</p>
                    <NavLink to={`/${client}/AddOutput`} ><button>Volgende stap</button></NavLink>
                </div>
            </div>
        </div> 
    </div>
</div>
  )
}

export default ImpactActivity