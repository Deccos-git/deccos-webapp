import plusIcon from '../images/icons/plus-icon.png'
import sendIcon from '../images/icons/send-icon.png'
import { db, timestamp } from "../firebase/config.js"
import { useState } from 'react';
import { client, type } from "../hooks/Client"
import uuid from 'react-uuid';
import Auth from '../firebase/Auth.js';
import { useFirestore } from "../firebase/useFirestore"

const MessageBar = () => {

    const routes = useFirestore("Route")

    let routeID = ""
    let docID = ""

    routes && routes.forEach(route => {

        routeID = route.Route
        docID = route.docid

    })

    const auth = Auth()
    const id = uuid()
    const compagny = useFirestore("CompagnyMeta")

    const [Message, setMessage] = useState("")

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
            ParentID: routeID,
            ID: id,
            Compagny: client,
            User: auth.UserName,
            UserPhoto: auth.Photo,
            Channel: type,
            Thread: []
        })
        .then(() => {
            db.collection("Route")
            .doc(docID)
            .update({
                LastActivity: "NewMessage",
                Auth: auth.ID
            })
        })
    }

    return (
        <div className="messagebar-container">
            <img src={plusIcon} alt="" />
            <input 
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

export default MessageBar
