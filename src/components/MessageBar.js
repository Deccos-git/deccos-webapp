import plusIcon from '../images/icons/plus-icon.png'
import sendIcon from '../images/icons/send-icon.png'
import { db, timestamp } from "../firebase/config.js"
import { useState } from 'react';
import { client } from "../hooks/Client"
import uuid from 'react-uuid';
import Auth from '../firebase/Auth.js';
import RouterContext from '../context/RouterContext'
import { useContext } from 'react';
import { useFirestore } from "../firebase/useFirestore"

const MessageBar = () => {
    const { routerID, setRouterID } = useContext(RouterContext);

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
            ID: routerID,
            MessageID: id,
            Compagny: client,
            User: auth.UserName,
            UserPhoto: auth.Photo,
        })
        .then(() => {
            db.collection("AllActivity")
            .doc()
            .set({
                Title: Message,
                Type: "NewMessage",
                Compagny: client,
                Timestamp: timestamp,
                ID: id,
                Tread: [],
                User: auth.UserName,
                UserPhoto: auth.Photo,
                Banner: banner,
                Description: "heeft een nieuw bericht geplaatst:",
                ButtonText: "Bekijk bericht",
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
