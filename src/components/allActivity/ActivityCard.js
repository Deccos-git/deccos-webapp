import { motion } from "framer-motion"
import { client } from '../../hooks/Client';
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";


const ActivityCard = ({doc}) => {

    const history = useHistory();

    const variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    const updateRoute = (e) => {

        e.preventDefault()

        const link = e.target.dataset.link

        history.push(`${link}`)
    }

    return (
            <motion.div 
            className="activity-list activity-card" 
            // key={act.ID}
            initial="hidden"
            animate="visible"
            variants={variants}
            >
                <>
                <p className="activity-card-timestamp">{doc.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                    <div className="description-container">
                        <Link to={`/${client}/PublicProfile/${doc.UserID}`} >
                            <div className="user-container-activity-card">
                                <img className="allActivity-user-photo" src={doc.UserPhoto} alt="" />
                                <h2 className="username">{doc.User}</h2>
                            </div>
                        </Link>
                        <h2>{doc.Description}</h2>
                    </div>
                    <img className="allActivity-banner" src={doc.Banner} alt="" />
                    <div className="list-inner-container">
                        <p className="activity-card-body">{doc.Title}</p>
                        <p className="activity-card-button" data-link={doc.Link} data-id={doc.ID} onClick={updateRoute}>{doc.ButtonText}</p>
                    </div>
                </>
            </motion.div>
    )
}


export default ActivityCard
