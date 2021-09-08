import '../CSS/leftSideBar.css';
import { Link } from "react-router-dom";
import { client } from '../hooks/Client';
import { useFirestore } from '../firebase/useFirestore';
import { db } from '../firebase/config';
import { useState } from 'react';
import menuIcon from '../images/icons/menu-icon.png'

const LeftSideBar = () => {
    const [sidebarToggle, setSidebarToggle] = useState("none")

    const compagnies = useFirestore("CompagnyMeta")
    const groups = useFirestore("Groups")
    const routes = useFirestore("Route")
    const channels = useFirestore("Channels")

    const updateChannelRoute = (e) => {

        const id = e.target.dataset.id
        const name = e.target.dataset.name

        routes && routes.forEach(route => {

            const docRef = db.collection("Route")
            .doc(route.docid)
            docRef.update({
                Channel: name,
                Route: id,
            })
        })
    }

    const updateGroupRoute = (e) => {

        const id = e.target.name

        routes && routes.forEach(route => {
            const docRef = db.collection("Route")
            .doc(route.docid)
            docRef.update({
                Group: id,
                Route: id,
                Channel: "Chat"
            })
        })
    }

    const toggleSideBar = () => {

        if(sidebarToggle === "none"){
            setSidebarToggle("block")
        } else {
            setSidebarToggle("none")
        }

    }

    console.log(sidebarToggle)

    return (
        <div className="left-sidebar-container">
            <div className="left-side-bar-toggle">
                <img src={menuIcon} alt="" onClick={toggleSideBar} />
            </div>
            <div className="left-side-bar" style={{display: sidebarToggle}}>
                <div className="channel-div">
                    <h3>Welkom</h3>
                    <div className="channel-inner-div">
                        <Link to={`/${client}/Start`} >Start hier</Link>
                        <Link to={`/${client}/Introductions`} >Stel je voor</Link>
                        <Link to={`/${client}/AllActivity`} >Alle activiteit</Link>
                    </div>
                </div>
                <div className="channel-div">
                    <div className="nav-title-container">
                        <Link to={`/${client}/GoalSettings`}>
                            <h3>Impact</h3>
                        </Link>
                    </div>
                    <div className="channel-inner-div">
                        <Link to={`/${client}/Goals`}>Doelen</Link>
                    </div>
                </div>
                <div className="channel-div">
                    <div className="nav-title-container">
                        <Link to={`/${client}/ChannelSettings`}>
                            <h3>Kanalen</h3>
                        </Link>
                    </div>
                    {channels && channels.map(channel => (
                        <div className="channel-inner-div">
                            <Link to={`/${client}/${channel.Link}`} key={channel.ID} data-name={channel.Name} data-id={channel.ID} onClick={updateChannelRoute}>{channel.Name}</Link>
                        </div>
                    ))}
                </div>
                <div className="channel-div">
                    <div className="nav-title-container">
                        <Link to={`/${client}/GroupSettings`}>
                            <h3>Groepen</h3>
                        </Link>
                    </div>
                    {groups && groups.map(group => (
                        <div className="channel-inner-div">
                            <Link to={`/${client}/GroupLanding`} key={group.ID} name={group.ID} onClick={updateGroupRoute}>{group.Room}</Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default LeftSideBar
