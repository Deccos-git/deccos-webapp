import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./rightSideBar/RightSideBar"
import { useFirestore, useFirestoreID, useFirestoreMessages } from "../firebase/useFirestore"
import MessageBarGroup from "./MessageBarGroup"
import emailIcon from '../images/icons/email-icon.png'
import { db } from "../firebase/config"
import { useEffect } from "react"

const ChatRoom = ({route, auth}) => {

    const chats = useFirestore("Chats", route.Route)
    const messages = useFirestoreMessages("Messages", route.Route)
    let userID = ""

    // Define layout of message based on auth and chatpartner
// useEffect(() => {
//     messages && messages.forEach(message => {
//         console.log(message.User, auth.UserName)
//         if(message.User === auth.UserName){
//             db.collection("Messages")
//             .doc(message.docid)
//             .update({
//                 ClassName: "auth-message"
//             })
//         } else if (message.User != auth.UserName)  {
//             db.collection("Messages")
//             .doc(message.docid)
//             .update({
//                 ClassName: "user-message"
//             })
//         }
//     })
// }, [messages])

    // Define name of chatpartner
    chats && chats.forEach(chat => {
        const members = chat.Members

        members && members.forEach(member => {
            if(auth.ID != member){
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
                    <div className={message.ClassName} key={message.ID}>
                        <div className="sender-meta-container">
                            <img className="sender-photo" src={message.UserPhoto} alt="" />
                            <p className="sender-name">{message.User}</p>
                            <p className="sender-timestamp">{message.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                        </div>
                        <img className="notifications-icon-message" src={emailIcon} alt="" />
                        <p>{message.Message}</p>
                    </div>
                ))}
                <MessageBarGroup route={route} auth={auth} />
                </div>
            </div>
            <RightSideBar />
        </div>
          
    )
}

export default ChatRoom
