import { useFirestoreID, useFirestore, useFirestoreMessages} from "../../firebase/useFirestore"
import { motion } from "framer-motion"
import worldIcon from '../../images/icons/world-icon.png'
import houseIcon from '../../images/icons/house-icon.png'
import MessageBar from "../MessageBar"
import LeftSideBar from "../LeftSideBar"
import RightSideBar from "../rightSideBar/RightSideBar"
import { db } from "../../firebase/config"
import { useHistory } from "react-router-dom"
import { client } from "../../hooks/Client"
import LikeBar from "../LikeBar"
import ReactionBar from "../ReactionBar"

const GoalDetail = ({route}) => {

    const docs = useFirestoreID("Goals", route.Goal)
    const messages  = useFirestoreMessages("Messages", route.Goal )
    const history = useHistory()

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    let icon = ""

    docs && docs.forEach(doc => {
        if(doc.Type === "SDG"){
            icon = worldIcon
        } else if (doc.Type === "Internal"){
            icon = houseIcon
        }
    })

    let numberOfReactions = ""

    messages && messages.forEach(message => {
        if(message.Thread.length === 0){
            numberOfReactions = `Bekijk bericht`
        } else if (message.Thread.length === 1){
            numberOfReactions = `Bekijk ${message.Thread.length} reactie`
        } else {
            numberOfReactions = `Bekijk ${message.Thread.length} reacties`
        }
    })

    const updateRoute = () => {

        messages && messages.forEach(message => {
            db.collection("Route")
            .doc(route.docid)
            .update({
                Message: message.ID
            })
        })
        history.push(`/${client}/MessageDetail`)
    }

    return (
        <div className="main">
            <LeftSideBar />
            <div className="card-overview goal-detail-container">
            {docs && docs.map(doc => (
                <motion.div className="list">
                    <img src={doc.Banner} alt="" />
                    <h2>{doc.Title}</h2>
                    <p>{doc.Body}</p>
                    <div className="type-container">
                        <img src={icon} alt="" />
                        <p>{doc.Type}</p>
                    </div>
                    <div className="goal-progress-container">
                        <p>Aantal bijdragen: 12</p>
                        <div className="button-container">
                            <button>Bekijk bijdragen</button>
                        </div>
                    </div>
                    <div className="goal-user-meta-container">
                        <div className="goal-user-container">
                            <img src={doc.UserPhoto} alt="" />
                            <p>{doc.User}</p>
                        </div>
                        <p className="goal-user-meta-timestamp">{doc.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                    </div>
                </motion.div>
                ))
            }

            <p> --- Reacties ---</p>
            <div className="reaction-area">
                {messages && messages.map(message => (
                    <div className="reaction-area">
                        <div className="reaction-inner-container">
                            <div className="auth-message-container">
                                <img src={message.UserPhoto} alt="" />
                                <p className="auth-name">{message.User}</p>
                                <p className="message-card-timestamp">{message.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                            </div>
                            <p>{message.Message}</p>
                            < ReactionBar message={message} />
                            < LikeBar />
                            <div className="button-container">
                                <button onClick={updateRoute}>{numberOfReactions}</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <MessageBar />
            </div>
            <RightSideBar />
        </div>
    )
}

export default GoalDetail
