import '../CSS/leftSideBar.css';
import { Link } from "react-router-dom";
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
                        <div className="channel-inner-div" key={channel.ID}>
                            <Link to={`/${client}/${channel.Link}/${channel.ID}`}>{channel.Name}</Link>
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
                        <div className="channel-inner-div" key={group.ID}>
                            <Link to={`/${client}/GroupLanding/${group.ID}`}>{group.Room}</Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default LeftSideBar
