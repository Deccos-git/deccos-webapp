import plusIcon from '../images/icons/plus-icon.png'
import sendIcon from '../images/icons/send-icon.png'
import { db, timestamp } from "../firebase/config.js"
import { useState } from 'react';
import { client, type } from "../hooks/Client"
import uuid from 'react-uuid';
import { useFirestore } from "../firebase/useFirestore"
import { useLocation } from "react-router-dom"
import firebase from 'firebase';

const MessageBar = ({route, auth}) => {

    const [Message, setMessage] = useState("")

    const id = uuid()
    const compagny = useFirestore("CompagnyMeta")
    const chats = useFirestore("Chats", route.Chat)
    const location = useLocation()

    const MessageInput = (e) => {
        const input = e.target.value

        setMessage(input)
    }

    let banner = ""

    compagny && compagny.forEach(comp => {
        banner = comp.ActivityBanner.NewMessage
    })

    const submitMessage = () => {

        db.collection("Messages")
        .doc()
        .set({
            Type: "Message",
            Message: Message,
            Timestamp: timestamp,
            ParentID: route.Route,
            PrevPath: location.pathname,
            ID: id,
            Compagny: client,
            User: auth.UserName,
            UserPhoto: auth.Photo,
            Thread: [],
            Read: [auth.ID],
            UserID: auth.ID,
            Contributions: []
        })
        .then(() => {
            chats && chats.forEach(chat => {
                db.collection("Chats")
                .doc(chat.docid)
                .update({
                    NewMessages: "newMessages"
                })
            })
        })
    }

    return (
        <div className="massage-container">
            <div>
                <img src={auth.Photo} alt="" />
            </div>
            <div className="messagebar-container">
                <img src={plusIcon} alt="" />
                <textarea 
                type="text" 
                className="message-input" 
                placeholder="Schrijf hier je bericht"
                value = {Message}
                onChange={MessageInput}
                /> 
                <img src={sendIcon} alt="" onClick={submitMessage} /> 
            </div>
        </div>
    )
}

export default MessageBar
