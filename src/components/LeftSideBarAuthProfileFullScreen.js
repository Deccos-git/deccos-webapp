import '../CSS/leftSideBar.css';
import { Link } from "react-router-dom";
import { client } from '../hooks/Client';
import ArrowLeftIcon from '../images/icons/arrow-left-icon.png'
import { useContext } from 'react';
import { Auth } from '../StateManagment/Auth';
import { useState } from 'react';
import { db } from '../firebase/config';
import { MobileMenu } from '../StateManagment/MobileMenu';

const LeftSideBarAuthProfile = () => {
    const [authO] = useContext(Auth)
    const [showNotification, setShowNotification] = useState("")
    const [menu, setMenu] = useContext(MobileMenu)

    const Superadmin = () => {
        if(authO.SuperAdmin){
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
        .where("Compagny", "==", client)
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
        if(authO.Admin){
            return <div>
                        <h3>Community beheer</h3>
                        <div className="channel-inner-div">
                            <Link to={`/${client}/Settings`} onClick={changeMenuStatus}>Instellingen</Link>
                            <Link to={`/${client}/Analytics`} onClick={changeMenuStatus}>Analytics</Link>
                            <Link to={`/${client}/Members`} onClick={changeMenuStatus}>Leden</Link>
                            <Link to={`/${client}/UserRoles`} onClick={changeMenuStatus}>Gebruikersrollen</Link>
                            <div className="notification-sidebar-container">
                                <Link to={`/${client}/Registrations`} onClick={changeMenuStatus}>Aanmeldingen</Link>
                                <p style={{display: showNotification}} className="notification-counter-small"></p>
                            </div>
                            <Link to={`/${client}/ChannelSettings`} onClick={changeMenuStatus}>Kanalen</Link>
                            <Link to={`/${client}/GroupSettings`} onClick={changeMenuStatus}>Groepen</Link>
                            <Link to={`/${client}/GoalSettings`} onClick={changeMenuStatus}>Doelen</Link>
                            <Link to={`/${client}/WelcomeSettings`} onClick={changeMenuStatus}>Welkom</Link>
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
                    <h3>Mijn account</h3>
                    <div className="channel-inner-div">
                        <Link to={`/${client}/Profile`} onClick={changeMenuStatus}>Account instellingen</Link>
                        <Link to={`/${client}/PublicProfile/${authO.ID}`} onClick={changeMenuStatus}>Openbaar profiel</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LeftSideBarAuthProfile
