import '../CSS/leftSideBar.css';
import { NavLink } from "react-router-dom";
import { client } from '../hooks/Client';
import ArrowLeftIcon from '../images/icons/arrow-left-icon.png'
import { useContext, useEffect } from 'react';
import { Auth } from '../StateManagment/Auth';
import { useState } from 'react';
import { db } from '../firebase/config';
import {useFirestore} from "../firebase/useFirestore"
import GroupChannel from './GroupChannel';

const LeftSideBarAuthProfile = () => {
    const [authO] = useContext(Auth)
    const [showNotification, setShowNotification] = useState("")
    const [admin, setAdmin] = useState(false)
    const [author, setAuthor] = useState(false)
    const [impacteer, setImpacteer] = useState(false)
    const [superAdmin, setSuperAdmin] = useState(false)
    const [notificationsUsers, setNotificationsUsers] = useState(0)
    const [notificationsGroups, setNotificationsGroups] = useState(0)
    const [displayWelcome, setDisplayWelcome] = useState('')
    const [displayImpact, setDisplayImpact] = useState('')
    const [displayChannels, setDisplayChannels] = useState('')
    const [displayGroups, setDisplayGroups] = useState('')

    const admins = useFirestore('Admins')
    const authors = useFirestore('Authors')
    const impacteers = useFirestore('Impacteers')
    const channels = useFirestore("Channels")
    const groupChannels = useFirestore("GroupChannels")
    const compagny = useFirestore("CompagnyMeta")

    useEffect(() => {
        compagny && compagny.forEach(comp => {
            setDisplayWelcome(comp.Welcome)
            setDisplayImpact(comp.Impact)
            setDisplayChannels(comp.Channels)
            setDisplayGroups(comp.Groups)
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
        impacteers && impacteers.forEach(impacteer => {
            if(impacteer.UserID === authO.ID){
                setImpacteer(true)
            }
        })
    }, [impacteers])

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
                        <h3>Community</h3>
                        <div className="channel-inner-div">
                            <NavLink activeClassName='active' to={`/${client}/Settings`}>Algemeen</NavLink>
                            <NavLink activeClassName='active' to={`/${client}/Analytics`}>Analytics</NavLink>
                            <NavLink activeClassName='active' to={`/${client}/ProfileSettings`}>Profielen</NavLink>
                            <NavLink activeClassName='active' to={`/${client}/Members`}>Leden</NavLink>
                            <NavLink activeClassName='active' to={`/${client}/UserRoles`}>Gebruikersrollen</NavLink>
                            <div className="notification-sidebar-container">
                                <NavLink activeClassName='active' to={`/${client}/Registrations`}>Aanmelden</NavLink>
                                <p style={{display: showNotification}} className="notification-counter-small">{notificationsUsers}</p>
                            </div>
                            <NavLink activeClassName='active' to={`/${client}/ChannelSettings`} style={{display: showChannels()}}>Kanalen</NavLink>
                            <NavLink activeClassName='active' to={`/${client}/GroupSettings`} style={{display: showGroups()}}>Groepen</NavLink>
                            <NavLink activeClassName='active' to={`/${client}/WelcomeSettings`} style={{display: showWelcome()}}>Welkom</NavLink>
                        </div>
                    </div>
        } else {
            return null
        }
    }

    const Impact = () => {
        return <div style={{display: showImpact()}}>
                    <h3>Impact</h3>
                    <div className="channel-inner-div">
                        <NavLink activeClassName='active' to={`/${client}/GoalSettings`}>Doelen</NavLink>
                        <NavLink activeClassName='active' to={`/${client}/ActivitySettings`}>Activiteiten</NavLink>
                        <NavLink activeClassName='active' to={`/${client}/TaskSettings`}>Taken</NavLink>
                    </div>
                </div>
    }

    const channelList = (channel) => {
        if(channel.Link === 'Channel'){
            return  <div className="channel-inner-div" key={channel.ID}>
                        <NavLink activeClassName='active' to={`/${client}/AddChannelItem/${channel.ID}`}> Nieuw {channel.Name}</NavLink>
                    </div>
        }
    }

    const Author = () => {
        if(author || admin){
            return <div>
                        <h3>Toevoegen</h3>
                        <div className="channel-inner-div">
                            <NavLink activeClassName='active' to={`/${client}/AddArticle`}>Nieuw Artikel</NavLink>
                            <NavLink activeClassName='active' to={`/${client}/AddNews`}>Nieuw Nieuws</NavLink>
                            <NavLink activeClassName='active' to={`/${client}/AddEvent`}>Nieuw Event</NavLink>
                            {channels && channels.map(channel => (
                                channelList(channel)
                            ))}
                            {groupChannels && groupChannels.map(groupChannel => (
                                <NavLink activeClassName='active' key={groupChannels.ID} to={`/${client}/AddChannelItem/${groupChannel.ID}`}> Nieuw {groupChannel.Name}</NavLink>
                            ))}
                        </div>
                    </div>
        } else {
            return null
        }
    }

    const MyActivity = () => {
        return  <div>
                    <h3>Mijn activiteit</h3>
                    <div className="channel-inner-div">
                        <NavLink activeClassName='active' to={`/${client}/MyIntroduction/${authO.ID}`}>Mijn introductie</NavLink>
                        <NavLink activeClassName='active' to={`/${client}/MyMessages/${authO.ID}`}>Mijn berichten</NavLink>
                        <NavLink activeClassName='active' to={`/${client}/MyGroups/${authO.ID}`}>Mijn groepen</NavLink>
                        <NavLink activeClassName='active' to={`/${client}/MyChannels/${authO.ID}`}>Mijn kanalen</NavLink>
                        <NavLink activeClassName='active' to={`/${client}/Contributions/${authO.ID}`}>Mijn bijdragen</NavLink>
                        <NavLink activeClassName='active' to={`/${client}/Likes/${authO.ID}`}>Mijn likes</NavLink>
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
                            <p>Community</p>
                        </div>
                    </NavLink>
                <Superadmin/>
                    <Admin/>
                    <Impact/>
                    <Author/>
                    <h3>Mijn account</h3>
                    <div className="channel-inner-div">
                        <NavLink activeClassName='active' to={`/${client}/Profile`}>Account instellingen</NavLink>
                        <NavLink activeClassName='active' to={`/${client}/AboutMe/${authO.ID}`}>Over mij</NavLink>
                        <NavLink activeClassName='active' to={`/${client}/Subscriptions/${authO.ID}`}>Lidmaatschappen</NavLink>
                        <NavLink activeClassName='active' to={`/${client}/PublicProfile/${authO.ID}`}>Openbaar profiel</NavLink>
                    </div>
                    <MyActivity/>
                </div>
            </div>
        </div>
    )
}

export default LeftSideBarAuthProfile
