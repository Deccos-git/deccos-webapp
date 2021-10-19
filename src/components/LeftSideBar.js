import '../CSS/leftSideBar.css';
import { NavLink, Link } from "react-router-dom";
import { client } from '../hooks/Client';
import { useFirestore } from '../firebase/useFirestore';


const LeftSideBar = () => {
    const groups = useFirestore("Groups")
    const channels = useFirestore("Channels")

    return (
        <div className="left-sidebar-container">
            <div className="left-side-bar">
                <div className="channel-div">
                    <h3>Welkom</h3>
                    <div className="channel-inner-div">
                        <NavLink activeClassName='active' to={`/${client}/Start`} >Start hier</NavLink>
                        <NavLink activeClassName='active' to={`/${client}/Introductions`} >Stel je voor</NavLink>
                        <NavLink activeClassName='active' to={`/${client}/AllActivity`} >Alle activiteit</NavLink>
                    </div>
                </div>
                <div className="channel-div">
                    <div className="nav-title-container">
                        <h3>Impact</h3>
                    </div>
                    <div className="channel-inner-div">
                        <NavLink activeClassName='active' to={`/${client}/Goals`}>Doelen</NavLink>
                    </div>
                    <div className="channel-inner-div">
                        <NavLink activeClassName='active' to={`/${client}/ImpactPath`}>Impactpad</NavLink>
                    </div>
                    <div className="channel-inner-div">
                        <NavLink activeClassName='active' to={`/${client}/Results`}>Resultaten</NavLink>
                    </div>
                </div>
                <div className="channel-div">
                    <div className="nav-title-container">
                        <h3>Kanalen</h3>
                    </div>
                    {channels && channels.map(channel => (
                        <div className="channel-inner-div" key={channel.ID}>
                            <NavLink activeClassName='active' to={`/${client}/${channel.Link}/${channel.ID}`}>{channel.Name}</NavLink>
                        </div>
                    ))}
                </div>
                <div className="channel-div">
                    <div className="nav-title-container">
                        <h3>Groepen</h3>
                    </div>
                    {groups && groups.map(group => (
                        <div className="channel-inner-div" key={group.ID}>
                            <NavLink activeClassName='active' to={`/${client}/GroupLanding/${group.ID}`}>{group.Room}</NavLink>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default LeftSideBar
