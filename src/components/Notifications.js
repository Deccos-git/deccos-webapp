import LeftSideBar from "./LeftSideBar"
import LeftSideBarFullScreen from "./LeftSideBarFullScreen"
import RightSideBar from "./rightSideBar/RightSideBar"
import { useFirestoreNotifications } from "./../firebase/useFirestore";
import { useHistory } from "react-router-dom"
import { client } from "../hooks/Client"
import Location from "../hooks/Location"
import MenuStatus from "../hooks/MenuStatus";
import { useState, useEffect } from "react"
import { useFirestore} from "../firebase/useFirestore"

const Notifications = () => {
    const route = Location()[3]
    const [color, setColor] = useState('')

    const notifications = useFirestoreNotifications("Notifications", route)
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const history = useHistory()
    const menuState = MenuStatus()

    const colors = useFirestore('Colors')

    useEffect(() => {
        colors && colors.forEach(color => {
            const background = color.Background 

            setColor(background)
        })

    },[colors])

    const senderLink = (e) => {

        const senderID = e.target.dataset.senderid

        history.push(`/${client}/PublicProfile/${senderID}`)

    }

    const messageLink = (e) => {

        const route = e.target.dataset.route

        history.push(`/${client}/${route}`)

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
                            <div className="notification-card-inner-container">
                                <div className="user-meta-container">
                                    <img className="user-photo" src={notification.SenderPhoto} alt="" data-senderid={notification.SenderID} onClick={senderLink} />
                                    <p data-senderid={notification.SenderID} onClick={senderLink}>{notification.Header}</p>
                                </div>
                                <div className="message-container" style={{backgroundColor: color}}>
                                    <p className="notification-message" onClick={messageLink} data-route={notification.Route}>{notification.MessageBody}</p>
                                </div>
                                <p>{notification.SubHeader}</p>
                                <p className="notification-timestamp">{notification.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                                <div id='button-notifications-container'>
                                    <button className='button-simple' data-route={notification.Route} onClick={messageLink}>Bekijk</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <RightSideBar />
            </div>
    )
}

export default Notifications