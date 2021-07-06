import '../CSS/leftSideBar.css';
import { Link } from "react-router-dom";
import { client } from '../hooks/Client';

import plusIcon from '../images/icons/plus-icon.png'

const LeftSideBar = () => {
    return (
        <div className="left-side-bar">
            <div className="channel-div">
                <h3>Welkom</h3>
                <div className="channel-inner-div">
                    <Link to={`/${client}/Start`}>Start hier</Link>
                    <Link to={`/${client}/Introductions`}>Stel je voor</Link>
                </div>
            </div>
            <div className="channel-div">
                <h3>Impact</h3>
                <div className="channel-inner-div">
                    <Link to={`/${client}/Goals`}>Doelen</Link>
                </div>
            </div>
            <div className="channel-div">
                <h3>Kanalen</h3>
                <div className="channel-inner-div">
                    <Link to={`/${client}/AllActivity`}>Alle activiteit</Link>
                    <Link to={`/${client}/News`}>Nieuws</Link>
                    <Link to={`/${client}/KnowledgeCentre`}>Kenniscentrum</Link>
                    <Link to={`/${client}/Events`}>Events</Link>
                </div>
                <img className="plus-icon-sidebar" src={plusIcon} alt="" />

            </div>
            <div className="channel-div">
                <h3>Groepen</h3>
                <div className="channel-inner-div">
                    <Link to={`/${client}/Bestuur`}>Bestuur</Link>
                </div>
                <img className="plus-icon-sidebar" src={plusIcon} alt="" />
            </div>
        </div>
    )
}

export default LeftSideBar
