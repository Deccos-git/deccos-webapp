import '../CSS/leftSideBar.css';
import { Link } from "react-router-dom";
import { client } from '../hooks/Client';
import ArrowLeftIcon from '../images/icons/arrow-left-icon.png'
import { Auth } from '../StateManagment/Auth';
import { useState , useEffect, useContext} from 'react';
import { db } from '../firebase/config';
import { MobileMenu } from '../StateManagment/MobileMenu';
import {useFirestore} from "../firebase/useFirestore"

const LeftSideBarAuthProfile = () => {
    const [authO] = useContext(Auth)
    const [showNotification, setShowNotification] = useState("")
    const [menu, setMenu] = useContext(MobileMenu)
    const [admin, setAdmin] = useState(false)
    const [author, setAuthor] = useState(false)
    const [superAdmin, setSuperAdmin] = useState(false)

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
                            <Link to={`/${client}/NewClient`} onClick={changeMenuStatus}>Nieuwe klant</Link>
                        </div>
                    </div>
        } else {
            return null
        }
    }

    const toggleNotofication = () => {
        db.collection("Users")
        .where("Compagny", "array-contains", client)
        .where("Approved", "==", false)
        .get()
        .then(querySnapshot => {
            if(querySnapshot.docs.length > 0){
                setShowNotification("block")
            } else if (querySnapshot.docs.length === 0){
                setShowNotification("none")
            }
        })
    }

    toggleNotofication()

    const changeMenuStatus = () => {
        setMenu("none")
    }

    const Admin = () => {
        if(admin){
            return <div>
                        <h3>Community beheer</h3>
                        <div className="channel-inner-div">
                            <Link to={`/${client}/Settings`} onClick={changeMenuStatus}>Bedrijfsinstellingen</Link>
                            <Link to={`/${client}/Analytics`} onClick={changeMenuStatus}>Analytics</Link>
                            <Link to={`/${client}/ProfileSettings`} onClick={changeMenuStatus}>Profielen</Link>
                            <Link to={`/${client}/Members`} onClick={changeMenuStatus}>Leden</Link>
                            <Link to={`/${client}/UserRoles`} onClick={changeMenuStatus}>Gebruikersrollen</Link>
                            <div className="notification-sidebar-container">
                                <Link to={`/${client}/Registrations`} onClick={changeMenuStatus}>Aanmelden</Link>
                                <p style={{display: showNotification}} className="notification-counter-small"></p>
                            </div>
                            <Link to={`/${client}/ChannelSettings`} onClick={changeMenuStatus}>Kanalen</Link>
                            <Link to={`/${client}/GroupSettings`} onClick={changeMenuStatus}>Groepen</Link>
                            <Link to={`/${client}/GoalSettings`} onClick={changeMenuStatus}>Doelen</Link>
                            <Link to={`/${client}/ImpactPathSettings`} onClick={changeMenuStatus}>Impactpad</Link>
                            <Link to={`/${client}/WelcomeSettings`} onClick={changeMenuStatus}>Welkom</Link>
                        </div>
                    </div>
        } else {
            return null
        }
    }

    const channelList = (channel) => {
        if(channel.Link === 'Channel'){
            return  <div className="channel-inner-div" key={channel.ID}>
                        <Link activeClassName='active' to={`/${client}/AddChannelItem/${channel.ID}`}> Nieuw {channel.Name}</Link>
                    </div>
        }
    }

    const Author = () => {
        if(author){
            return <div>
                        <h3>Toevoegen</h3>
                        <div className="channel-inner-div">
                            <Link activeClassName='active' to={`/${client}/AddArticle`}>Nieuw Artikel</Link>
                            <Link activeClassName='active' to={`/${client}/AddNews`}>Nieuw Nieuws</Link>
                            <Link activeClassName='active' to={`/${client}/AddEvent`}>Nieuw Event</Link>
                            {channels && channels.map(channel => (
                                channelList(channel)
                            ))}
                            {groupChannels && groupChannels.map(groupChannel => (
                                <Link activeClassName='active' to={`/${client}/AddChannelItem/${groupChannel.ID}`}> Nieuw {groupChannel.Name}</Link>
                            ))}
                        </div>
                    </div>
        } else {
            return null
        }
    }

    return (
        <div className="left-sidebar-container-mobile" style={{display: menu}}>
            <div className="left-side-bar-full-screen">
                <div className="channel-div">
                    <Link to={`/${client}/AllActivity`} onClick={changeMenuStatus}>
                        <div className="back-to-community-container">
                            <img src={ArrowLeftIcon} alt="" />
                            <p>Community</p>
                        </div>
                    </Link>
                <Superadmin/>
                    <Admin/>
                    <Author/>
                    <h3>Mijn account</h3>
                    <div className="channel-inner-div">
                        <Link to={`/${client}/Profile`} onClick={changeMenuStatus}>Account instellingen</Link>
                        <Link to={`/${client}/AboutMe/${authO.ID}`} onClick={changeMenuStatus}>Over mij</Link>
                        <Link to={`/${client}/Subscriptions/${authO.ID}`} onClick={changeMenuStatus}>Lidmaatschappen</Link>
                        <Link to={`/${client}/PublicProfile/${authO.ID}`} onClick={changeMenuStatus}>Openbaar profiel</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LeftSideBarAuthProfile
