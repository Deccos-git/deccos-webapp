import ActivityCard from "./ActivityCard"
import {useFirestoreTimestamp} from "../firebase/useFirestore"

const AllActivity = () => {

    const docs  = useFirestoreTimestamp("AllActivity")

    return (
        <div className="card-overview">
              {docs && docs.map(doc => (
                 <ActivityCard doc={doc} />  
              ))
              }
        </div>
    )
}

export default AllActivity
