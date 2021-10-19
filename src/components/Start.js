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
    
    let communityTitle = null

    docs && docs.forEach(doc => {
        if(doc.Rules.length === 0){
            return
        } else if(doc.Rules.length > 0){
            communityTitle = "Onze community regels"
        }
    })

    return (
        <div className="main">
            <LeftSideBar />
            <LeftSideBarFullScreen/>
            <motion.div
            initial="hidden"
            animate="visible"
            variants={variants}
            >
                <div className="card-overview" style={{display: menuState}}>
                    <div className="page-header">
                        <h1>Start hier</h1>
                    </div>
                    <div className="article">
                    {docs && docs.map(doc => (
                        <div className="article-inner-div" key={doc.ID}>
                            <div className="start-banner">
                                <h2>Hallo {username}</h2>
                                <img id='start-image' src={doc.WelcomeHeader} alt="community logo" />  
                            </div>
                            <div dangerouslySetInnerHTML={{ __html: doc.WelcomeText }}></div>
                            <div>
                                <h3>{communityTitle}</h3>
                                <ul>
                                    {doc.Rules.map(rule => (
                                        <li dangerouslySetInnerHTML={{ __html: rule }} key={rule.ID}></li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        ))
                    }
                </div>   
               </div>
            </motion.div>
            <RightSideBar />
        </div>
    )
}

export default Start
