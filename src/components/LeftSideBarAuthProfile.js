import '../CSS/leftSideBar.css';
import { NavLink } from "react-router-dom";
import { client } from '../hooks/Client';
import ArrowLeftIcon from '../images/icons/arrow-left-icon.png'
import { useContext, useEffect } from 'react';
import { Auth } from '../StateManagment/Auth';
import { useState } from 'react';
import { db } from '../firebase/config';
import {useFirestore} from "../firebase/useFirestore"


const LeftSideBarAuthProfile = () => {
    const [authO] = useContext(Auth)
    const [showNotification, setShowNotification] = useState("")
    const [admin, setAdmin] = useState(false)
    const [author, setAuthor] = useState(false)
    const [impacteer, setImpacteer] = useState(false)
    const [projectManager, setprojectManager] = useState(false)
    const [communityManager, setCommunityManager] = useState(false)
    const [matcher, setMatcher] = useState(false)
    const [superAdmin, setSuperAdmin] = useState(false)
    const [notificationsUsers, setNotificationsUsers] = useState(0)
    const [notificationsGroups, setNotificationsGroups] = useState(0)
    const [displayWelcome, setDisplayWelcome] = useState('')
    const [displayImpact, setDisplayImpact] = useState('')
    const [displayChannels, setDisplayChannels] = useState('')
    const [displayGroups, setDisplayGroups] = useState('')
    const [displayMatches, setDisplayMatches] = useState('')
    const [displayProjectManagement, setDisplayProjectManagement] = useState('')

    const admins = useFirestore('Admins')
    const authors = useFirestore('Authors')
    const impacteers = useFirestore('Impacteers')
    const channels = useFirestore("Channels")
    const groupChannels = useFirestore("GroupChannels")
    const compagny = useFirestore("CompagnyMeta")
    const projectManagers = useFirestore('ProjectManagers')
    const communityManagers = useFirestore('CommunityManagers')
    const matchers = useFirestore('Matchers')

    useEffect(() => {
        compagny && compagny.forEach(comp => {
            setDisplayWelcome(comp.Welcome)
            setDisplayImpact(comp.Impact)
            setDisplayChannels(comp.Channels)
            setDisplayGroups(comp.Groups)
            setDisplayMatches(comp.Matches)
            setDisplayProjectManagement(comp.ProjectManagement)
        })
    },[compagny])

    useEffect(() => {
        admins && admins.forEach(admin => {
            if(admin.UserID === authO.ID){
                setAdmin(true)
            }
        })
    }, [admins])

    useEffect(() => {
        authors && authors.forEach(author => {
            if(author.UserID === authO.ID){
                setAuthor(true)
            }
        })
    }, [authors])

    useEffect(() => {
        communityManagers && communityManagers.forEach(communityManager => {
            if(communityManager.UserID === authO.ID){
                setCommunityManager(true)
            }
        })
    }, [communityManagers])

    useEffect(() => {
        projectManagers && projectManagers.forEach(manager => {
            if(manager.UserID === authO.ID){
                setprojectManager('block')
            }
        })
    }, [projectManagers])

    useEffect(() => {
        impacteers && impacteers.forEach(impacteer => {
            if(impacteer.UserID === authO.ID){
                setImpacteer(true)
            }
        })
    }, [impacteers])

    useEffect(() => {
        matchers && matchers.forEach(matcher => {
            if(matcher.UserID === authO.ID){
                console.log('true')
                setMatcher(true)
            }
        })
    }, [matchers])

    useEffect(() => {
            if(authO.ID === '6a8bf-08c3-a1ad-d04d-231ebe51dc60'){
                setSuperAdmin(true)
            }
    }, [admins])

    const showImpact = () => {
        if(displayImpact === true && admin === true && impacteer === true){
            return 'block'
        } else if (displayImpact === true && admin === true && impacteer === false){
            return 'block'
        } else if (displayImpact === true && admin === false && impacteer === false){
            return 'none'
        } else if (displayImpact === false && admin === false && impacteer === false){
            return 'none'
        } else if (displayImpact === false && admin === true && impacteer === true){
            return 'none'
        } else if (displayImpact === false && admin === true && impacteer === false){
            return 'none'
        } else if (displayImpact === false && admin === false && impacteer === true){
            return 'none'
        }
    }

    const showGroups = () => {
        if(displayGroups === true){
            return 'block'
        } else if (displayGroups === false){
            return 'none'
        }
    }

    const showChannels = () => {
        if(displayChannels === true){
            return 'block'
        } else if (displayChannels === false){
            return 'none'
        }
    }

    const showWelcome = () => {
        if(displayWelcome === true){
            return 'block'
        } else if (displayWelcome === false){
            return 'none'
        }
    }

    const showCommunity = () => {
        if(displayWelcome === true || displayChannels === true || displayGroups === true){
            return 'block'
        } else if (displayWelcome === false  && displayChannels === false && displayGroups === false){
            return 'none'
        }
    }

    const showProjectManagement = () => {
        if(displayProjectManagement === true  && projectManager === 'block'){
            return 'block'
        } else if (displayProjectManagement === false  && projectManager=== 'block') {
            return 'none'
        } else if (displayProjectManagement === false  && projectManager === 'none') {
            return 'none'
        } else if (displayProjectManagement === false  && projectManager === false) {
            return 'none'
        }
    }

    const showMatching = () => {
        if(displayMatches === true){
            return 'block'
        } else if (displayMatches === false){
            return 'none'
        }
    }

    const Superadmin = () => {
        if(superAdmin){
            return <div>
                        <h3>Super Admin</h3>
                        <div className="channel-inner-div">
                            <NavLink to={`/${client}/NewClient`}>Nieuwe klant</NavLink>
                        </div>
                    </div>
        } else {
            return null
        }
    }

    let notificationsTotal = notificationsUsers + notificationsGroups

    useEffect(() => {
        const toggleNotofication = () => {
            if(notificationsTotal > 0){
                setShowNotification("flex")
            } else if (notificationsTotal === 0){
                setShowNotification("none")
            }
        }
        toggleNotofication()
    }, [])

    const numberOfNotificationsUsers = async () => {

        let notifications = null

        await db.collection("Users")
        .where("Compagny", "array-contains", client)
        .where("Approved", "==", false)
        .get()
        .then(querySnapshot => {
            notifications = querySnapshot.docs.length
        })

        return notifications
    }

    useEffect(() => {
        numberOfNotificationsUsers().then((number) => {
            setNotificationsUsers(number)
        })
    }, [])

    const numberOfNotificationsGroups = async () => {

        let notifications = null

        await db.collection("Subscriptions")
        .where("Compagny", "==", client)
        .where("Approved", "==", false)
        .get()
        .then(querySnapshot => {
            notifications = querySnapshot.docs.length
        })

        return notifications
    }

    useEffect(() => {
        numberOfNotificationsGroups().then((number) => {
            // setNotificationsUsers(notificationsUsers + number)
        })
    }, [])

    const Admin = () => {
        if(admin){
            return <div>
                        <h3>Admin</h3>
                        <div className="channel-inner-div">
                            <NavLink activeClassName='active' to={`/${client}/Settings`}>Algemeen</NavLink>
                            <NavLink activeClassName='active' to={`/${client}/Analytics`}>Analytics</NavLink>
                            <NavLink activeClassName='active' to={`/${client}/ProfileSettings`}>Profielen</NavLink>
                            <NavLink activeClassName='active' to={`/${client}/Members`}>Leden</NavLink>
                            <NavLink activeClassName='active' to={`/${client}/UserRoles`}>Gebruikersrollen</NavLink>
                            <div className="notification-sidebar-container">
                                <NavLink activeClassName='active' to={`/${client}/Registrations`}>Aanmeldingen</NavLink>
                                <p style={{display: showNotification}} className="notification-counter-small">{notificationsUsers}</p>
                            </div>
                        </div>
                    </div>
        } else {
            return null
        }
    }

    const CommunityManagers = () => {
        if(communityManager || admin){
            return <div>
                        <h3 style={{display: showCommunity()}}>Community</h3>
                        <div className="channel-inner-div">
                            <NavLink activeClassName='active' to={`/${client}/ChannelSettings`} style={{display: showChannels()}}>Kanalen</NavLink>
                            <NavLink activeClassName='active' to={`/${client}/GroupSettings`} style={{display: showGroups()}}>Groepen</NavLink>
                            <NavLink activeClassName='active' to={`/${client}/WelcomeSettings`} style={{display: showWelcome()}}>Welkom</NavLink>
                        </div>
                    </div>
            } else {
            return null
            }
        }

    const Projectmanagement = () => {
        if(projectManager || admin){
            return <div style={{display: showProjectManagement()}}>
                        <h3>Projectbeheer</h3>
                        <div className="channel-inner-div">
                            <NavLink activeClassName='active' to={`/${client}/TaskSettings`}>Taken</NavLink>
                        </div>
                    </div>
        } else {
            return null
        }  
    }

    const Matching = () => {
        if(matcher || admin){
            return <div style={{display: showMatching()}}>
                        <h3>Matching</h3>
                        <div className="channel-inner-div">
                            <NavLink activeClassName='active' to={`/${client}/AddMatchItem`}>Match items</NavLink>
                            <NavLink activeClassName='active' to={`/${client}/MatchCategories`}>Categorien en tags</NavLink>
                            <NavLink activeClassName='active' to={`/${client}/MatchProfileFields`}>Profielvelden</NavLink>
                            <NavLink activeClassName='active' to={`/${client}/RoadMap`}>Stappenplan</NavLink>
                        </div>
                    </div>
        } else {
            return null
        }
    }

    const Impact = () => {
        if(impacteer || admin){
            return <div style={{display: showImpact()}}>
                    <h3>Impact</h3>
                    <div className="channel-inner-div">
                        <NavLink activeClassName='active' to={`/${client}/GoalSettings`}>Doelen</NavLink>
                        <NavLink activeClassName='active' to={`/${client}/ActivitySettings`}>Activiteiten</NavLink>
                        <NavLink activeClassName='active' to={`/${client}/Output`}>Resultaten</NavLink>
                        <NavLink activeClassName='active' to={`/${client}/QuestionnaireSettings`}>Vragenlijsten</NavLink>
                        <NavLink activeClassName='active' to={`/${client}/Stakeholders`}>Stakeholders</NavLink>
                        <NavLink activeClassName='active' to={`/${client}/Impacthub`}>Impacthub</NavLink>
                    </div>
                </div>
        } else {
            return null
        } 
    }

    const MyActivity = () => {
        return  <div>
                    <h3>Mijn activiteiten</h3>
                    <div className="channel-inner-div">
                        <NavLink activeClassName='active' to={`/${client}/MyMessages/${authO.ID}`}>Mijn berichten</NavLink>
                        <NavLink activeClassName='active' to={`/${client}/Likes/${authO.ID}`}>Mijn likes</NavLink>
                        <NavLink activeClassName='active' to={`/${client}/MyEvents/${authO.ID}`}>Mijn events</NavLink>
                    </div>
                </div>
    }

    return (
        <div className="left-side-bar-container">
            <div className="left-side-bar">
                <div className="channel-div">
                    <NavLink activeClassName='active' to={`/${client}/AllActivity`}>
                        <div className="back-to-community-container">
                            <img src={ArrowLeftIcon} alt="" />
                            <p>Home</p>
                        </div>
                    </NavLink>
                <Superadmin/>
                    <Admin/>
                    <CommunityManagers/>
                    <Projectmanagement/>
                    <Matching/>
                    <Impact/>
                    <h3>Mijn account</h3>
                    <div className="channel-inner-div">
                        <NavLink activeClassName='active' to={`/${client}/Profile`}>Account instellingen</NavLink>
                        <NavLink activeClassName='active' to={`/${client}/AboutMe/${authO.ID}`}>Over mij</NavLink>
                        <NavLink activeClassName='active' to={`/${client}/Subscriptions/${authO.ID}`}>Lidmaatschappen en abonnementen</NavLink>
                        <NavLink activeClassName='active' to={`/${client}/PublicProfile/${authO.ID}`}>Openbaar profiel</NavLink>
                    </div>
                    <MyActivity/>
                </div>
            </div>
        </div>
    )
}

export default LeftSideBarAuthProfile
