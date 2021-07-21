import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./rightSideBar/RightSideBar"
import MessageBar from "./MessageBar"
import { useFirestoreMessages } from "../firebase/useFirestore"

const Group = ({group, route, auth}) => {

    const messages = useFirestoreMessages("Messages", route.Group)

    let classname = ""

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

    return (
        <div className="main">
            <LeftSideBar />
            <div className="group-container">
                <div className="group-header">
                    <h2>{group.Room}</h2>
                </div>
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

export default Group