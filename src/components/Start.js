import {useFirestore} from "../firebase/useFirestore"
import { motion } from "framer-motion"
import LeftSideBar from "./LeftSideBar"
import LeftSideBarFullScreen from "./LeftSideBarFullScreen"
import RightSideBar from "./rightSideBar/RightSideBar"
import { useContext } from "react"
import { Auth } from '../StateManagment/Auth';
import MenuStatus from "../hooks/MenuStatus";

const Start = () => {
    const [authO] = useContext(Auth)

    const docs  = useFirestore("CompagnyMeta")
    const menuState = MenuStatus()

    const username = authO.ForName

    const variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }

    return (
        <div className="main">
            <LeftSideBar />
            <LeftSideBarFullScreen/>
            <motion.div className="article"
            initial="hidden"
            animate="visible"
            variants={variants}
            style={{display: menuState}}>
                {docs && docs.map(doc => (
                    <div className="article-inner-div" key={doc.ID}>
                        <div className="start-banner">
                            <h2>Hallo {username}</h2>
                            <img src={doc.WelcomeHeader} alt="community logo" />  
                        </div>
                         <div dangerouslySetInnerHTML={{ __html: doc.WelcomeText }}></div>
                         <div>
                             <h3>Onze community regels</h3>
                             <ul>
                                {doc.Rules.map(rule => (
                                    <li dangerouslySetInnerHTML={{ __html: rule }} key={rule.ID}></li>
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
