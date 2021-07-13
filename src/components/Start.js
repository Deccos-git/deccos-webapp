import {useFirestore} from "../firebase/useFirestore"
import { motion } from "framer-motion"
import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./rightSideBar/RightSideBar"
import Auth from "../firebase/Auth"

const Start = () => {

    const docs  = useFirestore("CompagnyMeta")
    const auth = Auth()

    const username = auth.ForName

    const variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }

    return (
        <div className="main">
            <LeftSideBar />
            <motion.div className="article"
            initial="hidden"
            animate="visible"
            variants={variants}>
                {docs && docs.map(doc => (
                    <div className="article-inner-div" key={doc.ID}>
                        <h2>Welkom bij {doc.CommunityName} {username}</h2>
                        <img src={doc.WelcomeHeader} alt="community logo" />  
                        <p>{doc.WelcomeText}</p>
                    </div>
                    ))
                }
            </motion.div>
            <RightSideBar />
        </div>
    )
}

export default Start
