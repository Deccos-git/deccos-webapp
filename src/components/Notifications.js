import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./rightSideBar/RightSideBar"
import { useFirestoreNotifications } from "./../firebase/useFirestore";

const Notifications = ({auth}) => {

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