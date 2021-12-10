import '../CSS/leftSideBar.css';
import { Link } from "react-router-dom";
import { client } from '../hooks/Client';
import ArrowLeftIcon from '../images/icons/arrow-left-icon.png'
import { Auth } from '../StateManagment/Auth';
import { useState , useEffect, useContext} from 'react';
import { db } from '../firebase/config';
import { MobileMenu } from '../StateManagment/MobileMenu';
import { useFirestore, useFirestoreSubscriptionsNotApproved } from "../firebase/useFirestore"

const LeftSideBarAuthProfile = () => {
    const [authO] = useContext(Auth)
    const [showNotification, setShowNotification] = useState("")
    const [menu, setMenu] = useContext(MobileMenu)
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

    const notificationsTotal = notificationsUsers + notificationsGroups

    useEffect(() => {
        const toggleNotofication = () => {
            if(notificationsTotal > 0){
                console.log('block')
                setShowNotification("block")
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

    const changeMenuStatus = () => {
        setMenu("none")
    }

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

    const Admin = () => {
        if(admin){
            return <div>
                        <h3>Community</h3>
                        <div className="channel-inner-div">
                            <Link to={`/${client}/Settings`} onClick={changeMenuStatus}>Algemeen</Link>
                            <Link to={`/${client}/Analytics`} onClick={changeMenuStatus}>Analytics</Link>
                            <Link to={`/${client}/ProfileSettings`} onClick={changeMenuStatus}>Profielen</Link>
                            <Link to={`/${client}/Members`} onClick={changeMenuStatus}>Leden</Link>
                            <Link to={`/${client}/UserRoles`} onClick={changeMenuStatus}>Gebruikersrollen</Link>
                            <div className="notification-sidebar-container">
                                <Link to={`/${client}/Registrations`} onClick={changeMenuStatus}>Aanmelden</Link>
                                <p style={{display: showNotification}} className="notification-counter-small">{notificationsTotal}</p>
                            </div>
                            <Link to={`/${client}/ChannelSettings`} onClick={changeMenuStatus} style={{display: showChannels()}}>Kanalen</Link>
                            <Link to={`/${client}/GroupSettings`} onClick={changeMenuStatus} style={{display: showGroups()}}>Groepen</Link>
                            <Link to={`/${client}/WelcomeSettings`} onClick={changeMenuStatus} style={{display: showWelcome()}}>Welkom</Link>
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
                        <Link activeClassName='active' to={`/${client}/GoalSettings`}>Doelen</Link>
                        <Link activeClassName='active' to={`/${client}/ActivitySettings`}>Activiteiten</Link>
                        <Link activeClassName='active' to={`/${client}/TaskSettings`}>Taken</Link>
                    </div>
                </div>
    }

    const channelList = (channel) => {
        if(channel.Link === 'Channel'){
            return  <div className="channel-inner-div" key={channel.ID}>
                        <Link activeClassName='active' to={`/${client}/AddChannelItem/${channel.ID}`}> Nieuw {channel.Name}</Link>
                    </div>
        }
    }

    const Author = () => {
        if(author || admin){
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

    const MyActivity = () => {
        return  <div>
                    <h3>Mijn activiteiten</h3>
                    <div className="channel-inner-div">
                        <Link activeClassName='active' to={`/${client}/MyMessages/${authO.ID}`} onClick={changeMenuStatus}>Mijn berichten</Link>
                        <Link activeClassName='active' to={`/${client}/Contributions/${authO.ID}`} onClick={changeMenuStatus}>Mijn bijdragen</Link>
                        <Link activeClassName='active' to={`/${client}/Likes/${authO.ID}`} onClick={changeMenuStatus}>Mijn likes</Link>
                    </div>
                </div>
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
                    <Impact/>
                    <Author/>
                    <h3>Mijn account</h3>
                    <div className="channel-inner-div">
                        <Link to={`/${client}/Profile`} onClick={changeMenuStatus}>Account instellingen</Link>
                        <Link to={`/${client}/AboutMe/${authO.ID}`} onClick={changeMenuStatus}>Over mij</Link>
                        <Link to={`/${client}/Subscriptions/${authO.ID}`} onClick={changeMenuStatus}>Lidmaatschappen en abonnementen</Link>
                        <Link to={`/${client}/PublicProfile/${authO.ID}`} onClick={changeMenuStatus}>Openbaar profiel</Link>
                    </div>
                    <MyActivity/>
                </div>
            </div>
        </div>
    )
}

export default LeftSideBarAuthProfile
