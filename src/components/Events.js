import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./rightSideBar/RightSideBar"
import { client } from '../hooks/Client';
import { Link } from "react-router-dom";
import plusIcon from '../images/icons/plus-icon.png'

const Events = () => {
    return (
        <div className="main">
            <LeftSideBar />
            <div className="card-container">
                <Link to={`/${client}/AddEvent`}><img className="plus-icon" src={plusIcon} alt="" /></Link>
                <h1>Events</h1>
            </div>
            <RightSideBar />
        </div>
    )
}

export default Events