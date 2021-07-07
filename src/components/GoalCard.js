import { client } from '../hooks/Client';
import { Link } from "react-router-dom";
import { motion } from "framer-motion"
import worldIcon from '../images/icons/world-icon.png'
import houseIcon from '../images/icons/house-icon.png'
import uuid from 'react-uuid'

const GoalCard = ({doc}) => {

    const variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }

    let icon, type

    doc.Type === "SDG" ? icon = worldIcon : icon = houseIcon

    doc.Type === "internal" ? type = "Intern" : type = "Sociaal maatschappelijk"

    return (
        <motion.div 
        className="goal-card card" 
        key={uuid()}
        initial="hidden"
        animate="visible"
        variants={variants}>
            <h2>{doc.Title}</h2>
            <p>{doc.Body}</p>
            <div className="type-container">
                <img src={icon} alt="" />
                <p>{type}</p>
            </div>
            
            <Link to={`/${client}/Goal/${doc.ID}`}><button className="goal-card-button" >Bekijk</button></Link>
        </motion.div>
    )
}

export default GoalCard