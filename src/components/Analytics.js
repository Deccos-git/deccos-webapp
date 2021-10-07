import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "./LeftSideBarAuthProfileFullScreen";
import RightSideBar from "./rightSideBar/RightSideBar"
import { useFirestoreTimestamp } from "./../firebase/useFirestore";
import MenuStatus from "../hooks/MenuStatus";

const Analytics = () => {

    const docs = useFirestoreTimestamp("AllActivity")

    const menuState = MenuStatus()

    return (
            <div className="main">
                <LeftSideBarAuthProfile />
                <LeftSideBarAuthProfileFullScreen/>
                <div className="card-overview" style={{display: menuState}}>
                    <h1>Analytics</h1>
                    <p>Analyseer de inzichten van je community</p>
                </div>
                <RightSideBar />
            </div>
    )
}

export default Analytics