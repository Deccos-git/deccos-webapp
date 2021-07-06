import ActivityCard from "./ActivityCard"
import useFirestore from "../firebase/useFirestore"

const AllActivity = () => {

    const docs  = useFirestore("AllActivity")

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
