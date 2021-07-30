import GoalCard from "./GoalCard"
import {useFirestoreTimestamp} from "../../firebase/useFirestore"
import LeftSideBar from "../LeftSideBar"
import RightSideBar from "../rightSideBar/RightSideBar";

const Goals = () => {

    const docs  = useFirestoreTimestamp("Goals")

    return (
        <div className="main">
        <LeftSideBar />
        <div className="main-container">
            <div className="card-container">
                {docs && docs.map(doc => (
                    <GoalCard doc={doc} key={doc.ID} />  
                ))
                }
            </div>
        </div>
        <RightSideBar />
        </div>
    )
}

export default Goals
