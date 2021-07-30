import '../CSS/leftSideBar.css';
import { Link } from "react-router-dom";
import { client } from '../hooks/Client';
import ArrowLeftIcon from '../images/icons/arrow-left-icon.png'

const LeftSideBarPublicProfile = () => {
    return (
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
                    <Link to={`/${client}/PublicProfile`}>Mijn profiel</Link>
                </div>
                <h3>Mijn activiteit</h3>
                <div className="channel-inner-div">
                    <Link to={`/${client}/MyIntroduction`}>Mijn introductie</Link>
                    <Link to={`/${client}/MyMessages`}>Mijn berichten</Link>
                    <Link to={`/${client}/MyGroups`}>Mijn groepen</Link>
                    <Link to={`/${client}/MyContributions`}>Mijn bijdragen</Link>
                </div>
            </div>
        </div>
    )
}

export default LeftSideBarPublicProfile