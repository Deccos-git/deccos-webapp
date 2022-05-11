import LeftSideBar from "../LeftSideBar"
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import MenuStatus from "../../hooks/MenuStatus";
import arrowRight from '../../images/icons/arrow-right-icon.png'
import capIcon from '../../images/icons/cap-icon.png'
import rocketIcon from '../../images/icons/rocket-icon.png'
import bulbIcon from '../../images/icons/bulb-icon.png'
import feetIcon from '../../images/icons/feet-icon.png'
import { useFirestore } from "../../firebase/useFirestore";
import { useState, useEffect, useContext } from "react";
import {ReactComponent as MagicIcon}  from '../../images/icons/magic-icon.svg'
import {ReactComponent as QuestionIcon}  from '../../images/icons/question-icon.svg'
import { client } from '../../hooks/Client';
import { useHistory } from "react-router-dom"
import { NavLink, Link } from "react-router-dom";

const Introduction = () => {
    const [color, setColor] = useState('')

    const colors = useFirestore('Colors')

    const menuState = MenuStatus() 
    const history = useHistory()

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
                <h1>Deccos Impact Guide</h1>
                <div className='wizard-sub-nav-introduction'>
                    <NavLink to={`/${client}/Explainer`} >
                        <div className='step-container'>
                            <p>Wat is impact management?</p>
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
                        <p><b>Welkom bij de Deccos Impact Guide. Deze guide is gemaakt om je te ondersteuning in het vormgeven 
                            van je impactmanagement.</b></p>
                        <p>  
                            Meetbare impact is de bestaansreden van een sociale organisatie. Daarom is impactmanangement is 
                            net belangrijk voor een sociale organisatie als bijvoorbeeld de boekhouding. Je hoeft het niet in een 100% goed te doen,
                            maar het is goed om er gewoon mee te beginnen. De Deccos Impact Wizard helpt je daarmee.</p>
                        <p>Ben je het overzicht kwijt of wil je weer een volgende stap zetten? Klik op het 
                            <MagicIcon style={{width: '19px', height: '19px'}}/> icon in de bovenbalk (onderbalk op mobiel)
                            om weer terug te komen in de guide.</p>
                    </div>
                </div>
                <div>
                    <div className='activity-meta-title-container'>
                        <img src={rocketIcon} alt="" />
                        <h3>Aan de slag</h3>
                    </div> 
                    <div className='text-section' style={{backgroundColor: color}}>
                        <ol>
                            <li><NavLink to={`/${client}/Explainer`} >Wat is impactmanagement?</NavLink></li>
                            <li><NavLink to={`/${client}/ProblemAnalysis`} >Probleemanalyse</NavLink></li>
                            <li><NavLink to={`/${client}/StakeholderAnalysis`} >Stakeholders</NavLink></li>
                            <li><NavLink to={`/${client}/GoalTitle`} >Impactdoelen</NavLink></li>
                            <li><NavLink to={`/${client}/Targetgroup`} >Doelgroep bepalen </NavLink></li>
                            <li><NavLink to={`/${client}/ImpactTargetgroup`} >Impact op doelgroep</NavLink></li>
                            <li><NavLink to={`/${client}/ImpactSociety`} >Impact op maatschappij</NavLink></li>
                            <li><NavLink to={`/${client}/SDGs`} >Bijdrage aan SDG's</NavLink></li>
                            <li><NavLink to={`/${client}/Assumptions`} >Aannames</NavLink></li>
                            <li><NavLink to={`/${client}/Conditions`} >Externe factoren</NavLink></li>
                            <li><NavLink to={`/${client}/AddActivity`} >Activiteiten</NavLink></li>
                            <li><NavLink to={`/${client}/ImpactActivity`} >Impact van activiteit</NavLink></li>
                            <li><NavLink to={`/${client}/AddOuput`} >Outputs</NavLink></li>
                            <li><NavLink to={`/${client}/OutputEffects`} >Effecten van output</NavLink></li>
                        </ol>
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
                        <p>In de volgende stap lees je meer over wat impactmanagement inhoudt.</p>
                        <button>Volgende stap</button>
                    </div>
                </div>
            </div> 
        </div>
    </div>
)
}

export default Introduction