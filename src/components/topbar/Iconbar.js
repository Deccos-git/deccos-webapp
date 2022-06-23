import savedIcon from '../../images/icons/saved-icon.png'
import questionIcon from '../../images/icons/question-icon.png'
import searchIcon from '../../images/icons/search-icon.png'
import magicIcon from '../../images/icons/magic-icon.png'
import chatIcon from '../../images/icons/chat-icon.png'
import notificationIcon from '../../images/icons/notification-icon.png'
import { client } from '../../hooks/Client';
import { Link } from "react-router-dom";
import { useFirestoreNotifications, useFirestoreNewMessagesChatGroups } from '../../firebase/useFirestore';
import { db } from '../../firebase/config';
import { useHistory } from "react-router-dom";
import { useContext } from 'react';
import { Auth } from '../../StateManagment/Auth';
import { MobileMenu } from '../../StateManagment/MobileMenu';

const Iconbar = () => {
    const [menu, setMenu] = useContext(MobileMenu)

    const [authO] = useContext(Auth)

    const changeMenuStatus = () => {
        setMenu("none")
    }

    const newMessages = useFirestoreNewMessagesChatGroups(authO && authO)
    const newNotifications = useFirestoreNotifications("Notifications", authO && authO)
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

        if(!message.Read.includes(authO)){
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
                    setMenu("none")
                })
            })
        } else if (newNotifications.length === 0) {
            history.push(`/${client}/Notifications/${authO.ID}`) 
            setMenu("none")
        }  
    }

    const showMessages = () => {
        history.push(`/${client}/ChatsGroups/${authO.ID}`) 
        setMenu("none")
    }

    return (
        <div className="icon-bar">
            <div className="icon-container">
                <p id={notificationStatus} className="notification-counter" onClick={showNotifications} >{notificationsArray.length}</p>
                <img src={notificationIcon} alt="notification icon" onClick={showNotifications} />
            </div>
            <div className="icon-container">
                <p id={messageStatus} className="notification-counter" onClick={showMessages}>{newMessageArray.length}</p>
                <img src={chatIcon} alt="chat icon" onClick={showMessages} />
            </div>
            <div className="icon-container">
                <Link to={`/${client}/Introduction`} onClick={changeMenuStatus}>
                    <img src={magicIcon} alt="magic icon" />
                </Link>
            </div>
            <div className="icon-container">
                <Link to={`/${client}/Support`} onClick={changeMenuStatus}>
                    <img src={questionIcon} alt="question icon" />
                </Link>
            </div>
            <div className="icon-container">
                <Link to={`/${client}/Search`} onClick={changeMenuStatus}>
                   <img src={searchIcon} alt="search icon" />
                </Link>
            </div>
        </div>
    )
}

export default Iconbar
