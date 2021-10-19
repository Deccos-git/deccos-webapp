import '../CSS/leftSideBar.css';
import { NavLink } from "react-router-dom";
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
                            <NavLink to={`/${client}/NewClient`}>Nieuwe klant</NavLink>
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
                            <NavLink activeClassName='active' to={`/${client}/Settings`}>Bedrijfsinstellingen</NavLink>
                            <NavLink activeClassName='active' to={`/${client}/Analytics`}>Analytics</NavLink>
                            <NavLink activeClassName='active' to={`/${client}/ProfileSettings`}>Profielen</NavLink>
                            <NavLink activeClassName='active' to={`/${client}/Members`}>Leden</NavLink>
                            <NavLink activeClassName='active' to={`/${client}/UserRoles`}>Gebruikersrollen</NavLink>
                            <div className="notification-sidebar-container">
                                <NavLink activeClassName='active' to={`/${client}/Registrations`}>Aanmelden</NavLink>
                                <p style={{display: showNotification}} className="notification-counter-small"></p>
                            </div>
                            <NavLink activeClassName='active' to={`/${client}/ChannelSettings`}>Kanalen</NavLink>
                            <NavLink activeClassName='active' to={`/${client}/GroupSettings`}>Groepen</NavLink>
                            <NavLink activeClassName='active' to={`/${client}/GoalSettings`}>Doelen</NavLink>
                            <NavLink activeClassName='active' to={`/${client}/ImpactPathSettings`}>Impactpad</NavLink>
                            <NavLink activeClassName='active' to={`/${client}/WelcomeSettings`}>Welkom</NavLink>
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
                    <h3>Mijn account</h3>
                    <div className="channel-inner-div">
                        <NavLink activeClassName='active' to={`/${client}/Profile`}>Account instellingen</NavLink>
                        <NavLink activeClassName='active' to={`/${client}/AboutMe/${authO.ID}`}>Over mij</NavLink>
                        <NavLink activeClassName='active' to={`/${client}/PublicProfile/${authO.ID}`}>Openbaar profiel</NavLink>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LeftSideBarAuthProfile
