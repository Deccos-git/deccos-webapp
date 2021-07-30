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
                Goal: doc.ID,
                Route: doc.ID
            })
        })

        history.push(`/${client}/GoalDetail`)
    }


    return (
       
        <motion.div 
        className="goal-list card" 
        key={uuid()}
        initial="hidden"
        animate="visible"
        variants={variants}>
            <img className="goal-card-banner" src={doc.Banner} alt="" />
            <div className="goalcard-body-div">
                <h2>{doc.Title}</h2>
                <div className="type-container">
                    <img src={icon} alt="" />
                    <p>{type}</p>
                </div>
            </div>
            <div className="button-container">
                <button className="goal-card-button" onClick={updateRoute} >Bekijk</button>
            </div>
        </motion.div>
    )
}

export default GoalCard