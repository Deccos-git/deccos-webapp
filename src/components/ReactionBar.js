import { useState } from "react"
import { db, timestamp} from "../firebase/config"
import plusIcon from '../images/icons/plus-icon.png'
import sendIcon from '../images/icons/send-icon.png'
import { type, client } from "../hooks/Client"
import Auth from "../firebase/Auth"
import uuid from 'react-uuid';
import firebase from "firebase"
import { useLocation } from "react-router-dom"

const ReactionBar = ({message}) => {

    const [reaction, setReaction] = useState("")
    
    const auth= Auth()
    const id = uuid()
    const location = useLocation()
    
    const reactionHandler = (e) => {

        const reaction = e.target.value

        setReaction(reaction)
    }

    const submitReaction = () => {

        db.collection("Messages")
        .doc()
        .set({
            Type: "Reaction",
            ParentID: message.ID,
            Channel: type,
            Message: reaction,
            Compagny: client,
            Timestamp: timestamp,
            PrevPath: location.pathname,
            User: auth.UserName,
            UserPhoto: auth.Photo,
            ID: id,
            Thread: [],
            Read: [auth.ID],
            UserID: auth.ID
        })
        .then(() => {
            db.collection("Messages")
            .doc(message.docid)
            .update({
                Thread: firebase.firestore.FieldValue.arrayUnion(id)
            })
        })
    }

    const addItems = () => {

    }

    return (
        <div>
            <div className="reaction-bar-container">
                <img src={plusIcon} alt="" onClick={addItems} />
                <input type="text" placeholder="Schrijf hier je reactie" onChange={reactionHandler} />
                <img src={sendIcon} alt="" onClick={submitReaction} />
            </div>
            <div>
                <input type="file" />

            </div>
        </div>
    )
}

export default ReactionBar
