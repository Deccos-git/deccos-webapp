import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./rightSideBar/RightSideBar"
import { useFirestoreNotifications } from "./../firebase/useFirestore";
import { db } from "../firebase/config";
import { useHistory } from "react-router-dom"
import { client } from "../hooks/Client"

const Notifications = ({auth, route}) => {

    const notifications = useFirestoreNotifications("Notifications", auth.ID)
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const history = useHistory()

    const senderLink = (e) => {

        const senderID = e.target.dataset.senderid

            db.collection("Route")
            .doc(route.docid)
            .update({
                Route: senderID
            })

        history.push(`/${client}/PublicProfile`)

    }

    const messageLink = (e) => {

        const messageID = e.target.dataset.messageid

            db.collection("Route")
            .doc(route.docid)
            .update({
                Route: messageID
            })

        history.push(`/${client}/MessageDetail`)

    }

    const goalLink = (e) => {

        const goalID = e.target.dataset.goalid

            db.collection("Route")
            .doc(route.docid)
            .update({
                Route: goalID
            })

        history.push(`/${client}/GoalDetail`)

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