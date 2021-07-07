import { motion } from "framer-motion"
import { client } from '../hooks/Client';
import { Link } from "react-router-dom";
import LeftSideBar from './LeftSideBar'

const ActivityCard = ({doc}) => {

    const variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }
    
    let description, title, timestamp, link, buttonText, headerImage
    
    if(doc.Type === "NewGoal"){
        description = "Nieuw doel toegevoegd:"
        title = doc.Title
        timestamp = doc.Timestamp
        link = `/${client}/Goal/${doc.ID}`
        buttonText = "Bekijk doel"

    } else if (doc.Type === "NewMessage"){
        description = `Nieuw bericht toegevoegd in ${doc.Channel}:` 
        title = doc.Title
        timestamp = doc.Timestamp
        link = `/${client}/${doc.Channel}/${doc.ID}`
        buttonText = "Bekijk bericht"
    }

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    return (
        <div class="main">
            < LeftSideBar />
            <motion.div 
            className="activity-card card" 
            key={doc.ID}
            initial="hidden"
            animate="visible"
            variants={variants}
            >
                <>
                    <h2>{description}</h2>
                    <img src={headerImage} alt="" />
                    <p>{title}</p>
                    <p>{timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                    <Link to={link}>
                        <button className="activity-card-button">{buttonText}</button>
                    </Link>
                    
                </>
            </motion.div>
        </div>
    )
}

export default ActivityCard
