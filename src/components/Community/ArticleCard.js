import { client } from '../../hooks/Client';
import { useHistory } from "react-router-dom";
import { motion } from "framer-motion"
import firebase from 'firebase';
import { db, timestamp } from "../../firebase/config.js"
import ScrollToTop from "../../hooks/ScrollToTop";

const ArticleCard = ({doc}) => {
    const history = useHistory();
    ScrollToTop()

    const variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }

    const detailRouter = () => {

        db.collection("KnowledgeCentre")
        .doc(doc.docid)
        .update({
            Clicks: firebase.firestore.FieldValue.arrayUnion(timestamp)
        })
        .then(() => {
            history.push(`/${client}/ArticleDetail/${doc.ID}`)
        })
    }

    const profileLink = (e) => {
        const id = e.target.dataset.id

        history.push(`/${client}/PublicProfile/${id}`)
    }

    return (
            <motion.div 
            className="card" 
            initial="hidden"
            animate="visible"
            variants={variants}>
                <img className="card-banner" src={doc.Banner} alt="" />
                <div className="card-inner-container">
                    <div className="article-card-user-container">
                        <img src={doc.UserPhoto} alt="" data-id={doc.UserID} onClick={profileLink} />
                        <p data-id={doc.UserID} onClick={profileLink}>{doc.User}</p>
                    </div>
                    <h2>{doc.Title}</h2>
                    <button onClick={detailRouter}>Bekijk</button>
                </div>
            </motion.div>
    )
}

export default ArticleCard
