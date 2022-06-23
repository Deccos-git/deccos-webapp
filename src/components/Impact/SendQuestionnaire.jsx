import LeftSideBar from "../LeftSideBar"
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import MenuStatus from "../../hooks/MenuStatus";
import arrowLeft from '../../images/icons/arrow-left-icon.png'
import arrowRight from '../../images/icons/arrow-right-icon.png'
import capIcon from '../../images/icons/cap-icon.png'
import rocketIcon from '../../images/icons/rocket-icon.png'
import bulbIcon from '../../images/icons/bulb-icon.png'
import feetIcon from '../../images/icons/feet-icon.png'
import sendIcon from '../../images/icons/send-icon.png'
import Location from "../../hooks/Location"
import { useFirestoreID, useFirestore, useFirestoreStakeholders, useFirestoreCompagny } from "../../firebase/useFirestore"
import { useState, useRef, useEffect } from "react";
import { client, pathID, pathIDTwo } from "../../hooks/Client";
import { db, timestamp } from "../../firebase/config";
import { NavLink, Link } from "react-router-dom";
import eyeIcon from '../../images/icons/eye-icon.png'
import listIcon from '../../images/icons/list-icon.png'
import ImpactGuideMenu from "../../hooks/ImpactGuideMenu";
import {ReactComponent as QuestionIcon}  from '../../images/icons/question-icon.svg'
import ButtonClicked from "../../hooks/ButtonClicked";
import ScrollToTop from "../../hooks/ScrollToTop";

const SendQuestionnaire = () => {
    const route = Location()[3]

    const menuState = MenuStatus()
    ScrollToTop()

  

    console.log(pathIDTwo)

    return (
        <div className="main">
        <LeftSideBar />
        <LeftSideBarFullScreen/>
        <div className="main-container" style={{display: menuState}}>
            <div className="page-header">
                <h1>Vragenlijst versturen</h1>
                <div className='wizard-sub-nav-introduction'>
                    <NavLink to={`/${client}/Research`} >
                        <div className='step-container'>
                            <p>Onderzoek</p>
                            <img src={arrowLeft} alt="" />
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
                   <p><b>Vragenlijsten kunnen via Deccos worden verstuurd naar je stakeholders.</b></p>
                    <p>
                        Je respondenten krijgen een link naar de vragenlijst via een door Deccos verstuurde email. 
                        Hieronder kun je invullen naar welke stakeholders je de vragenlijst wilt versturen en 
                        welk boodschap je mee wilt geven in de email. 
                    </p>

                    <p>Wanneer er een vragenlijst is ingevuld ontvang je een email notificatie.</p>
                </div>
                <div>
                    <div className='activity-meta-title-container'>
                        <img src={rocketIcon} alt="" />
                        <h3>Aan de slag</h3>
                    </div> 
                    <div className='text-section'>
                        <p><b>De deelnemers aan je onderzoek kunnen de vragenlijst invullen via deze link:</b></p>
                        <p>{`https://deccos.nl/Questionnaires/${route}/${pathIDTwo}`}</p>
                    </div>
                    <div>
                        <div className='activity-meta-title-container'>
                            <img src={eyeIcon} alt="" />
                            <h3>Bekijk</h3>
                        </div> 
                        <div className='text-section'>
                            <p><b>Je kunt je de resulaten van de verstuurde vragenlijst hier terug vinden:</b></p>
                            <div className="channel-inner-div">
                            <div>
                                <NavLink to={`/${client}/ResearchSettings`} >
                                    <div className='activity-meta-title-container'>
                                        <img src={listIcon} alt="" />
                                        <p>Onderzoeken</p>
                                    </div>
                                </NavLink>
                                
                            </div>
                        </div>
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
                        <p>Terug naar onderzoek:</p>
                        <NavLink to={`/${client}/Research`} ><button>Naar onderzoek</button></NavLink>
                    </div>
                </div>
            </div> 
        </div>
    </div>
    )
}

export default SendQuestionnaire
