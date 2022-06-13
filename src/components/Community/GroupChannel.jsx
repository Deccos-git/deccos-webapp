import { useFirestoreChannelItems } from "../../firebase/useFirestore";
import { motion } from "framer-motion";
import { useHistory } from "react-router-dom";
import { auth, db, timestamp } from '../../firebase/config';
import { client } from '../../hooks/Client';
import firebase from 'firebase';
import Location from "../../hooks/Location"
import ScrollToTop from "../../hooks/ScrollToTop";

const GroupChannel = () => {

    const route = Location()[3]

    const items = useFirestoreChannelItems("ChannelItems", route)

    const history = useHistory()
    ScrollToTop()
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }

    const profileLink = (e) => {
        const id = e.target.dataset.id

        history.push(`/${client}/PublicProfile/${id}`)
    }

    const updateRoute = (e) => {

        const channelID = e.target.dataset.id
        const docid = e.target.dataset.docid

        db.collection("ChannelItems")
        .doc(docid)
        .update({
            Clicks: firebase.firestore.FieldValue.arrayUnion(timestamp)
        })
        .then(() => {
            history.push(`/${client}/ChannelDetail/${channelID}`)
        })
    }

    return (
        <div className="card-container">
            {items && items.map(items => (
                <motion.div  initial="hidden"
                animate="visible"
                variants={variants} 
                className="card">
                    <div key={items.ID}>
                        <img className="card-banner" src={items.Banner} alt="" />
                        <div className="card-inner-container">
                            <div className="article-card-user-container">
                                <img src={items.UserPhoto} alt="" data-id={items.UserID} onClick={profileLink} />
                                <p data-id={items.UserID}>{items.User}</p>
                            </div>
                            <h2>{items.Title}</h2>
                            <p>{items.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                        </div>
                        <div className="button-container">
                            <button onClick={updateRoute} data-docid={items.docid} data-id={items.ID}>Bekijk</button>
                        </div>
                    </div>
                </motion.div>
            )) }
        </div>
    )
}

export default GroupChannel
