import LeftSideBar from "./LeftSideBar"
import RightSideBarGroup from "./rightSideBar/RightSideBarGroup"
import MessageBarGroup from "./MessageBarGroup"
import { useFirestoreMessages } from "../firebase/useFirestore"
import emailIcon from '../images/icons/email-icon.png'

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

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

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
            <RightSideBarGroup group={group} route={route} /> 
        </div>
    )
}

export default Group