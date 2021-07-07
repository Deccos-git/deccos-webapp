import plusIcon from '../images/icons/plus-icon.png'
import sendIcon from '../images/icons/send-icon.png'
import { db, timestamp } from "../firebase/config.js"
import { useState } from 'react';
import { pathID, client, type } from "../hooks/Client"
import uuid from 'react-uuid';

const MessageBar = () => {

    const id = uuid()

    const [Message, setMessage] = useState("")

    const MessageInput = (e) => {
        const input = e.target.value

        setMessage(input)
    }

    const submitMessage = () => {

        db.collection("Messages")
        .doc()
        .set({
            Type: "Message",
            Message: Message,
            Timestamp: timestamp,
            ID: pathID,
            MessageID: id,
            Compagny: client,
            Channel: type
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
                Channel: type
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
