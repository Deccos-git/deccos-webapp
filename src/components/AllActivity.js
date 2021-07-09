import ActivityCard from "./ActivityCard"
import {useFirestoreTimestamp, useFirestore} from "../firebase/useFirestore"
import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./RightSideBar"

const AllActivity = () => {

    const docs  = useFirestoreTimestamp("AllActivity")
    const metas = useFirestore("CompagnyMeta")

    return (
        <div className="main">
        <LeftSideBar />
        <div className="card-overview">
              {docs && docs.map(doc => (
                 <ActivityCard doc={doc} metas={metas} key={doc.ID}/>  
              ))
              }
        </div>
        <RightSideBar />
        </div>
    )
}

export default AllActivity
