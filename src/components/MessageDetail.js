import { useFirestore, useFirestoreMessages } from "../firebase/useFirestore"
import { useFirestoreID } from "../firebase/useFirestore"
import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./rightSideBar/RightSideBar"
import ReactionBar from "./ReactionBar"
import LikeBar from "./LikeBar"
import { db } from "../firebase/config"
import { useHistory } from "react-router-dom"
import { client } from "../hooks/Client"

const MessageDetail = () => {

    const routes = useFirestore("Route")

    let routeID = ""

    routes && routes.forEach(route => {

        routeID = route.Route

    })

    const messages = useFirestoreID("Messages", routeID)

    let parentID = ""

    messages && messages.forEach(message => {

        parentID = message.ID
        
    })

    const reactions = useFirestoreMessages("Messages", parentID )

    let numberOfReactions = ""

    reactions && reactions.forEach(reaction => {

        console.log(reaction.Thread.length)

        if(reaction.Thread.length === 0){
            numberOfReactions = `Bekijk reactie`
        } else if (reaction.Thread.length === 1){
            numberOfReactions = `Bekijk ${reaction.Thread.length} reactie`
        } else {
            numberOfReactions = `Bekijk ${reaction.Thread.length} reacties`
        }

    })

    console.log(numberOfReactions)

    const history = useHistory()

    const updateRoute = () => {

        routes && routes.forEach(route => {
            const routeRef = db.collection("Route")
            .doc(route.docid)

            reactions && reactions.forEach(reaction => {
                routeRef.update({
                    Route: reaction.ID
                })
            })
        })

        history.push(`/${client}/MessageDetail`)
    }

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    return (
        <div className="main">
             <LeftSideBar />
             <div className="card-overview">
                {messages && messages.map(message => (
                    <div className="message-card">
                        <div className="auth-message-container">
                            <img src={message.UserPhoto} alt="" />
                            <p className="auth-message">{message.User}</p>
                            <p>heeft geschreven:</p>
                            <p className="message-card-timestamp">{message.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                        </div>
                    <p>{message.Message}</p>
                    < ReactionBar message={message} />
                    < LikeBar />
                    </div>
                ))}

                <div>
                    <p>----- Reacties -----</p>
                </div>
                {reactions && reactions.map(reaction => (
                    <div className="reaction-card">
                        <div className="auth-message-container">
                            <img src={reaction.UserPhoto} alt="" />
                            <p className="auth-message">{reaction.User}</p>
                            <p>heeft geschreven:</p>
                            <p className="message-card-timestamp">{reaction.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                        </div>
                        <p>{reaction.Message}</p>
                        < ReactionBar message={reaction} />
                        < LikeBar />
                        <button onClick={updateRoute}>{numberOfReactions}</button>
                    </div>
                ))}
            </div>
             <RightSideBar />
        </div>
    )
}

export default MessageDetail
