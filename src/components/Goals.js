import GoalCard from "./GoalCard"
import {useFirestoreTimestamp} from "../firebase/useFirestore"
import plusIcon from '../images/icons/plus-icon.png'
import { Link } from "react-router-dom";
import { client } from '../hooks/Client';
import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./RightSideBar"

const Goals = () => {

    const docs  = useFirestoreTimestamp("Goals")

    return (
        <div className="main">
        <LeftSideBar />
        <div className="card-overview">
            <Link to={`/${client}/AddGoal`}><img className="plus-icon" src={plusIcon} alt="" /></Link>
            {docs && docs.map(doc => (
                  <GoalCard doc={doc} key={doc.ID} />  
               ))
               }
        </div>
        <RightSideBar />
        </div>
    )
}

export default Goals
