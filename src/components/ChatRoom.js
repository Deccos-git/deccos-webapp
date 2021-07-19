import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./rightSideBar/RightSideBar"
import { useFirestoreChats, useFirestoreMessages } from "../firebase/useFirestore"
import MessageBar from "./MessageBar"
import Auth from "../firebase/Auth";

const ChatRoom = ({route}) => {

    console.log(route)

    const auth = Auth()

    const chats = useFirestoreChats("Chats", route.Room)

    console.log(chats)

    const messages = useFirestoreMessages("Messages", route.Route)

    console.log(messages)

    let classname = ""

        messages && messages.forEach(message => {
            console.log(message.User === auth.UserName)
            if(message.User == auth.Username){
                classname = "auth-message"
            } else {
                classname = "user-message"
            }
        })
    
    return (
        <div className="main">
            <LeftSideBar />
            <div className="group-container">
                <div classname="chat-header">
                    <p>Chat met</p>
                    {chats && chats.map(chat => (
                        <h2 key={chat.ID}>{route.User}</h2>
                    ))}
                </div>
                {messages && messages.map(message => (
                    <div className={classname} key={message.ID}>
                        <p>{message.Message}</p>
                    </div>
                ))}
                <MessageBar />
            </div>
            <RightSideBar />
        </div>
          
    )
}

export default ChatRoom
