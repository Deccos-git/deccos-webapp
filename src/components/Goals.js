import GoalCard from "./GoalCard"
import {useFirestoreTimestamp} from "../firebase/useFirestore"
import plusIcon from '../images/icons/plus-icon.png'
import { Link } from "react-router-dom";
import { client } from '../hooks/Client';

const Goals = () => {

    const docs  = useFirestoreTimestamp("Goals")

    console.log(docs)

    return (
        <div className="card-overview">
            <Link to={`/${client}/AddGoal`}><img className="plus-icon" src={plusIcon} alt="" /></Link>
            {docs && docs.map(doc => (
                  <GoalCard doc={doc} key={doc.ID} />  
               ))
               }
        </div>
    )
}

export default Goals
