import { motion } from "framer-motion"

const ActivityCard = ({doc}) => {

    const variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }

    return (
        <motion.div 
        className="activity-card card" 
        key={doc.docid}
        initial="hidden"
        animate="visible"
        variants={variants}
        >
            <h2>{doc.Body}</h2>
        </motion.div>
    )
}

export default ActivityCard
