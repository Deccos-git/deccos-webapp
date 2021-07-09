import { motion } from "framer-motion"
import { client } from '../hooks/Client';
import { Link } from "react-router-dom";
import { useFirestore } from "../firebase/useFirestore"

const ActivityCard = ({doc, metas}) => {

    const variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }
    
    let description, title, timestamp, link, buttonText, headerImage, activityBanner

    metas && metas.map(meta => {

        activityBanner = meta.activityBanner

    })
    
    if(doc.Type === "NewGoal"){
        description = "heeft een nieuw doel toegevoegd:"
        title = doc.Title
        timestamp = doc.Timestamp
        link = `/${client}/Goal/${doc.ID}`
        buttonText = "Bekijk doel"
        headerImage = activityBanner.NewGoal

    } else if (doc.Type === "NewMessage"){
        description = `heeft een nieuw bericht toegevoegd in ${doc.Channel}:` 
        title = doc.Title
        timestamp = doc.Timestamp
        link = `/${client}/${doc.Channel}/${doc.ID}`
        buttonText = "Bekijk bericht"
        headerImage = activityBanner.NewMessage

    } else if (doc.Type === "NewMember"){
        description = `is lid geworden van de community:` 
        title = `Welkom ${doc.Title}!` 
        timestamp = doc.Timestamp
        link = `/${client}/${doc.Channel}/${doc.ID}`
        buttonText = "Bekijk profiel"
        headerImage = activityBanner.NewMember
    }

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    return (
            <motion.div 
            className="activity-card card" 
            key={doc.ID}
            initial="hidden"
            animate="visible"
            variants={variants}
            >
                <>
                    <h2>{description}</h2>
                    <img src={headerImage} alt="" className="activity-card-banner" />
                    <p>{title}</p>
                    <p>{timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                    <Link to={link}>
                        <button className="activity-card-button">{buttonText}</button>
                    </Link>
                    
                </>
            </motion.div>
    )
}


export default ActivityCard
