import '../CSS/leftSideBar.css';
import { NavLink, Link } from "react-router-dom";
import { client } from '../hooks/Client';
import { useFirestore } from '../firebase/useFirestore';
import activityIcon from '../images/icons/activity-icon.png'
import dashboardIcon from '../images/icons/dashboard-icon.png'
import allActivityIcon from '../images/icons/all-activity-icon.png'
import personIcon from '../images/icons/person-icon.png'
import twoPersonIcon from '../images/icons/two-person-icon.png'
import goalIcon from '../images/icons/goal-icon.png'
import problemIcon from '../images/icons/problem-icon.png'
import outputIcon from '../images/icons/output-icon.png'
import sroiIcon from '../images/icons/sroi-icon.png'
import measureIcon from '../images/icons/measure-icon.png'
import groupIcon from '../images/icons/group-icon.png'
import listIcon from '../images/icons/list-icon.png'
import festiveIcon from '../images/icons/festive-icon.png'

const LeftSideBar = () => {

    const projects = useFirestore('Projects')

    return (
        <div className="left-sidebar-container">
            <div className="left-side-bar">
                <div className="channel-div">
                    <h3>Home</h3>
                    <div className="channel-inner-div">
                        <div className="channel-inner-div">
                            <div className='activity-meta-title-container'>
                                <img src={dashboardIcon} alt="" />
                                <NavLink activeClassName='active' to={`/${client}/ImpactProgress`}>Dashboard</NavLink>
                            </div>
                        </div>
                        <div className='activity-meta-title-container'>
                            <img src={allActivityIcon} alt="" />
                            <NavLink activeClassName='active' to={`/${client}/AllActivity`} >Alle activiteit</NavLink>
                        </div>
                    </div>
                </div>
                <div className="channel-div">
                    <div className="nav-title-container">
                        <h3>Context</h3>
                    </div>
                    <div className="channel-inner-div">
                        <div className='activity-meta-title-container'>
                            <img src={problemIcon} alt="" />
                            <NavLink activeClassName='active' to={`/${client}/ProblemAnalysis`}>Probleemanalyse</NavLink>
                        </div>
                    </div>
                    <div className="channel-inner-div">
                        <div className='activity-meta-title-container'>
                            <img src={goalIcon} alt="" />
                            <NavLink activeClassName='active' to={`/${client}/Goals`}>Impactdoelen</NavLink>
                        </div>
                    </div>
                </div>
                <div className="channel-div">
                    <div className="nav-title-container">
                        <h3>Stakeholders</h3>
                    </div>
                    <div className="channel-inner-div">
                        <div className='activity-meta-title-container'>
                            <img src={personIcon} alt="" />
                            <NavLink activeClassName='active' to={`/${client}/Stakeholders`}>Stakeholderbeheer</NavLink>
                        </div>
                    </div>
                </div>
                <div className="channel-div">
                    <div className="nav-title-container">
                        <h3>Projectbeheer</h3>
                    </div>
                    {projects && projects.map(project => (
                        <div className="channel-inner-div">
                            <div className='activity-meta-title-container'>
                                <img src={activityIcon} alt="" />
                                <NavLink activeClassName='active' to={`/${client}/Project/${project.ID}`}>{project.Title}</NavLink>
                            </div>
                        </div>
                    ))}
                     <div className="channel-inner-div">
                        <div className='activity-meta-title-container'>
                            <img src={festiveIcon} alt="" />
                            <NavLink activeClassName='active' to={`/${client}/MilestoneSettings`}>Mijlpalen</NavLink>
                        </div>
                    </div>
                </div>
                <div className="channel-div">
                    <div className="nav-title-container">
                        <h3>Outputs</h3>
                    </div>
                    <div className="channel-inner-div">
                        <div className='activity-meta-title-container'>
                            <img src={outputIcon} alt="" />
                            <NavLink activeClassName='active' to={`/${client}/OutputSettings`}>Outputs</NavLink>
                        </div>
                    </div>
                    <div className="channel-inner-div">
                        <div className='activity-meta-title-container'>
                            <img src={sroiIcon} alt="" />
                            <NavLink activeClassName='active' to={`/${client}/SROI`}>SROI</NavLink>
                        </div>
                    </div>
                </div>
                <div className="channel-div">
                    <div className="nav-title-container">
                        <h3>Meten</h3>
                    </div>
                    <div className="channel-inner-div">
                        <div className='activity-meta-title-container'>
                            <img src={measureIcon} alt="" />
                            <NavLink activeClassName='active' to={`/${client}/Instruments`}>Meetinstrumenten</NavLink>
                        </div>
                    </div>
                    <div className="channel-inner-div">
                        <div className='activity-meta-title-container'>
                            <img src={listIcon} alt="" />
                            <NavLink activeClassName='active' to={`/${client}/QuestionnaireSettings`}>Vragenlijsten</NavLink>
                        </div>
                    </div>
                </div>
                <div className="channel-div">
                    <div className="nav-title-container">
                        <h3>Communiceren</h3>
                    </div>
                    <div className="channel-inner-div">
                        <div className='activity-meta-title-container'>
                            <img src={groupIcon} alt="" />
                            <NavLink activeClassName='active' to={`/${client}/Impacthub`}>Impactclub</NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LeftSideBar
