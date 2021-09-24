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

    const route = Location()[3]
    
    const groups = useFirestoreID("Groups", route)
    const messages = useFirestoreMessages("Messages", route)

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
    


    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

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
                            <img className="notifications-icon-message" src={emailIcon} alt="" />
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