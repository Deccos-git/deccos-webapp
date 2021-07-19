import { motion } from "framer-motion"
import { client } from '../../hooks/Client';
import { Link } from "react-router-dom";
import { useFirestore } from '../../firebase/useFirestore';
import { db } from '../../firebase/config';
import { useHistory } from "react-router-dom";


const ActivityCard = ({doc}) => {

    const routes = useFirestore("Route")
    const history = useHistory();

    const variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    const updateRoute = (e) => {

        e.preventDefault()

        routes && routes.forEach(route => {
            db.collection("Route")
            .doc(route.docid)
            .update({
                Route: doc.ID
            })
        })

        history.push(`/${client}/ArticleDetail`)
    }

    return (
            <motion.div 
            className="activity-list list" 
            // key={act.ID}
            initial="hidden"
            animate="visible"
            variants={variants}
            >
                <>
                    <div className="description-container">
                        <Link to={`/${client}/PublicProfile`} >
                            <div className="user-container-activity-card">
                                <img className="allActivity-user-photo" src={doc.UserPhoto} alt="" />
                                <h2 className="username">{doc.User}</h2>
                            </div>
                        </Link>
                        <h2>{doc.Description}</h2>
                    </div>
                    <img className="allActivity-banner" src={doc.Banner} alt="" />
                    <p className="activity-card-body">{doc.Title}</p>
                    <p>{doc.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                    <Link to={doc.Link} >
                        <button className="activity-card-button" onClick={updateRoute}>{doc.ButtonText}</button>
                    </Link> 
                </>
            </motion.div>
    )
}


export default ActivityCard
