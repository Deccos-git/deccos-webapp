import { useFirestoreID, useFirestoreMessages} from "../../firebase/useFirestore"
import { motion } from "framer-motion"
import worldIcon from '../../images/icons/world-icon.png'
import houseIcon from '../../images/icons/house-icon.png'
import MessageBar from "../MessageBar"
import LeftSideBar from "../LeftSideBar"
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import RightSideBar from "../rightSideBar/RightSideBar"
import { useHistory } from "react-router-dom"
import { client } from "../../hooks/Client"
import { useContext } from 'react';
import { Auth } from '../../StateManagment/Auth';
import Location from "../../hooks/Location"
import Reaction from "../Reaction"
import MenuStatus from "../../hooks/MenuStatus";

const GoalDetail = () => {
    const [auth] = useContext(Auth)

    const route = Location()[3]
    const menuState = MenuStatus()

    const docs = useFirestoreID("Goals", route)
    const messages  = useFirestoreMessages("Messages", route)
    const history = useHistory()

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    let icon = ""

    docs && docs.forEach(doc => {
        if(doc.Type === "SDG"){
            icon = worldIcon
        } else if (doc.Type === "internal"){
            icon = houseIcon
        }
    })

    const showContributionsGoal = () => {

        docs && docs.forEach(doc => {
            history.push(`/${client}/Contributions/${doc.ID}`)
        })
    }

    return (
        <div className="main">
            <LeftSideBar />
            <LeftSideBarFullScreen/>
            <div className="card-overview goal-detail-container" style={{display: menuState}}>
            {docs && docs.map(doc => (
                <motion.div className="article" key={doc.id}>
                    <img src={doc.Banner} alt="" />
                    <div className="list-inner-container">
                        <h2>{doc.Title}</h2>
                        <h3>SDG</h3>
                        <p>{doc.SDG}</p>
                        <h3>Impact op maatschappij</h3>
                        <p>{doc.ImpactSociety}</p>
                        <h3>Impact op doelgroep</h3>
                        <p>{doc.ImpactTargetgroup}</p>
                        <div className='like-count-container'>
                            <img src={icon} alt="" onClick={showContributionsGoal} />
                            <p className='notification-counter-small'>{doc.Contributions.length}</p>
                        </div>
                    </div>
                </motion.div>
                ))
            }

            <div className="article">
                <h2>Activiteiten</h2>
                <ul>
                    <li>Taak 1</li>
                </ul>

            </div>

            <p> --- Reacties ---</p>
            <MessageBar route={route} auth={auth}/>
            <div className="reaction-area">
                {messages && messages.map(message => ( 
                   <Reaction message={message}/>
                ))}
            </div>
            </div>
            <RightSideBar />
        </div>
    )
}

export default GoalDetail
