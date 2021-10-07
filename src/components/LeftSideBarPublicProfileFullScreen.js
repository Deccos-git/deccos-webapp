import '../CSS/leftSideBar.css';
import { Link } from "react-router-dom";
import { client } from '../hooks/Client';
import ArrowLeftIcon from '../images/icons/arrow-left-icon.png'
import { Auth } from '../StateManagment/Auth';
import { useContext, useState } from 'react';
import { MobileMenu } from '../StateManagment/MobileMenu';

const LeftSideBarPublicProfileFullScreen = () => {
    const [authO] = useContext(Auth)
    const [menu, setMenu] = useContext(MobileMenu)

    const changeMenuStatus = () => {
        setMenu("none")
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
                    <h3>Mijn profiel</h3>
                    <div className="channel-inner-div">
                        <Link to={`/${client}/PublicProfile/${authO.ID}`} onClick={changeMenuStatus}>Mijn profiel</Link>
                    </div>
                    <h3>Mijn activiteit</h3>
                    <div className="channel-inner-div">
                        <Link to={`/${client}/MyIntroduction/${authO.ID}`} onClick={changeMenuStatus}>Mijn introductie</Link>
                        <Link to={`/${client}/MyMessages/${authO.ID}`} onClick={changeMenuStatus}>Mijn berichten</Link>
                        <Link to={`/${client}/MyGroups/${authO.ID}`} onClick={changeMenuStatus}>Mijn groepen</Link>
                        <Link to={`/${client}/MyContributions/${authO.ID}`} onClick={changeMenuStatus}>Mijn bijdragen</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LeftSideBarPublicProfileFullScreen