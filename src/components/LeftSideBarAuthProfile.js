import '../CSS/leftSideBar.css';
import { NavLink } from "react-router-dom";
import { client } from '../hooks/Client';
import ArrowLeftIcon from '../images/icons/arrow-left-icon.png'
import { useContext, useEffect } from 'react';
import { Auth } from '../StateManagment/Auth';
import { useState } from 'react';
import { db } from '../firebase/config';
import {useFirestore} from "../firebase/useFirestore"
import HomeIcon from '../images/icons/home-icon.png'
import SettingsIcon from '../images/icons/settings-icon.png'
import GroupIcon from '../images/icons/group-icon.png'
import UserIcon from '../images/icons/user-icon.png'
import RoleIcon from '../images/icons/rol-icon.png'


const LeftSideBarAuthProfile = () => {
    const [authO] = useContext(Auth)
    const [showNotification, setShowNotification] = useState("")
    const [admin, setAdmin] = useState(false)
    const [notificationsUsers, setNotificationsUsers] = useState(0)
    const [notificationsGroups, setNotificationsGroups] = useState(0)

    const admins = useFirestore('Admins')

    useEffect(() => {
        admins && admins.forEach(admin => {
            if(admin.UserID === authO.ID){
                setAdmin(true)
            }
        })
    }, [admins])

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
                            <div className='activity-meta-title-container'>
                                <img src={SettingsIcon} alt="" />
                                <NavLink activeClassName='active' to={`/${client}/Settings`}>Algemeen</NavLink>
                            </div>
                            <div className='activity-meta-title-container'>
                                <img src={GroupIcon} alt="" />
                                <NavLink activeClassName='active' to={`/${client}/Members`}>Leden</NavLink>
                            </div>
                            <div className='activity-meta-title-container'>
                                <img src={RoleIcon} alt="" />
                                <NavLink activeClassName='active' to={`/${client}/UserRoles`}>Gebruikersrollen</NavLink>
                            </div>
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
                    <div className="channel-inner-div">
                        <h3>Home</h3>
                        <div className='activity-meta-title-container'>
                            <img src={HomeIcon} alt="" />
                            <NavLink activeClassName='active' to={`/${client}/ImpactProgress`}>Home</NavLink>
                        </div>
                    </div>
                    <Admin/>
                    <h3>Mijn account</h3>
                    <div className="channel-inner-div">
                    <div className='activity-meta-title-container'>
                            <img src={UserIcon} alt="" />
                            <NavLink activeClassName='active' to={`/${client}/Profile`}>Account instellingen</NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LeftSideBarAuthProfile
