import '../CSS/leftSideBar.css';
import { Link } from "react-router-dom";
import { client } from '../hooks/Client';
import ArrowLeftIcon from '../images/icons/arrow-left-icon.png'

const LeftSideBarAuthProfile = () => {
    return (
        <div className="left-side-bar">
            <div className="channel-div">
                <Link to={`/${client}/AllActivity`}>
                    <div className="back-to-community-container">
                        <img src={ArrowLeftIcon} alt="" />
                        <p>Community</p>
                    </div>
                </Link>
                <h3>Super Admin</h3>
                <div className="channel-inner-div">
                    <Link to={`/${client}/NewClient`}>Nieuwe klant</Link>
                </div>
                <h3>Community beheer</h3>
                <div className="channel-inner-div">
                    <Link to={`/${client}/Settings`}>Settings</Link>
                    <Link to={`/${client}/Analytics`}>Analytics</Link>
                    <Link to={`/${client}/Members`}>Leden</Link>
                </div>
            </div>
        </div>
    )
}

export default LeftSideBarAuthProfile
