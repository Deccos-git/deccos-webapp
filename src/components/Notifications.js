import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./rightSideBar/RightSideBar"
import { useFirestoreNotifications } from "./../firebase/useFirestore";
import { useHistory } from "react-router-dom"
import { client } from "../hooks/Client"
import Location from "../hooks/Location"

const Notifications = () => {
    const route = Location()[3]

    const notifications = useFirestoreNotifications("Notifications", route)
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const history = useHistory()

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
                <div className="card-overview">
                    {notifications && notifications.map(notification => (
                        <div className="list notification-card" key={notification.ID}>
                            <div className="user-meta-container">
                                <img className="user-photo" src={notification.SenderPhoto} alt="" data-senderid={notification.SenderID} onClick={senderLink} />
                                <p data-senderid={notification.SenderID} onClick={senderLink}>{notification.SenderName} heeft aangegeven dat jouw bericht</p>
                            </div>
                            <h2 className="notification-message" onClick={messageLink} data-messageid={notification.MessageID}>{notification.MessageBody}</h2>
                            <p>een bijdrage is aan het doel</p>
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