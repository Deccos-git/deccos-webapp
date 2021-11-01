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
    const [superAdmin, setSuperAdmin] = useState(false)
    const [notificationsUsers, setNotificationsUsers] = useState(0)
    const [notificationsGroups, setNotificationsGroups] = useState(0)

    const admins = useFirestore('Admins')
    const authors = useFirestore('Authors')
    const channels = useFirestore("Channels")
    const groupChannels = useFirestore("GroupChannels")

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
            if(authO.ID === '6a8bf-08c3-a1ad-d04d-231ebe51dc60'){
                setSuperAdmin(true)
            }
    }, [admins])


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
            setNotificationsGroups(number)
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
                                <p style={{display: showNotification}} className="notification-counter-small">{notificationsTotal}</p>
                            </div>
                            <NavLink activeClassName='active' to={`/${client}/ChannelSettings`}>Kanalen</NavLink>
                            <NavLink activeClassName='active' to={`/${client}/GroupSettings`}>Groepen</NavLink>
                            <NavLink activeClassName='active' to={`/${client}/WelcomeSettings`}>Welkom</NavLink>
                        </div>
                        <h3>Impact</h3>
                        <div className="channel-inner-div">
                            <NavLink activeClassName='active' to={`/${client}/GoalSettings`}>Doelen</NavLink>
                            <NavLink activeClassName='active' to={`/${client}/ImpactPathSettings`}>Impactpad</NavLink>
                        </div>
                    </div>
        } else {
            return null
        }
    }

    const channelList = (channel) => {
        if(channel.Link === 'Channel'){
            return  <div className="channel-inner-div" key={channel.ID}>
                        <NavLink activeClassName='active' to={`/${client}/AddChannelItem/${channel.ID}`}> Nieuw {channel.Name}</NavLink>
                    </div>
        }
    }

    const Author = () => {
        if(author){
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
                    <Author/>
                    <h3>Mijn account</h3>
                    <div className="channel-inner-div">
                        <NavLink activeClassName='active' to={`/${client}/Profile`}>Account instellingen</NavLink>
                        <NavLink activeClassName='active' to={`/${client}/AboutMe/${authO.ID}`}>Over mij</NavLink>
                        <NavLink activeClassName='active' to={`/${client}/Subscriptions/${authO.ID}`}>Lidmaatschappen</NavLink>
                        <NavLink activeClassName='active' to={`/${client}/PublicProfile/${authO.ID}`}>Openbaar profiel</NavLink>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LeftSideBarAuthProfile
