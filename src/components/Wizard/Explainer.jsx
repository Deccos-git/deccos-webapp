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
import ImpactGuideMenu from "../../hooks/ImpactGuideMenu";

const Explainer = () => {

    const [color, setColor] = useState('')

    const history = useHistory()
    const menuState = MenuStatus() 
    const id = uuid()
    
    const colors = useFirestore('Colors')

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
                <h1>Wat is impactmanagement?</h1>
                <div className='wizard-sub-nav'>
                    <NavLink to={`/${client}/Introduction`} >
                        <div className='step-container'>
                            <img src={arrowLeft} alt="" />
                            <p>Deccos Impact Guide</p>
                        </div>
                    </NavLink>  
                    {ImpactGuideMenu(1)}
                    <NavLink to={`/${client}/ProblemAnalysis`} >
                        <div className='step-container'>
                            <p>Probleemanalyse</p>
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
                        <p><b>
                            Het bestaansrecht van een sociale onderneming is de maatschappelijke impact die wordt gerealiseerd. 
                            Hoe maak je die impact meetbaar? Dat is de centrale vraag waar je aan de hand van impactmanagement 
                            een antwoord op formuleert.
                        </b></p>
                        <p>
                            Zoals het woord management al doet vermoeden is impact management geen eenmalige taak. Het is een doorgaand proces 
                            van plannen, meten, analyseren en leren. Je start met leggen van een fundament, maar dit is geen statisch, 
                            onveranderlijk document. Naarmate de tijd vordert zullen je opgedane ervaringen zijn weerslag hebben op 
                            alle aspecten van je impact management. Je zult schrappen en verfijnen, toevoegen en aanpassen. 
                        </p>
                        <p>Impactmanagement is niet iets dat in één keer perfect hoeft te zijn. Het is een proces waarin je 
                            kunt groeien en telkens nieuwe stappen kunt zetten.
                        </p>
                        <p>
                            Wanneer impactmanagement een onderdeel van je bedrijfsvoering is krijg je een groeiend inzicht 
                            in waar het in jouw sociale ondernemeing om draait: meetbare maatschappelijke impact.
                        </p>
                        <p>Binnen Deccos bestaat impactmanagement uit vier delen:</p>
                        <ul>
                            <li>De context</li>
                            <li>Het veranderpad (Theory Of Change)</li>
                            <li>Het meetplan</li>
                            <li>Communiceren</li>
                        </ul>
                        <p>Binnen de context onderzoek je wat precies de aard is van het maatschappelijke probleem 
                            dat je op wilt lossen. Vervolgens beschrijf je wie de belangrijke betrokkenen zijn (je stakeholders).
                            Daarna formuleer je jouw impactdoelen.
                        </p>
                        <p>Aan de hand van het veranderpad (Theory Of Change) werk je uit hoe je jullie 
                            bedrijfsactiviteiten in kunt zetten om de impact doelen te realiseren.
                        </p>
                        <p>Het veranderpad is de basis voor het meetplan. In het meetplan werk je uit of de 
                            activiteiten daadwerkelijk tot de gewenste impact leiden. De impact wordt meetbaar gemaakt. 
                            De eerste stap is het bijhouden van de outputs. De tweede stap is het meten van de effecten. 
                            Dit doe je aan de hand van bijvoorbeeld een vragenlijst of interview.
                        </p>
                        <p>Het communiceren van je impact doe je in de Deccos Impactclub. In de Impactclub kun je je 
                            stakeholders uitnodigen om je impact realtime te volgen. Zo kunnen je stakeholders altijd 
                            op de hoogte blijven van jullie real-time voortgang en ambities.
                        </p>
                    </div>
                </div>
                <div>
                    <div className='activity-meta-title-container'>
                        <img src={bulbIcon} alt="" />
                        <h3>Tips</h3>
                    </div> 
                    <div className='text-section' style={{backgroundColor: color}}>
                        <ol>
                            <li>Kom je er niet uit of heb je behoefte aan ondersteuning van een impactexpert? 
                                Klik op het <QuestionIcon style={{width: '19px', height: '19px'}}/> icon in de 
                                bovenbalk (onderbalk op mobiel) voor alle ondersteuningsmogelijkheden.</li>
                        </ol>
                    </div>
                </div>
                <div>
                    <div className='activity-meta-title-container'>
                        <img src={feetIcon} alt="" />
                        <h3>Volgende stap</h3>
                    </div> 
                    <div className='text-section' style={{backgroundColor: color}}>
                        <p>De eerste stap in het impact management proces is een probleemanalyse maken.</p>
                        <NavLink to={`/${client}/ProblemAnalysis`} ><button>Aan de slag</button></NavLink>
                    </div>
                </div>
            </div> 
        </div>
    </div>
  )
}

export default Explainer