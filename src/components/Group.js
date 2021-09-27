import LeftSideBar from "./LeftSideBar"
import RightSideBarGroup from "./rightSideBar/RightSideBarGroup"
import MessageBarGroup from "./MessageBarGroup"
import { useFirestoreID, useFirestoreMessages } from "../firebase/useFirestore"
import emailIcon from '../images/icons/email-icon.png'
import { useContext, useState, useEffect } from 'react';
import { Auth } from '../StateManagment/Auth';
import { db } from "../firebase/config"
import { client } from "../hooks/Client"
import Location from "../hooks/Location"

const Group = () => {
    const [authO] = useContext(Auth)
    const [showSendMail, setShowSendMail] = useState("none")
    const [selectedEmailUser, setSelectedEmailUser] = useState("")

    const route = Location()[3]
    
    const groups = useFirestoreID("Groups", route)
    const messages = useFirestoreMessages("Messages", route)
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    let message = ""

    messages && messages.forEach(mssg => { 

        message = mssg

    })

    const messageClass = (message) => {
        if(message.User === authO.UserName){
            return "auth-message"
        } else if (message.User != authO.UserName)  {
            return "user-message"
        }
    }
    
    const emailOptions = () => {
            if(showSendMail === "none"){
                setShowSendMail("flex")
            } else if(showSendMail === "flex"){
                setShowSendMail("none")
            }
    }

    const sendAsMail = (e) => {

        console.log(selectedEmailUser)

    }

    const emailMemberHandler = (e) => {
        const member = e.target.value

        setSelectedEmailUser(member)

        console.log(member)

    }

    return (
        <div className="main">
            <LeftSideBar />
            {groups && groups.map(group => (
            <div className="group-outer-container" key={group.ID}>
                <div className="group-container">
                    <div className="group-header">
                        <h2>{group.Room}</h2>
                    </div>
                    <div className="chat-screen">
                        {messages && messages.map(message => (
                        <div className={messageClass(message)} key={message.ID}>
                            <div className="sender-meta-container">
                                <img className="sender-photo" src={message.UserPhoto} alt="" />
                                <p className="sender-name">{message.User}</p>
                                <p className="sender-timestamp">{message.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                            </div>
                            <div className="send-as-mail-container">
                                <img className="notifications-icon-message" src={emailIcon} alt="" onClick={emailOptions}/>
                                <div style={{display: showSendMail}}>
                                    <button onClick={sendAsMail}>Verstuur bericht als email</button>
                                    <select name="" id="" onChange={emailMemberHandler}>
                                        <option value="everybody">Iedereen</option>
                                        {group.Members.map(member => (
                                            <option value={member.UserName}>{member.UserName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <p>{message.Message}</p>
                        </div>
                        ))}
                        <MessageBarGroup route={route} auth={authO} />
                    </div>
                </div>
                <RightSideBarGroup group={group} route={route} /> 
            </div>
            ))}
        </div>
    )
}

export default Group