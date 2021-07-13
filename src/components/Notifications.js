import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./rightSideBar/RightSideBar"
import { useFirestoreTimestamp } from "./../firebase/useFirestore";

const Notifications = () => {

    const docs = useFirestoreTimestamp("AllActivity")

    return (
            <div className="main">
                <LeftSideBar />
                <div className="card-overview">
                    <h2>Notificaties</h2>
                </div>
                <RightSideBar />
            </div>
    )
}

export default Notifications