import RouterContext from '../context/RouterContext'
import { useContext } from 'react';
import { useFirestoreID } from "../firebase/useFirestore"
import { motion } from "framer-motion"
import worldIcon from '../images/icons/world-icon.png'
import houseIcon from '../images/icons/house-icon.png'
import Message from "./Message"
import MessageBar from "./MessageBar"
import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./RightSideBar"

const GoalDetail = () => {

    const { routerID, setRouterID } = useContext(RouterContext);

    const docs = useFirestoreID("Goals", routerID)
    const docsMessage  = useFirestoreID("Messages", routerID)

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    return (
        <div className="main">
            <LeftSideBar />
            <div className="card-overview goal-detail-container">
            {docs && docs.map(doc => (
                <motion.div className="article">
                    <h2>{doc.Title}</h2>
                    <p>{doc.Body}</p>
                    <div className="type-container">
                        {/* <img src={icon} alt="" /> */}
                        <p>{doc.Type}</p>
                    </div>
                    <p>Toegevoegd door</p>
                    <p>{doc.User}</p>
                    <p>{doc.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                </motion.div>
                ))
            }
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

export default GoalDetail
