import ActivityCard from "./ActivityCard"
import {useFirestoreTimestamp} from "../firebase/useFirestore"
import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./RightSideBar"

const AllActivity = () => {

    const docs  = useFirestoreTimestamp("AllActivity")

    return (
        <div className="main">
            <LeftSideBar />
            <div className="card-overview">
                {docs && docs.map(doc => (
                    <ActivityCard doc={doc} />  
                ))
                }
            </div>
            <RightSideBar />
        </div>
    )
}

export default AllActivity
