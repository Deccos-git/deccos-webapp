import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./rightSideBar/RightSideBar"
import { useFirestore, useFirestoreID, useFirestoreMessages } from "../firebase/useFirestore"
import MessageBarGroup from "./MessageBarGroup"
import emailIcon from '../images/icons/email-icon.png'
import { db } from "../firebase/config"
import { useEffect, useContext } from "react"
import { Auth } from '../StateManagment/Auth';
import Location from "../hooks/Location"

const ChatRoom = () => {

    const [authO] = useContext(Auth)
    const route = Location()[3]

    const chats = useFirestoreID("Chats", route)
    const messages = useFirestoreMessages("Messages", route)
    let userID = ""

    const messageClass = (message) => {
        if(message.User === authO.UserName){
            return "auth-message"
        } else if (message.User != authO.UserName)  {
            return "user-message"
        }
    }

    // Define name of chatpartner
    chats && chats.forEach(chat => {
        const members = chat.Members

        members && members.forEach(member => {
            if(authO.ID != member){
                userID = member
            }
        })
    })

    const users = useFirestoreID("Users", userID)

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    return (
        <div className="main">
            <LeftSideBar />
            <div className="group-container">
                {users && users.map(user => (
                    <div className="chat-header">
                        <div>
                            <img src={user.Photo} alt="" /> 
                        </div>
                        <div className="header-title-container">
                            <h2>Chat met</h2>
                            <h2 key={user.ID}>{user.UserName}</h2> 
                        </div>
                    </div>
                ))}
                <div className="chat-screen">
                {messages && messages.map(message => (
                    <div className={messageClass(message)} key={message.ID}>
                        <div className="sender-meta-container">
                            <img className="sender-photo" src={message.UserPhoto} alt="" />
                            <p className="sender-name">{message.User}</p>
                            <p className="sender-timestamp">{message.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                        </div>
                        <img className="notifications-icon-message" src={emailIcon} alt="" />
                        <p>{message.Message}</p>
                    </div>
                ))}
                <MessageBarGroup route={route} auth={authO} />
                </div>
            </div>
            <RightSideBar />
        </div>
          
    )
}

export default ChatRoom
