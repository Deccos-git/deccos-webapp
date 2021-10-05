import '../CSS/leftSideBar.css';
import { Link } from "react-router-dom";
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
                    <Link to={`/${client}/AllActivity`}>
                        <div className="back-to-community-container">
                            <img src={ArrowLeftIcon} alt="" />
                            <p>Community</p>
                        </div>
                    </Link>
                    <h3>Mijn profiel</h3>
                    <div className="channel-inner-div">
                        <Link to={`/${client}/PublicProfile/${authO.ID}`}>Mijn profiel</Link>
                    </div>
                    <h3>Mijn activiteit</h3>
                    <div className="channel-inner-div">
                        <Link to={`/${client}/MyIntroduction/${authO.ID}`}>Mijn introductie</Link>
                        <Link to={`/${client}/MyMessages/${authO.ID}`}>Mijn berichten</Link>
                        <Link to={`/${client}/MyGroups/${authO.ID}`}>Mijn groepen</Link>
                        <Link to={`/${client}/MyContributions/${authO.ID}`}>Mijn bijdragen</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LeftSideBarPublicProfile