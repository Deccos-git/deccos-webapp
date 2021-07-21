import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./rightSideBar/RightSideBar"
import { useFirestore, useFirestoreID, useFirestoreMessages } from "../firebase/useFirestore"
import MessageBar from "./MessageBar"
import Auth from "../firebase/Auth";

const ChatRoom = ({route, auth}) => {

    const chats = useFirestore("Chats", route.Chat)
    const messages = useFirestoreMessages("Messages", route.Chat)

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

    return (
        <div className="main">
            <LeftSideBar />
            <div className="group-container">
                {users && users.map(user => (
                    <div className="chat-header">
                        <h2>Chat met</h2>
                        <h2 key={user.ID}>{user.UserName}</h2> 
                        <img src={user.Photo} alt="" /> 
                    </div>
                ))}
                <div className="chat-screen">
                {messages && messages.map(message => (
                    <div className={classname} key={message.ID}>
                        <p>{message.Message}</p>
                    </div>
                ))}
                <MessageBar route={route} auth={auth} />
                </div>
            </div>
            <RightSideBar />
        </div>
          
    )
}

export default ChatRoom
