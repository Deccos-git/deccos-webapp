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
import { useHistory } from "react-router-dom";
import uuid from 'react-uuid';
import {ReactComponent as QuestionIcon}  from '../../images/icons/question-icon.svg'
import { client } from '../../hooks/Client';
import { NavLink, Link } from "react-router-dom";
import taskIcon from '../../images/icons/task-icon.png'
import calendarIcon from '../../images/icons/calendar-icon.png'
import timelineIcon from '../../images/icons/timeline-icon.png'
import meetingIcon from '../../images/icons/meeting-icon.png'
import growIcon from '../../images/icons/grow-icon.png'
import Premium from "../../hooks/Premium";
import PremiumNotice from "../PremiumNotice";
import ImpactGuideMenu from "../../hooks/ImpactGuideMenu";

const Projectmanagement = () => {

    const [color, setColor] = useState('')
   
    const menuState = MenuStatus() 
    const premium = Premium() 
    
    const colors = useFirestore('Colors')
    const groups = useFirestore('Groups')

    useEffect(() => {
        colors && colors.forEach(color => {
            const background = color.Background 

            setColor(background)
        })

    },[colors])

  return (
    <div className="main">
        <LeftSideBar />
        <LeftSideBarFullScreen/>
        <div className="main-container" style={{display: menuState}}>
            <div className="page-header">
                <h1>Projectbeheer</h1>
                <div className='wizard-sub-nav'>
                    <NavLink to={`/${client}/ResearchAnalyses`} >
                        <div className='step-container'>
                            <img src={arrowLeft} alt="" />
                            <p>Onderzoeksanalyse</p>
                        </div>
                    </NavLink>  
                    {ImpactGuideMenu(20)}
                    <NavLink to={`/${client}/Impactclub`} >
                        <div className='step-container'>
                            <p>Impactclub</p>
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
                        <p><b>In het menu vind je het item 'Projectbeheer'. </b></p>
                        <p>
                        Wanneer je mijlpalen creëert en/of een onderzoek aanmaakt worden er 
                        automatisch taken en een tijdspad gecreëerd. Zo houd je altijd het overzicht over je impact management.
                        </p>
                        <p>
                        Het projectmanagement bestaat uit een viertal elementen:
                        </p>
                        <div className='activity-meta-title-container'>
                            <img src={taskIcon} alt="" />
                            <NavLink activeClassName='active' to={`/${client}/Tasks`}>Taken</NavLink>
                        </div>
                        <p>
                        Wanneer er mijlpalen worden gesteld worden deze doelen automatisch vertaald naar taken die je als team 
                        kunt afvinken. Afgevinkte taken worden gebruikt om de outputs en de mijlpalen bij te houden.
                        </p>
                        <p>
                        Ook onderzoeken worden automatisch vertaald naar taken.
                        </p>
                        <div className='activity-meta-title-container'>
                            <img src={calendarIcon} alt="" />
                            <NavLink activeClassName='active' to={`/${client}/Agenda`}>Agenda</NavLink>
                        </div>
                        <p>
                        Wanneer een deadline wordt toegevoegd aan de taken komen deze in de agenda te staan.
                        </p>
                        {/* <div className='activity-meta-title-container'>
                            <img src={timelineIcon} alt="" />
                            <NavLink activeClassName='active' to={`/${client}/Planning`}>Planning</NavLink>
                        </div>
                        <p>De onderzoeken worden automatisch in de planning te staan zodat je overzicht houdt 
                            over het tijdspad van de onderzoeken</p> */}
                        <div className='activity-meta-title-container'>
                            <img src={growIcon} alt="" />
                            <NavLink activeClassName='active' to={`/${client}/MilestoneSettings`}>Mijlpalen</NavLink>
                        </div>
                        <p>
                            Hier vind je de voortgang op de mijlpalen die jullie hebben gesteld. Wanneer er een output taak 
                            wordt afgevinkt in 'taken' worden de mijlpalen automatisch geupdate.
                        </p>
                        <div className='activity-meta-title-container'>
                            <img src={meetingIcon} alt="" />
                            {groups && groups.map(group => (
                                <NavLink activeClassName='active' to={`/${client}/ImpactGroup/${group.ID}`}>ImpactHQ</NavLink>
                            ))}
                        </div>
                        <p>
                        In het Impact HQ kun je met je team chatten en worden automatisch de laatste updates gedeeld.
                        </p>
                    </div>
                </div>
                <div>
                    <div className='activity-meta-title-container'>
                        <img src={rocketIcon} alt="" />
                        <h3>Aan de slag</h3>
                    </div> 
                    <div className='text-section' style={{backgroundColor: color}}>
                        <div style={{display: premium ? 'block' : 'none'}}>
                            <div className='activity-meta-title-container wizard-projectmanagement-link-container'>
                                <img src={taskIcon} alt="" />
                                <NavLink activeClassName='active' to={`/${client}/Tasks`}>Bekijk taken</NavLink>
                            </div>
                            <div className='activity-meta-title-container wizard-projectmanagement-link-container'>
                                <img src={calendarIcon} alt="" />
                                <NavLink activeClassName='active' to={`/${client}/Agenda`}>Bekijk agenda</NavLink>
                            </div>
                            {/* <div className='activity-meta-title-container wizard-projectmanagement-link-container'>
                                <img src={timelineIcon} alt="" />
                                <NavLink activeClassName='active' to={`/${client}/Planning`}>Bekijk planning</NavLink>
                            </div> */}
                            <div className='activity-meta-title-container wizard-projectmanagement-link-container'>
                                <img src={growIcon} alt="" />
                                <NavLink activeClassName='active' to={`/${client}/MilestoneSettings`}>Bekijk mijlpalen</NavLink>
                            </div>
                            <div className='activity-meta-title-container wizard-projectmanagement-link-container'>
                                <img src={meetingIcon} alt="" />
                                {groups && groups.map(group => (
                                    <NavLink activeClassName='active' to={`/${client}/ImpactGroup/${group.ID}`}>Bekijk impactHQ</NavLink>
                                ))}
                            </div>
                        </div>
                        <div style={{display: premium ? 'none' : 'flex'}}>
                            <PremiumNotice/>
                        </div>
                    </div>
                </div>
                <div>
                    <div className='activity-meta-title-container'>
                        <img src={bulbIcon} alt="" />
                        <h3>Tips</h3>
                    </div> 
                    <div className='text-section' style={{backgroundColor: color}}>
                        <ol>
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
                    <div className='text-section' style={{backgroundColor: color}}>
                        <p>In de volgende stap leer je hoe je jullie meetbare impact kunt communiceren via de Deccos Impactclub.</p>
                        <NavLink to={`/${client}/Impactclub`} ><button>Volgende stap</button></NavLink>
                    </div>
                </div>
            </div> 
        </div>
    </div>
  )
}

export default Projectmanagement