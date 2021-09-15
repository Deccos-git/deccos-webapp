import plusIcon from '../images/icons/plus-icon.png'
import sendIcon from '../images/icons/send-icon.png'
import { db, timestamp } from "../firebase/config.js"
import { useState } from 'react';
import { client, type } from "../hooks/Client"
import uuid from 'react-uuid';
import { useFirestore } from "../firebase/useFirestore"
import firebase from 'firebase';
import { useContext } from 'react';
import { Auth } from '../StateManagment/Auth';
import Location from "../hooks/Location"

const MessageBarGroup = () => {
    const [authO] = useContext(Auth)

    const route = Location()[3]
    const [Message, setMessage] = useState("")

    const id = uuid()
    const compagny = useFirestore("CompagnyMeta")
    const chats = useFirestore("Chats", route)

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
            ID: id,
            Compagny: client,
            User: authO.UserName,
            UserPhoto: authO.Photo,
            Thread: [],
            Read: [authO.ID],
            UserID: authO.ID
        })
        .then(() => {
            chats && chats.forEach(chat => {
                db.collection("Chats")
                .doc(chat.docid)
                .update({
                    Messages: firebase.firestore.FieldValue.increment(1)
                })
            })
        })
    }

    return (
            <div className="messagebar-group-container">
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
    )
}

export default MessageBarGroup
