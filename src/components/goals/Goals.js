import GoalCard from "./GoalCard"
import {useFirestoreTimestamp} from "../../firebase/useFirestore"
import LeftSideBar from "../LeftSideBar"
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import RightSideBar from "../rightSideBar/RightSideBar";
import MenuStatus from "../../hooks/MenuStatus";

const Goals = () => {
    const docs  = useFirestoreTimestamp("Goals")
    const menuState = MenuStatus()

    return (
        <div className="main">
        <LeftSideBar />
        <LeftSideBarFullScreen/>
        <div className="main-container" style={{display: menuState}}>
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
