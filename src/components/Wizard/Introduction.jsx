import LeftSideBar from "../LeftSideBar"
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import MenuStatus from "../../hooks/MenuStatus";
import arrowRight from '../../images/icons/arrow-right-icon.png'
import capIcon from '../../images/icons/cap-icon.png'
import rocketIcon from '../../images/icons/rocket-icon.png'
import bulbIcon from '../../images/icons/bulb-icon.png'
import feetIcon from '../../images/icons/feet-icon.png'
import {ReactComponent as MagicIcon}  from '../../images/icons/magic-icon.svg'
import {ReactComponent as QuestionIcon}  from '../../images/icons/question-icon.svg'
import { client } from '../../hooks/Client';
import { NavLink, Link } from "react-router-dom";
import ScrollToTop from "../../hooks/ScrollToTop";

const Introduction = () => {

    const menuState = MenuStatus() 

    ScrollToTop()

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
                    <div className='text-section'>
                        <p><b>Welkom bij de Deccos Impact Guide. Deze guide is gemaakt om je te ondersteunen in het vormgeven 
                            van je impactmanagement.</b></p>
                        <p>  
                            Meetbare impact is de bestaansreden van een sociale organisatie. Daarom is impactmanangement 
                            net zo belangrijk voor een sociale organisatie als bijvoorbeeld de boekhouding.
                            Wanneer je impact management integreert in je bedrijfsvoering kun je beter sturen 
                            op de impact die je wilt maken en kun je die impact helderder communiceren naar je stakeholders.
                        </p>
                        <p>
                            Je hoeft het niet in een keer 100% goed te doen,
                            maar het is goed om er gewoon mee te beginnen. De Deccos Impact Guide helpt je daarmee.
                        </p>
                            
                        <p>Ben je het overzicht kwijt of wil je weer een volgende stap zetten? Klik op het &nbsp;
                                <MagicIcon style={{width: '19px', height: '19px'}}/>
                                &nbsp; icon in de bovenbalk (onderbalk op mobiel)
                            om weer terug te komen in de guide.</p>
                    </div>
                </div>
                <div>
                    <div className='activity-meta-title-container'>
                        <img src={rocketIcon} alt="" />
                        <h3>Aan de slag</h3>
                    </div> 
                    <div className='text-section'>
                        <div className='wizard-introduction-menu-card'>
                            <p><b>Context</b></p>
                            <div className='wizard-introduction-menu-container'>
                                <NavLink to={`/${client}/Explainer`} >1. Wat is impactmanagement?</NavLink>
                                <NavLink to={`/${client}/ProblemAnalysis`} >2. Probleemanalyse</NavLink>
                                <NavLink to={`/${client}/StakeholderAnalysis`} >3. Stakeholders</NavLink>
                                <NavLink to={`/${client}/GoalTitle`} >4. Impactdoelen</NavLink>
                                <NavLink to={`/${client}/Targetgroup`} >5. Doelgroep bepalen </NavLink>
                            </div>
                        </div>
                        <div className='wizard-introduction-menu-card'>
                            <p><b>Verandertheorie (Theory Of Change)</b></p>
                            <div className='wizard-introduction-menu-container'>
                                <NavLink to={`/${client}/ImpactTargetgroup`} >6. Impact op doelgroep</NavLink>
                                <NavLink to={`/${client}/ImpactSociety`} >7. Impact op maatschappij</NavLink>
                                <NavLink to={`/${client}/SDGs`} >8. Bijdrage aan SDG's</NavLink>
                                <NavLink to={`/${client}/Assumptions`} >9. Aannames</NavLink>
                                <NavLink to={`/${client}/Conditions`} >10. Externe factoren</NavLink>
                                <NavLink to={`/${client}/AddActivity`} >11. Activiteiten</NavLink>
                                <NavLink to={`/${client}/ImpactActivity`} >12. Impact van activiteit</NavLink>
                                <NavLink to={`/${client}/AddOutput`} >13. Outputs</NavLink>
                                <NavLink to={`/${client}/OutputEffects`} >14. Effecten van output</NavLink>
                            </div>
                        </div>
                        <div className='wizard-introduction-menu-card'>
                            <p><b>SROI</b></p>
                            <div className='wizard-introduction-menu-container'>
                                <NavLink to={`/${client}/AddSROI`} >15. SROI</NavLink> 
                            </div>                  
                        </div>
                        <div className='wizard-introduction-menu-card'>
                            <p><b>Meten</b></p>
                            <div className='wizard-introduction-menu-container'>
                                <NavLink to={`/${client}/MeasureOutput`} >16. Mijlpalen stellen</NavLink>
                                <NavLink to={`/${client}/Questionnaires`} >17. Vragenlijsten</NavLink>
                                <NavLink to={`/${client}/Research`} >18. Onderzoek opzetten</NavLink>
                                <NavLink to={`/${client}/ResearchAnalyses`} >19. Onderzoeksanalyse</NavLink>
                                <NavLink to={`/${client}/Projectmanagement`} >20. Projectbeheer</NavLink>
                            </div>
                        </div>
                        <div className='wizard-introduction-menu-card'>
                            <p><b>Communiceren</b></p>
                            <div className='wizard-introduction-menu-container'>
                                <NavLink to={`/${client}/Impactclub`} >21. Impactclub</NavLink>
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
                        <p>In de volgende stap lees je meer over wat impact management inhoudt.</p>
                        <NavLink to={`/${client}/Explainer`} ><button>Volgende stap</button></NavLink>
                    </div>
                </div>
            </div> 
        </div>
    </div>
)
}

export default Introduction