import LeftSideBar from "./LeftSideBar"
import LeftSideBarFullScreen from "./LeftSideBarFullScreen"
import RightSideBar from "./rightSideBar/RightSideBar"
import { useFirestoreNotifications } from "./../firebase/useFirestore";
import { useHistory } from "react-router-dom"
import { client } from "../hooks/Client"
import Location from "../hooks/Location"
import MenuStatus from "../hooks/MenuStatus";

const Notifications = () => {
    const route = Location()[3]

    const notifications = useFirestoreNotifications("Notifications", route)
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const history = useHistory()
    const menuState = MenuStatus()

    const senderLink = (e) => {

        const senderID = e.target.dataset.senderid

        history.push(`/${client}/PublicProfile/${senderID}`)

    }

    const messageLink = (e) => {

        const messageID = e.target.dataset.messageid

        history.push(`/${client}/MessageDetail/${messageID}`)

    }

    const goalLink = (e) => {

        const goalID = e.target.dataset.goalid

        history.push(`/${client}/GoalDetail/${goalID}`)

    }

    return (
            <div className="main">
                <LeftSideBar />
                <LeftSideBarFullScreen/>
                <div className="card-overview" style={{display: menuState}}>
                    <div className="page-header">
                        <h1>Notificaties</h1>
                    </div>
                    {notifications && notifications.map(notification => (
                        <div className="notification-card" key={notification.ID}>
                            <div className="user-meta-container">
                                <img className="user-photo" src={notification.SenderPhoto} alt="" data-senderid={notification.SenderID} onClick={senderLink} />
                                <p data-senderid={notification.SenderID} onClick={senderLink}>{notification.Header}</p>
                            </div>
                            <h2 className="notification-message" onClick={messageLink} data-messageid={notification.MessageID}>{notification.MessageBody}</h2>
                            <p>{notification.SubHeader}</p>
                            <h2 className="notification-goal" onClick={goalLink} data-goalid={notification.GoalID}>{notification.GoalName}</h2>
                            <p className="notification-timestamp">{notification.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                        </div>
                    ))}
                </div>
                <RightSideBar />
            </div>
    )
}

export default Notifications