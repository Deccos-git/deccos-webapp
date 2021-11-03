import '../CSS/leftSideBar.css';
import { NavLink } from "react-router-dom";
import { client } from '../hooks/Client';
import ArrowLeftIcon from '../images/icons/arrow-left-icon.png'
import { Auth } from '../StateManagment/Auth';
import { useContext, useState } from 'react';

const LeftSideBarPublicProfile = () => {
    const [authO] = useContext(Auth)
    const [showNotification, setShowNotification] = useState("")

    return (
        <div className="left-sidebar-container">
            <div className="left-side-bar">
                <div className="channel-div">
                    <NavLink activeClassName='active' to={`/${client}/AllActivity`}>
                        <div className="back-to-community-container">
                            <img src={ArrowLeftIcon} alt="" />
                            <p>Community</p>
                        </div>
                    </NavLink>
                    <h3>Mijn profiel</h3>
                    <div className="channel-inner-div">
                        <NavLink activeClassName='active' to={`/${client}/PublicProfile/${authO.ID}`}>Mijn profiel</NavLink>
                    </div>
                    <h3>Mijn activiteit</h3>
                    <div className="channel-inner-div">
                        <NavLink activeClassName='active' to={`/${client}/MyIntroduction/${authO.ID}`}>Mijn introductie</NavLink>
                        <NavLink activeClassName='active' to={`/${client}/MyMessages/${authO.ID}`}>Mijn berichten</NavLink>
                        <NavLink activeClassName='active' to={`/${client}/MyGroups/${authO.ID}`}>Mijn groepen</NavLink>
                        <NavLink activeClassName='active' to={`/${client}/MyChannels/${authO.ID}`}>Mijn kanalen</NavLink>
                        <NavLink activeClassName='active' to={`/${client}/MyContributions/${authO.ID}`}>Mijn likes</NavLink>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LeftSideBarPublicProfile