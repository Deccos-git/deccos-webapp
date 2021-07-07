import {useFirestore} from "../firebase/useFirestore"
import { motion } from "framer-motion"

const Start = () => {

    const docs  = useFirestore("CompagnyMeta")

    const variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }

    return (
        <motion.div className="article"
        initial="hidden"
        animate="visible"
        variants={variants}>
            {docs && docs.map(doc => (
                <div className="article-inner-div" key={doc.ID}>
                    <h2>Welkom bij {doc.CommunityName}</h2>
                    <img src={doc.WelcomeHeader} alt="community logo" />  
                    <p>{doc.WelcomeText}</p>
                </div>
                ))
            }
        </motion.div>
    )
}

export default Start
