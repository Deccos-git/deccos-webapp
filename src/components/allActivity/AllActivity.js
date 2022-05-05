  
import ActivityCard from "./ActivityCard"
import LeftSideBar from "../LeftSideBar"
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import { useFirestoreTimestamp } from "../../firebase/useFirestore";
import MenuStatus from "../../hooks/MenuStatus";

const AllActivity = () => {

    const docs = useFirestoreTimestamp("AllActivity")
    const menuState = MenuStatus()

    return (
            <div className='main'>
                <LeftSideBar />
                <LeftSideBarFullScreen/>
                <div className="card-overview" style={{display: menuState}}>
                <div className="page-header">
                    <h1>Alle activiteit</h1>
                </div>
                {docs && docs.map(doc => (
                    <ActivityCard doc={doc} key={doc.ID}/> 
                ))} 
                </div>
            </div>
    )
}

export default AllActivity
