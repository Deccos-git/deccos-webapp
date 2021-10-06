import '../CSS/leftSideBar.css';
import { Link } from "react-router-dom";
import { client } from '../hooks/Client';
import ArrowLeftIcon from '../images/icons/arrow-left-icon.png'
import { useContext } from 'react';
import { Auth } from '../StateManagment/Auth';
import { useState } from 'react';
import { db } from '../firebase/config';

const LeftSideBarAuthProfile = () => {
    const [authO] = useContext(Auth)
    const [showNotification, setShowNotification] = useState("")


    const Superadmin = () => {
        if(authO.SuperAdmin){
            return <div>
                        <h3>Super Admin</h3>
                        <div className="channel-inner-div">
                            <Link to={`/${client}/NewClient`}>Nieuwe klant</Link>
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

    const Admin = () => {
        if(authO.Admin){
            return <div>
                        <h3>Community beheer</h3>
                        <div className="channel-inner-div">
                            <Link to={`/${client}/Settings`}>Bedrijfsinstellingen</Link>
                            <Link to={`/${client}/Analytics`}>Analytics</Link>
                            <Link to={`/${client}/ProfileSettings`}>Profielen</Link>
                            <Link to={`/${client}/Members`}>Leden</Link>
                            <Link to={`/${client}/UserRoles`}>Gebruikersrollen</Link>
                            <div className="notification-sidebar-container">
                                <Link to={`/${client}/Registrations`}>Aanmeldingen</Link>
                                <p style={{display: showNotification}} className="notification-counter-small"></p>
                            </div>
                            <Link to={`/${client}/ChannelSettings`}>Kanalen</Link>
                            <Link to={`/${client}/GroupSettings`}>Groepen</Link>
                            <Link to={`/${client}/GoalSettings`}>Doelen</Link>
                            <Link to={`/${client}/WelcomeSettings`}>Welkom</Link>
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
                    <Link to={`/${client}/AllActivity`}>
                        <div className="back-to-community-container">
                            <img src={ArrowLeftIcon} alt="" />
                            <p>Community</p>
                        </div>
                    </Link>
                <Superadmin/>
                    <Admin/>
                    <h3>Mijn account</h3>
                    <div className="channel-inner-div">
                        <Link to={`/${client}/Profile`}>Account instellingen</Link>
                        <Link to={`/${client}/PublicProfile/${authO.ID}`}>Openbaar profiel</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LeftSideBarAuthProfile
