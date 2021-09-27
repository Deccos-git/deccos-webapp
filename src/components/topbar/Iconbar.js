import notificationsIcon from '../../images/icons/notifications-icon.png'
import chatIcon from '../../images/icons/chat-icon.png'
import searchIcon from '../../images/icons/Search-icon.png'
import { client } from '../../hooks/Client';
import { Link } from "react-router-dom";
import { useFirestoreNotifications, useFirestoreNewMessages } from '../../firebase/useFirestore';
import { db } from '../../firebase/config';
import { useHistory } from "react-router-dom";
import { useContext } from 'react';
import { Auth } from '../../StateManagment/Auth';

const Iconbar = () => {
    const [authO] = useContext(Auth)
    let ID = ""

    if(typeof(authO) != "string" || authO.ID != undefined){
        ID = authO.ID
    }

    const newMessages = useFirestoreNewMessages("Messages", ID)
    const newNotifications = useFirestoreNotifications("Notifications", ID)
    const history = useHistory()

    const notificationsArray = []

    newNotifications && newNotifications.forEach(notification => {

        if(notification.Read === false){
            notificationsArray.push(notification)
        }

    })
    
    let notificationStatus = ""

    if(notificationsArray.length === 0){
        notificationStatus = "notification-false"
    } else {
        notificationStatus = "notification-true"
    }

    const newMessageArray = []

    newMessages && newMessages.forEach(message => {

        if(!message.Read.includes(ID)){
            newMessageArray.push(message)
        } 
    })
    
    let messageStatus = ""

    if(newMessageArray.length === 0){
        messageStatus = "notification-false"
    } else {
        messageStatus = "notification-true"
    }

    const showNotifications = () => {

        if(newNotifications.length != 0){
            newNotifications.forEach(notification => {

                db.collection("Notifications")
                .doc(notification.docid)
                .update({
                    Read: true
                })
                .then(() => {
                    history.push(`/${client}/Notifications/${notification.RecieverID}`) 
                })
            })
        } else if (newNotifications.length === 0) {
            history.push(`/${client}/Notifications/${authO.ID}`) 
        }  
    }

    const showMessages = () => {
        history.push(`/${client}/ChatsGroups/${authO.ID}`) 
    }

    return (
        <div className="icon-bar">
            <div className="icon-container">
                <p id={notificationStatus} className="notification-counter" onClick={showNotifications} >{notificationsArray.length}</p>
                <img src={notificationsIcon} alt="" onClick={showNotifications} />
            </div>
            <div className="icon-container">
                <p id={messageStatus} className="notification-counter" onClick={showMessages}>{newMessageArray.length}</p>
                <img src={chatIcon} alt="" onClick={showMessages} />
            </div>
            <Link to={`/${client}/Search`}><img id="search-icon" src={searchIcon} alt="" /></Link>
        </div>
    )
}

export default Iconbar
