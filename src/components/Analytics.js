import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import RightSideBar from "./rightSideBar/RightSideBar"
import { useFirestoreTimestamp } from "./../firebase/useFirestore";

const Analytics = () => {

    const docs = useFirestoreTimestamp("AllActivity")

    return (
            <div className="main">
                <LeftSideBarAuthProfile />
                <div className="card-overview">
                    <h2>Analytics</h2>
                    <p>Analyseer de inzichten van je community</p>
                </div>
                <RightSideBar />
            </div>
    )
}

export default Analytics