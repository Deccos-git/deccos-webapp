import { client } from '../../hooks/Client';
import { useHistory } from "react-router-dom";
import { motion } from "framer-motion"
import worldIcon from '../../images/icons/world-icon.png'
import houseIcon from '../../images/icons/house-icon.png'
import uuid from 'react-uuid'
import { useFirestore } from '../../firebase/useFirestore';
import { db } from '../../firebase/config';

const GoalCard = ({doc}) => {

    const history = useHistory();
    const routes = useFirestore("Route")

    const variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }

    let icon, type

    doc.Type === "SDG" ? icon = worldIcon : icon = houseIcon

    doc.Type === "internal" ? type = "Intern" : type = "Sociaal maatschappelijk"

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    const updateRoute = () => {

        routes && routes.forEach(route => {
            db.collection("Route")
            .doc(route.docid)
            .update({
                Route: doc.ID
            })
        })

        history.push(`/${client}/GoalDetail`)
    }


    return (
       
        <motion.div 
        className="goal-list list" 
        key={uuid()}
        initial="hidden"
        animate="visible"
        variants={variants}>
            <img src={icon} alt="" />
            <h2>{doc.Title}</h2>
            <h3>{doc.Body}</h3>
            <div className="type-container">
                <p>{type}</p>
            </div>
            <div className="user-meta-goal-card">
                <p>Toegevoegd door</p>
                <p className="user-goal-card">{doc.User}</p>
            </div>
            <p>{doc.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
            <button className="goal-card-button" onClick={updateRoute} >Bekijk</button>
        </motion.div>
    )
}

export default GoalCard