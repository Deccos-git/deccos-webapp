import { useFirestoreID, useFirestore, useFirestoreMessages} from "../../firebase/useFirestore"
import { motion } from "framer-motion"
import worldIcon from '../../images/icons/world-icon.png'
import houseIcon from '../../images/icons/house-icon.png'
import Message from "../Message"
import MessageBar from "../MessageBar"
import LeftSideBar from "../LeftSideBar"
import RightSideBar from "../rightSideBar/RightSideBar"

const GoalDetail = ({route}) => {

    const docs = useFirestoreID("Goals", route.Goal)
    const messages  = useFirestoreMessages("Messages", route.Goal )

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    const icon = ""

    return (
        <div className="main">
            <LeftSideBar />
            <div className="card-overview goal-detail-container">
            {docs && docs.map(doc => (
                <motion.div className="list">
                    <h2>{doc.Title}</h2>
                    <p>{doc.Body}</p>
                    <div className="type-container">
                        <img src={icon} alt="" />
                        <p>{doc.Type}</p>
                    </div>
                    <p>Toegevoegd door</p>
                    <p>{doc.User}</p>
                    <p>{doc.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                </motion.div>
                ))
            }
            {messages && messages.map(message => (
                <Message message={message} key={message.ID}/>
            ))
            }
            <MessageBar />
            </div>
            <RightSideBar />
        </div>
    )
}

export default GoalDetail
