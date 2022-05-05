
import {ReactComponent as NotificationIcon} from '../../images/icons/notifications-icon.svg'
import {ReactComponent as ChatIcon} from '../../images/icons/chat-icon.svg'
import {ReactComponent as SearchIcon}  from '../../images/icons/search-icon.svg'
import {ReactComponent as MagicIcon}  from '../../images/icons/magic-icon.svg'
import {ReactComponent as QuestionIcon}  from '../../images/icons/question-icon.svg'
import { client } from '../../hooks/Client';
import { Link } from "react-router-dom";
import { useFirestoreNotifications, useFirestoreNewMessagesChatGroups } from '../../firebase/useFirestore';
import { db } from '../../firebase/config';
import { useHistory } from "react-router-dom";
import { useContext } from 'react';
import { Auth } from '../../StateManagment/Auth';
import { MobileMenu } from '../../StateManagment/MobileMenu';
import Colors from "../../hooks/Colors";

const Iconbar = () => {
    const [menu, setMenu] = useContext(MobileMenu)
    const [authO] = useContext(Auth)

    const colors = Colors()
    let ID = ""

    const changeMenuStatus = () => {
        setMenu("none")
    }

    if(typeof(authO) != "string" || authO.ID != undefined){
        ID = authO.ID
    }

    const newMessages = useFirestoreNewMessagesChatGroups(ID)
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
                <NotificationIcon 
                style={
                    {
                        width: '19px',
                        height: '19px',
                        fill: colors.TopBarIconsColor
                    }
                }  
                onClick={showNotifications}/>
            </div>
            <div className="icon-container">
                <p id={messageStatus} className="notification-counter" onClick={showMessages}>{newMessageArray.length}</p>
                <ChatIcon 
                style={
                    {
                        width: '19px',
                        height: '19px',
                        margin: '10px',
                        fill: colors.TopBarIconsColor
                    }
                }  
                onClick={showMessages}/>
            </div>
            <div className="icon-container">
                <Link to={`/${client}/Introduction`} style={{fill: colors.IconbarColor}} onClick={changeMenuStatus}>
                    <MagicIcon 
                    style={
                        {
                            width: '19px',
                            height: '19px',
                            fill: colors.TopBarIconsColor,
                            marginBottom: '-7px',
                            marginLeft: '5px',
                            marginRight: '5px'
                        }
                    }  />
                </Link>
            </div>
            <div className="icon-container">
                <Link to={`/${client}/Search`} style={{fill: colors.IconbarColor}} onClick={changeMenuStatus}>
                    <SearchIcon 
                    style={
                        {
                            width: '19px',
                            height: '19px',
                            fill: colors.TopBarIconsColor,
                            marginBottom: '-7px',
                            marginLeft: '5px',
                            marginRight: '5px'
                        }
                    }  />
                </Link>
            </div>
            <div className="icon-container">
                <Link to={`/${client}/Search`} style={{fill: colors.IconbarColor}} onClick={changeMenuStatus}>
                    <QuestionIcon 
                    style={
                        {
                            width: '19px',
                            height: '19px',
                            fill: colors.TopBarIconsColor,
                            marginBottom: '-7px'
                        }
                    }  />
                </Link>
            </div>
        </div>
    )
}

export default Iconbar
