import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./rightSideBar/RightSideBar"
import { useFirestore, useFirestoreID, useFirestoreMessages } from "../firebase/useFirestore"
import MessageBarGroup from "./MessageBarGroup"
import emailIcon from '../images/icons/email-icon.png'

const ChatRoom = ({route, auth}) => {

    const chats = useFirestore("Chats", route.Route)
    const messages = useFirestoreMessages("Messages", route.Route)

    let classname = ""
    let userID = ""

    // Define layout of message based on auth and chatpartner
    messages && messages.forEach(message => {
        console.log(message.User, auth.UserName)
        if(message.User === auth.UserName){
            classname = "auth-message"
            console.log(true)
        } else if (message.User != auth.UserName)  {
            classname = "user-message"
            console.log(false)
        }
    })

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
                    <div className={classname} key={message.ID}>
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
