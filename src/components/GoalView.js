import { useFirestoreID } from "../firebase/useFirestore"
import { motion } from "framer-motion"
import worldIcon from '../images/icons/world-icon.png'
import houseIcon from '../images/icons/house-icon.png'
import Message from "./Message"
import MessageBar from "./MessageBar"
import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./RightSideBar"

const GoalView = () => {

    const docsGoal  = useFirestoreID("Goals")
    const docsMessage  = useFirestoreID("Messages")

    let icon, type, title, body, message

    docsGoal && docsGoal.map(doc => {

        title = doc.Title
        body = doc.Body
        doc.Type === "SDG" ? icon = worldIcon : icon = houseIcon
        doc.Type === "internal" ? type = "Intern" : type = "Sociaal maatschappelijk"
        
    })

    return (
        <div className="main">
            <LeftSideBar />
            <div className="card-overview">
                <motion.div className="article">
                    <h2>{title}</h2>
                    <p>{body}</p>
                    <div className="type-container">
                        <img src={icon} alt="" />
                        <p>{type}</p>
                    </div>
                </motion.div>
                {docsMessage && docsMessage.map(doc => (
                    <Message doc={doc} key={doc.MessageID}/>
                ))
                }
                <MessageBar />
            </div>
            <RightSideBar />
        </div>
    )
}

export default GoalView
