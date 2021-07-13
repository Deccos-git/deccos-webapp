import { client } from '../hooks/Client';
import plusIcon from '../images/icons/plus-icon.png'
import { Link } from "react-router-dom";
import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./rightSideBar/RightSideBar"

const KnowledgeCentre = () => {
    return (
        <div className="main">
             <LeftSideBar />
             <div className="card-container">
                <Link to={`/${client}/AddArticle`}><img className="plus-icon" src={plusIcon} alt="" /></Link>
                <h1>Kenniscentrum</h1>
            </div>
            <RightSideBar />
        </div>
    )
}

export default KnowledgeCentre
