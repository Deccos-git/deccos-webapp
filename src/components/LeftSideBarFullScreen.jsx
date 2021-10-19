import '../CSS/leftSideBar.css';
import { Link } from "react-router-dom";
import { client } from '../hooks/Client';
import { useFirestore } from '../firebase/useFirestore';
import { MobileMenu } from '../StateManagment/MobileMenu';
import { useContext } from 'react';
import { motion } from "framer-motion"

const LeftSideBarFullScreen = () => {
    const [menu, setMenu] = useContext(MobileMenu)

    const groups = useFirestore("Groups")
    const channels = useFirestore("Channels")

    const changeMenuStatus = () => {
        setMenu("none")
    }

    return (
        <div 
        className="left-sidebar-container-mobile" 
        style={{display: menu}}>
            <div className="left-side-bar-full-screen">
                <div className="channel-div">
                    <h3>Welkom</h3>
                    <div className="channel-inner-div">
                        <Link to={`/${client}/Start`} onClick={changeMenuStatus} >Start hier</Link>
                        <Link to={`/${client}/Introductions`} onClick={changeMenuStatus} >Stel je voor</Link>
                        <Link to={`/${client}/AllActivity`} onClick={changeMenuStatus} >Alle activiteit</Link>
                    </div>
                </div>
                <div className="channel-div">
                    <div className="nav-title-container">
                        <h3>Impact</h3>
                    </div>
                    <div className="channel-inner-div">
                        <Link to={`/${client}/Goals`} onClick={changeMenuStatus}>Doelen</Link>
                    </div>
                    <div className="channel-inner-div">
                        <Link to={`/${client}/ImpactPath`} onClick={changeMenuStatus}>ImpactPath</Link>
                    </div>
                    <div className="channel-inner-div">
                        <Link to={`/${client}/Results`} onClick={changeMenuStatus}>Resultaten</Link>
                    </div>
                </div>
                <div className="channel-div">
                    <div className="nav-title-container">
                        <h3>Kanalen</h3>
                    </div>
                    {channels && channels.map(channel => (
                        <div className="channel-inner-div"  key={channel.ID}>
                            <Link to={`/${client}/${channel.Link}/${channel.ID}`} onClick={changeMenuStatus}>{channel.Name}</Link>
                        </div>
                    ))}
                </div>
                <div className="channel-div">
                    <div className="nav-title-container">
                        <h3>Groepen</h3>
                    </div>
                    {groups && groups.map(group => (
                        <div className="channel-inner-div" key={group.ID}>
                            <Link to={`/${client}/GroupLanding/${group.ID}`} onClick={changeMenuStatus}>{group.Room}</Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default LeftSideBarFullScreen
