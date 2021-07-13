import { client } from '../../hooks/Client';
import { Link } from "react-router-dom";
import { motion } from "framer-motion"
import worldIcon from '../../images/icons/world-icon.png'
import houseIcon from '../../images/icons/house-icon.png'
import uuid from 'react-uuid'
import RouterContext from '../../context/RouterContext'
import { useContext } from 'react';

const GoalCard = ({doc}) => {
    const { routerID, setRouterID } = useContext(RouterContext);

    const variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }

    let icon, type

    doc.Type === "SDG" ? icon = worldIcon : icon = houseIcon

    doc.Type === "internal" ? type = "Intern" : type = "Sociaal maatschappelijk"

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    const updateRouterID = (e) => {
        setRouterID(doc.ID)
    }

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
            <div className="user-meta-goal-card">
                <p>Toegevoegd door</p>
                <p className="user-goal-card">{doc.User}</p>
            </div>
            <p>{doc.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
            <Link to={`/${client}/GoalDetail`}><button className="goal-card-button"onClick={updateRouterID} >Bekijk</button></Link>
        </motion.div>
    )
}

export default GoalCard