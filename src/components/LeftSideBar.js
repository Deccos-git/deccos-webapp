import '../CSS/leftSideBar.css';
import { Link } from "react-router-dom";
import { client } from '../hooks/Client';
import plusIcon from '../images/icons/plus-icon.png'
import settingsIcon from '../images/icons/settings-icon.png'
import { useFirestore } from '../firebase/useFirestore';

const LeftSideBar = () => {

    const compagnies = useFirestore("CompagnyMeta")

    compagnies && compagnies.forEach(compagny => {
        compagny.Channels.forEach(channel => {
            console.log(channel.Link)
        })
    })

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
                        <Link to={`/${client}/${channel.Link}`} key={channel.ID}>{channel.Name}</Link>
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
                <div className="channel-inner-div">
                    <Link to={`/${client}/Group`}>Bestuur</Link>
                </div>
            </div>
        </div>
    )
}

export default LeftSideBar
