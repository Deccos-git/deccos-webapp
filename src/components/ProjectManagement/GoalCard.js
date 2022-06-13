import { client } from '../../hooks/Client';
import { useHistory } from "react-router-dom";
import { motion } from "framer-motion"
import worldIcon from '../../images/icons/world-icon.png'
import houseIcon from '../../images/icons/house-icon.png'
import uuid from 'react-uuid'
import ScrollToTop from "../../hooks/ScrollToTop";

const GoalCard = ({doc}) => {

    const history = useHistory();
    ScrollToTop()

    const variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }

    const updateRoute = () => {

        history.push(`/${client}/GoalDetail/${doc.ID}`)
    }


    return (
       
        <motion.div 
        className="goal-list card" 
        key={doc.ID}
        initial="hidden"
        animate="visible"
        variants={variants}>
            <img className="goal-card-banner" src={doc.Banner} alt="" />
            <div className="goalcard-body-div">
                <h2>{doc.Title}</h2>
            </div>
            <div className="button-container">
                <button className="goal-card-button" onClick={updateRoute} >Bekijk</button>
            </div>
        </motion.div>
    )
}

export default GoalCard