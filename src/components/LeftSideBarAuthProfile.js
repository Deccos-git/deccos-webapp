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
                            <NavLink activeClassName='active' to={`/${client}/Settings`}>Algemeen</NavLink>
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
                    <Admin/>
                    <h3>Mijn account</h3>
                    <div className="channel-inner-div">
                        <NavLink activeClassName='active' to={`/${client}/Profile`}>Account instellingen</NavLink>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LeftSideBarAuthProfile
