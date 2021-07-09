  
import ActivityCard from "./ActivityCard"
import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./RightSideBar"
import { useFirestoreTimestamp } from "../firebase/useFirestore";
import { useContext } from "react";

const AllActivity = () => {

    const docs = useFirestoreTimestamp("AllActivity")

    return (
            <div className="main">
                <LeftSideBar />
                <div className="card-overview">
                {docs && docs.map(doc => (
                    <ActivityCard doc={doc} key={doc.ID}/> 
                ))} 
                </div>
                <RightSideBar />
            </div>
    )
}

export default AllActivity
