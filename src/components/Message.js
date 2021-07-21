import { useFirestore } from "../firebase/useFirestore"
import { db } from "../firebase/config"
import { useHistory } from "react-router-dom"
import { client } from "../hooks/Client"
import LikeBar from "./LikeBar"
import ReactionBar from "./ReactionBar"

const Message = ({message}) => {

    const history = useHistory()

    let numberOfReactions = ""

    if(message.Thread.length === 0){
        numberOfReactions = `Bekijk bericht`
    } else if (message.Thread.length === 1){
        numberOfReactions = `Bekijk ${message.Thread.length} reactie`
    } else {
        numberOfReactions = `Bekijk ${message.Thread.length} reacties`
    }

    const routes = useFirestore("Route")

    const updateRoute = () => {

        routes && routes.forEach(route => {
            db.collection("Route")
            .doc(route.docid)
            .update({
                Message: message.ID
            })
        })

        history.push(`/${client}/MessageDetail`)
    }

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    return (
        <div className="message-card" >
            <div className="auth-message-container">
                <p className="auth-message">{message.User}</p>
                <p>heeft geschreven:</p>
                <p className="message-card-timestamp">{message.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
            </div>
            <p>{message.Message}</p>
            < ReactionBar message={message} />
            < LikeBar />
            <button onClick={updateRoute}>{numberOfReactions}</button>
        </div>
    )
}

export default Message
