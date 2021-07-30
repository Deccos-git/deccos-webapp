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

    // const rules = () => {
    //     const compagnyRules = docs && docs.forEach(doc => {
    //         doc.Rules.map(rule => (
    //              <p>{rule}</p>
    //         ))
    //     })
    //     return compagnyRules
    // }

    return (
        <div className="main">
            <LeftSideBar />
            <motion.div className="article"
            initial="hidden"
            animate="visible"
            variants={variants}>
                {docs && docs.map(doc => (
                    <div className="article-inner-div" key={doc.ID}>
                        <div>
                            <h2>Welkom {username}</h2>
                            <img src={doc.WelcomeHeader} alt="community logo" />  
                        </div>
                         <div dangerouslySetInnerHTML={{ __html: doc.WelcomeText }}></div>
                         <div>
                             <h3>Onze community regels</h3>
                             <ul>
                                {doc.Rules.map(rule => (
                                    <li dangerouslySetInnerHTML={{ __html: rule }}></li>
                                ))}
                             </ul>
                        </div>
                    </div>

                    ))
                }
                  
            </motion.div>
            <RightSideBar />
        </div>
    )
}

export default Start
