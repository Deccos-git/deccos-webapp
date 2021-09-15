import { useFirestoreID, useFirestore, useFirestoreMessages} from "../../firebase/useFirestore"
import { motion } from "framer-motion"
import worldIcon from '../../images/icons/world-icon.png'
import houseIcon from '../../images/icons/house-icon.png'
import heartIcon from '../../images/icons/heart-icon.png'
import MessageBar from "../MessageBar"
import LeftSideBar from "../LeftSideBar"
import RightSideBar from "../rightSideBar/RightSideBar"
import { useHistory } from "react-router-dom"
import { client } from "../../hooks/Client"
import LikeBar from "../LikeBar"
import ReactionBar from "../ReactionBar"
import { useContext } from 'react';
import { Auth } from '../../StateManagment/Auth';
import Location from "../../hooks/Location"

const GoalDetail = () => {
    const [auth] = useContext(Auth)

    const route = Location()[3]

    const docs = useFirestoreID("Goals", route)
    const messages  = useFirestoreMessages("Messages", route)
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
    let numberOfContributions = ""

    messages && messages.forEach(message => {
        if(message.Contributions != undefined){
            if(message.Contributions.length === 0){
                numberOfContributions = 0
            } else {
                numberOfContributions = message.Contributions.length
            }
        }
    })

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
            history.push(`/${client}/MessageDetail/${message.ID}`)
        })
    }

    const showContributionsGoal = () => {

        docs && docs.forEach(doc => {
            history.push(`/${client}/Contributions/${doc.ID}`)
        })
    }

    return (
        <div className="main">
            <LeftSideBar />
            <div className="card-overview goal-detail-container">
            {docs && docs.map(doc => (
                <motion.div className="list">
                    <img src={doc.Banner} alt="" />
                    <div className="list-inner-container">
                        <h2>{doc.Title}</h2>
                        <p>{doc.Body}</p>
                        <div className="type-container">
                            <img src={icon} alt="" />
                            <p>{doc.Type}</p>
                        </div>
                        <div className="goal-progress-container">
                            <p>Aantal bijdragen: {numberOfContributions}</p>
                            <div className="button-container">
                                <button className="button-simple" onClick={showContributionsGoal}>Bekijk bijdragen</button>
                            </div>
                        </div>
                    </div>
                </motion.div>
                ))
            }

            <p> --- Reacties ---</p>
            <MessageBar route={route} auth={auth}/>
            <div className="reaction-area">
                {messages && messages.map(message => ( 
                    <div className="reaction-inner-container">
                        <div className="auth-message-container">
                            <img src={message.UserPhoto} alt="" />
                        </div>
                        <div>
                            <div className="user-meta-container">
                                <p className="auth-name">{message.User}</p>
                                <p className="message-card-timestamp">{message.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                            </div>
                            <div className="message-container">
                                <p className="massage">{message.Message}</p>
                            </div>
                            <div className="like-container">
                                <p>Aantal bijdragen: {message.Contributions}</p>
                                < LikeBar auth={auth} message={message} />
                            </div>
                            <div className="button-container button-goal-message-container">
                                <button onClick={updateRoute}>{numberOfReactions}</button>
                            </div>
                            < ReactionBar message={message} />
                        </div>
                    </div>
                ))}
            </div>
            </div>
            <RightSideBar />
        </div>
    )
}

export default GoalDetail
