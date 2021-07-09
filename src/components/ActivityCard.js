import { motion } from "framer-motion"
import RouterContext from '../context/RouterContext'
import { useContext } from 'react';
import { client } from '../hooks/Client';
import { Link } from "react-router-dom";


const ActivityCard = ({doc}) => {
    const { routerID, setRouterID } = useContext(RouterContext);

    const variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    const updateRouterID = () => {
        setRouterID(doc.ID)
        
    }

    return (
            <motion.div 
            className="activity-card card" 
            // key={act.ID}
            initial="hidden"
            animate="visible"
            variants={variants}
            >
                <>
                    <div className="description-container">
                        <img className="allActivity-user-photo" src={doc.UserPhoto} alt="" />
                        <h2 className="username">{doc.User}</h2>
                        <h2>{doc.Description}</h2>
                    </div>
                    <img className="allActivity-banner" src={doc.Banner} alt="" />
                    <p>{doc.Title}</p>
                    <p>{doc.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                    <Link to={doc.Link} >
                        <button className="activity-card-button" onClick={updateRouterID}>{doc.ButtonText}</button>
                    </Link> 
                </>
            </motion.div>
    )
}


export default ActivityCard
