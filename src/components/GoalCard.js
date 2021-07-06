import { client } from '../hooks/Client';
import { Link } from "react-router-dom";
import { motion } from "framer-motion"

const GoalCard = ({doc}) => {

    const variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }

    return (
        <motion.div 
        className="goal-card card" 
        key={doc.docid}
        initial="hidden"
        animate="visible"
        variants={variants}>
            <h2>{doc.Body}</h2>
            <p>{doc.Type}</p>
            <Link to={`/${client}/Goals/${doc.docid}`}><button>Bekijk</button></Link>
        </motion.div>
    )
}

export default GoalCard