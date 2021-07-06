import GoalCard from "./GoalCard"
import useFirestore from "../firebase/useFirestore"
import plusIcon from '../images/icons/plus-icon.png'
import { Link } from "react-router-dom";
import { client } from '../hooks/Client';

const Goals = () => {

    const docs  = useFirestore("Goals")

    return (
        <div className="card-overview">
            <Link to={`/${client}/AddGoal`}><img className="plus-icon" src={plusIcon} alt="" /></Link>
            {docs && docs.map(doc => (
                  <GoalCard doc={doc} />  
               ))
               }
        </div>
    )
}

export default Goals
