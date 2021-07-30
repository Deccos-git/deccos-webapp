import LeftSideBar from "./LeftSideBar";
import RightSideBar from "./rightSideBar/RightSideBar"
import { client } from '../hooks/Client';
import plusIcon from '../images/icons/plus-icon.png'
import { Link } from "react-router-dom";

const Channel = () => {

    return (
            <div className="main">
                <LeftSideBar />
                <div className="main-container">
                    <Link to={`/${client}/AddChannelItem`}><img className="plus-icon" src={plusIcon} alt="" /></Link>
                    <div className="card-overview">
                    
                    </div>
                </div>
                <RightSideBar />
            </div>
    )
}

export default Channel