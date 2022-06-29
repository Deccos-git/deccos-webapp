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
import taskIcon from '../images/icons/task-icon.png'
import calendarIcon from '../images/icons/calendar-icon.png'
import homeIcon from '../images/icons/home-icon.png'
import researchIcon from '../images/icons/research-icon.png'
import meetingIcon from '../images/icons/meeting-icon.png'
import growIcon from '../images/icons/grow-icon.png'

const LeftSideBar = () => {

    const groups = useFirestore('Groups')


    return (
        <div className="left-sidebar-container">
            <div className="left-side-bar">
                <div className="channel-div">
                    <h3>Home</h3>
                    <div className="channel-inner-div">
                        <div className='activity-meta-title-container'>
                            <img src={homeIcon} alt="" />
                            <NavLink activeClassName='active' to={`/${client}/Home`}>Home</NavLink>
                        </div>
                        <div className='activity-meta-title-container'>
                            <img src={dashboardIcon} alt="" />
                            <NavLink activeClassName='active' to={`/${client}/ImpactProgress`}>Dashboard</NavLink>
                        </div>
                    </div>
                </div>
                <div className="channel-div">
                    <div className="nav-title-container">
                        <h3>Projectbeheer</h3>
                    </div>
                    <div className="channel-inner-div">
                        <div className='activity-meta-title-container'>
                            <img src={taskIcon} alt="" />
                            <NavLink activeClassName='active' to={`/${client}/Tasks`}>Taken</NavLink>
                        </div>
                    </div>
                    <div className="channel-inner-div">
                        <div className='activity-meta-title-container'>
                            <img src={calendarIcon} alt="" />
                            <NavLink activeClassName='active' to={`/${client}/Agenda`}>Agenda</NavLink>
                        </div>
                    </div>
                    {/* <div className="channel-inner-div">
                        <div className='activity-meta-title-container'>
                            <img src={timelineIcon} alt="" />
                            <NavLink activeClassName='active' to={`/${client}/Planning`}>Planning</NavLink>
                        </div>
                    </div> */}
                     <div className="channel-inner-div">
                        <div className='activity-meta-title-container'>
                            <img src={growIcon} alt="" />
                            <NavLink activeClassName='active' to={`/${client}/MilestoneSettings`}>Mijlpalen</NavLink>
                        </div>
                    </div>
                    <div className="channel-inner-div">
                        <div className='activity-meta-title-container'>
                            <img src={meetingIcon} alt="" />
                            {groups && groups.map(group => (
                                <NavLink key={group.ID} activeClassName='active' to={`/${client}/ImpactGroup/${group.ID}`}>Impact HQ</NavLink>
                            ))}
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
                            <NavLink activeClassName='active' to={`/${client}/ProblemAnalysisDetail`}>Probleemanalyse</NavLink>
                        </div>
                    </div>
                    <div className="channel-inner-div">
                        <div className='activity-meta-title-container'>
                            <img src={personIcon} alt="" />
                            <NavLink activeClassName='active' to={`/${client}/Stakeholders`}>Stakeholders</NavLink>
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
                        <h3>Activiteiten</h3>
                    </div>
                    <div className="channel-inner-div">
                        <div className='activity-meta-title-container'>
                            <img src={activityIcon} alt="" />
                            <NavLink activeClassName='active' to={`/${client}/Activities`}>Activiteiten</NavLink>
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
                            <img src={researchIcon} alt="" />
                            <NavLink activeClassName='active' to={`/${client}/ResearchSettings`}>Onderzoeken</NavLink>
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
