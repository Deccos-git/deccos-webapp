import '../CSS/leftSideBar.css';
import { NavLink, Link } from "react-router-dom";
import { client } from '../hooks/Client';
import { useFirestore } from '../firebase/useFirestore';
import { useState , useEffect, useContext} from 'react';
import { Auth } from '../StateManagment/Auth';

const LeftSideBar = () => {
    const [authO] = useContext(Auth)

    const [impacteer, setImpacteer] = useState('none')
    const [projectManager, setprojectManager] = useState('none')
    const [displayWelcome, setDisplayWelcome] = useState('')
    const [displayProjectManagement, setDisplayProjectManagement] = useState('')
    const [displayImpact, setDisplayImpact] = useState('')
    const [displayChannels, setDisplayChannels] = useState('')
    const [displayGroups, setDisplayGroups] = useState('')
    const [displayMatches, setDisplayMatches] = useState('')

    const groups = useFirestore("Groups")
    const channels = useFirestore("Channels")
    const impacteers = useFirestore('Impacteers')
    const admins = useFirestore('Admins')
    const projects = useFirestore('Projects')
    const projectManagers = useFirestore('ProjectManagers')
    const compagny = useFirestore("CompagnyMeta")

    useEffect(() => {
        compagny && compagny.forEach(comp => {
            setDisplayWelcome(comp.Welcome)
            setDisplayProjectManagement(comp.ProjectManagement)
            setDisplayImpact(comp.Impact)
            setDisplayChannels(comp.Channels)
            setDisplayGroups(comp.Groups)
            setDisplayMatches(comp.Matches)
        })
    },[compagny])

    useEffect(() => {
        impacteers && impacteers.forEach(impacteer => {
            if(impacteer.UserID === authO.ID){
                setImpacteer('block')
            }
        })
    }, [impacteers])

    useEffect(() => {
        projectManagers && projectManagers.forEach(manager => {
            if(manager.UserID === authO.ID){
                setprojectManager('block')
            }
        })
    }, [projectManagers])

    useEffect(() => {
        admins && admins.forEach(admin => {
            if(admin.UserID === authO.ID){
                setImpacteer('block')
            }
        })
    }, [admins])

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
        <div className="left-sidebar-container">
            <div className="left-side-bar">
                <div className="channel-div" style={{display: showWelcome()}}>
                    <h3>Welkom</h3>
                    <div className="channel-inner-div">
                        <NavLink activeClassName='active' to={`/${client}/Start`} >Start hier</NavLink>
                        <NavLink activeClassName='active' to={`/${client}/Introductions`} >Stel je voor</NavLink>
                        <NavLink activeClassName='active' to={`/${client}/AllActivity`} >Alle activiteit</NavLink>
                    </div>
                </div>
                <div className="channel-div" style={{display: showChannels()}}>
                    <div className="nav-title-container">
                        <h3>Kanalen</h3>
                    </div>
                    {channels && channels.map(channel => (
                        <div className="channel-inner-div" key={channel.ID}>
                            <NavLink activeClassName='active' to={`/${client}/${channel.Link}/${channel.ID}`}>{channel.Name}</NavLink>
                        </div>
                    ))}
                </div>
                <div className="channel-div" style={{display: showGroups()}}>
                    <div className="nav-title-container">
                        <h3>Groepen</h3>
                    </div>
                    {groups && groups.map(group => (
                        <div className="channel-inner-div" key={group.ID}>
                            <NavLink activeClassName='active' to={`/${client}/GroupLanding/${group.ID}`}>{group.Room}</NavLink>
                        </div>
                    ))}
                </div>
                <div className="channel-div" style={{display: showProjectManagement()}}>
                    <div className="nav-title-container">
                        <h3>Projectbeheer</h3>
                    </div>
                    {projects && projects.map(project => (
                        <div className="channel-inner-div">
                            <NavLink activeClassName='active' to={`/${client}/Project/${project.ID}`}>{project.Title}</NavLink>
                        </div>
                    ))}
                </div>
                <div className="channel-div" style={{display: showMatches()}}>
                    <div className="nav-title-container">
                        <h3>Matching</h3>
                    </div>
                    <div className="channel-inner-div">
                        <NavLink activeClassName='active' to={`/${client}/MatchItems`}>Match items</NavLink>
                    </div>
                    <div className="channel-inner-div">
                        <NavLink activeClassName='active' to={`/${client}/Matches`}>Matches</NavLink>
                    </div>
                </div>
                <div className="channel-div" style={{display: showImpact()}}>
                    <div className="nav-title-container">
                        <h3>Impact</h3>
                    </div>
                    <div className="channel-inner-div">
                        <NavLink activeClassName='active' to={`/${client}/ImpactProgress`}>Dashboard</NavLink>
                    </div>
                    {/* <div className="channel-inner-div">
                        <NavLink activeClassName='active' to={`/${client}/Activities`}>Mijlpalen</NavLink>
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default LeftSideBar
