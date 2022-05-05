import GoalCard from "./GoalCard"
import {useFirestoreTimestamp} from "../../firebase/useFirestore"
import LeftSideBar from "../LeftSideBar"
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import MenuStatus from "../../hooks/MenuStatus";

const Goals = () => {
    const docs  = useFirestoreTimestamp("Goals")
    const menuState = MenuStatus()

    return (
        <div className="main">
            <LeftSideBar />
            <LeftSideBarFullScreen/>
            <div className="main-container" style={{display: menuState}}>
                <div className="page-header">
                    <h1>Impactdoelen</h1>
                </div>
                <div className="card-container">
                    {docs && docs.map(doc => (
                        <GoalCard doc={doc} key={doc.ID} />  
                    ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Goals
