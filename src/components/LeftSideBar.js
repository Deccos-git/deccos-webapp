import '../CSS/leftSideBar.css';
import { Link } from "react-router-dom";
import { client } from '../hooks/Client';
import { useFirestore } from '../firebase/useFirestore';
import { db } from '../firebase/config';

const LeftSideBar = () => {

    const compagnies = useFirestore("CompagnyMeta")
    const groups = useFirestore("Groups")
    const routes = useFirestore("Route")

    const updateChannelRoute = (e) => {

        const id = e.target.name

        routes && routes.forEach(route => {
            const docRef = db.collection("Route")
            .doc(route.docid)
            docRef.update({
                Channel: id,
                Route: id
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
                Route: id
            })
        })
    }

    return (
        <div className="left-side-bar">
            <div className="channel-div">
                <h3>Welkom</h3>
                <div className="channel-inner-div">
                    <Link to={`/${client}/Start`} >Start hier</Link>
                    <Link to={`/${client}/Introductions`} >Stel je voor</Link>
                </div>
            </div>
            <div className="channel-div">
                <h3>Impact</h3>
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
                {compagnies && compagnies.map(compagny => (
                    <div className="channel-inner-div">
                        {compagny.Channels && compagny.Channels.map(channel =>(
                        <Link to={`/${client}/${channel.Link}`} key={channel.ID} name={channel.ID} onClick={updateChannelRoute}>{channel.Name}</Link>
                        ))}
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
    )
}

export default LeftSideBar
