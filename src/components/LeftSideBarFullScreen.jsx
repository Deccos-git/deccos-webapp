import '../CSS/leftSideBar.css';
import { Link } from "react-router-dom";
import { client } from '../hooks/Client';
import { useFirestore } from '../firebase/useFirestore';
import { MobileMenu } from '../StateManagment/MobileMenu';
import { motion } from "framer-motion"
import { useState , useEffect, useContext} from 'react';
import { Auth } from '../StateManagment/Auth';

const LeftSideBarFullScreen = () => {
    const [menu, setMenu] = useContext(MobileMenu)
    const [authO] = useContext(Auth)

    const [impacteer, setImpacteer] = useState('none')
    const [projectManager, setprojectManager] = useState('none')
    const [displayWelcome, setDisplayWelcome] = useState('')
    const [displayImpact, setDisplayImpact] = useState('')
    const [displayChannels, setDisplayChannels] = useState('')
    const [displayGroups, setDisplayGroups] = useState('')
    const [displayProjectManagement, setDisplayProjectManagement] = useState('')
    const [displayMatches, setDisplayMatches] = useState('')

    const groups = useFirestore("Groups")
    const channels = useFirestore("Channels")
    const impacteers = useFirestore('Impacteers')
    const projects = useFirestore('Projects')
    const admins = useFirestore('Admins')
    const compagny = useFirestore("CompagnyMeta")
    const projectManagers = useFirestore('ProjectManagers')

    useEffect(() => {
        compagny && compagny.forEach(comp => {
            setDisplayWelcome(comp.Welcome)
            setDisplayImpact(comp.Impact)
            setDisplayChannels(comp.Channels)
            setDisplayGroups(comp.Groups)
            setDisplayProjectManagement(comp.ProjectManagement)
            setDisplayMatches(comp.Matches)
        })
    },[compagny])

    useEffect(() => {
        projectManagers && projectManagers.forEach(manager => {
            if(manager.UserID === authO.ID){
                setprojectManager('block')
            }
        })
    }, [impacteers])

    useEffect(() => {
        impacteers && impacteers.forEach(impacteer => {
            if(impacteer.UserID === authO.ID){
                setImpacteer('block')
            }
        })
    }, [impacteers])

    useEffect(() => {
        admins && admins.forEach(admin => {
            if(admin.UserID === authO.ID){
                setImpacteer('block')
            }
        })
    }, [admins])

    const changeMenuStatus = () => {
        setMenu("none")
    }

    const showProjectManagement = () => {
        if(displayProjectManagement === true  && projectManager === 'block'){
            return 'block'
        } else if (displayProjectManagement === false  && projectManager=== 'block') {
            return 'none'
        } else if (displayProjectManagement === false  && projectManager === 'none') {
            return 'none'
        }
    }

    const showImpact = () => {
        if(displayImpact === true  && impacteer === 'block'){
            return 'block'
        } else if (displayImpact === false  && impacteer === 'block') {
            return 'none'
        } else if (displayImpact === false  && impacteer === 'none') {
            return 'none'
        }
    }

    const showWelcome = () => {
        if(displayWelcome === true){
            return 'block'
        } else if (displayWelcome === false ) {
            return 'none'
        }
    }

    const showGroups = () => {
        if(displayGroups === true){
            return 'block'
        } else if (displayGroups === false ) {
            return 'none'
        }
    }

    const showChannels = () => {
        if(displayChannels === true){
            return 'block'
        } else if (displayChannels === false ) {
            return 'none'
        }
    }

    const showMatches = () => {
        if(displayMatches === true){
            return 'block'
        } else if (displayMatches === false ) {
            return 'none'
        }
    }

    return (
        <div 
        className="left-sidebar-container-mobile" 
        style={{display: menu}}>
            <div className="left-side-bar-full-screen">
                <div className="channel-div" style={{display: showWelcome()}}>
                    <h3>Welkom</h3>
                    <div className="channel-inner-div">
                        <Link to={`/${client}/Start`} onClick={changeMenuStatus} >Start hier</Link>
                        <Link to={`/${client}/Introductions`} onClick={changeMenuStatus} >Stel je voor</Link>
                        <Link to={`/${client}/AllActivity`} onClick={changeMenuStatus} >Alle activiteit</Link>
                    </div>
                </div>
                <div className="channel-div" style={{display: showChannels()}}>
                    <div className="nav-title-container">
                        <h3>Kanalen</h3>
                    </div>
                    {channels && channels.map(channel => (
                        <div className="channel-inner-div"  key={channel.ID}>
                            <Link to={`/${client}/${channel.Link}/${channel.ID}`} onClick={changeMenuStatus}>{channel.Name}</Link>
                        </div>
                    ))}
                </div>
                <div className="channel-div" style={{display: showGroups()}}>
                    <div className="nav-title-container">
                        <h3>Groepen</h3>
                    </div>
                    {groups && groups.map(group => (
                        <div className="channel-inner-div" key={group.ID}>
                            <Link to={`/${client}/GroupLanding/${group.ID}`} onClick={changeMenuStatus}>{group.Room}</Link>
                        </div>
                    ))}
                </div>
                <div className="channel-div" style={{display: showProjectManagement()}}>
                    <div className="nav-title-container">
                        <h3>Activiteitenbeheer</h3>
                    </div>
                    {projects && projects.map(project => (
                        <div className="channel-inner-div">
                            <Link to={`/${client}/Project/${project.ID}`} onClick={changeMenuStatus}>{project.Title}</Link>
                        </div>
                    ))}
                </div>
                <div className="channel-div" style={{display: showMatches()}}>
                    <div className="nav-title-container">
                        <h3>Matching</h3>
                    </div>
                    <div className="channel-inner-div">
                        <Link activeClassName='active' to={`/${client}/MatchItems`} onClick={changeMenuStatus}>Match items</Link>
                    </div>
                    <div className="channel-inner-div">
                        <Link activeClassName='active' to={`/${client}/Matches`} onClick={changeMenuStatus}>Matches</Link>
                    </div>
                </div>
                <div className="channel-div" style={{display: showImpact()}}>
                    <div className="nav-title-container">
                        <h3>Impact</h3>
                    </div>
                    <div className="channel-inner-div">
                        <Link activeClassName='active' to={`/${client}/ImpactProgress`} onClick={changeMenuStatus}>Dashboard</Link>
                    </div>
                    {/* <div className="channel-inner-div">
                        <Link activeClassName='active' to={`/${client}/Activities`}>Mijlpalen</Link>
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default LeftSideBarFullScreen
