import { useFirestoreID, useFirestoreMessages, useFirestoreActivities } from "../../firebase/useFirestore"
import { motion } from "framer-motion"
import worldIcon from '../../images/icons/world-icon.png'
import houseIcon from '../../images/icons/house-icon.png'
import MessageBar from "../Community/MessageBar"
import LeftSideBar from "../LeftSideBar"
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import RightSideBar from "../rightSideBar/RightSideBar"
import { useHistory } from "react-router-dom"
import { client } from "../../hooks/Client"
import { useContext, useState, useEffect } from 'react';
import { Auth } from '../../StateManagment/Auth';
import Location from "../../hooks/Location"
import MenuStatus from "../../hooks/MenuStatus";
import Reaction from "../Community/Reaction"

const GoalDetail = () => {
    const [auth] = useContext(Auth)
    const [progression, setProgression] = useState(0)

    const route = Location()[3]
    const menuState = MenuStatus()
    const history = useHistory()

    const docs = useFirestoreID("Goals", route)
    const reactions = useFirestoreMessages("Messages", route)
    const activities = useFirestoreActivities(route)

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    // Calculate totalprogression

    const totalProgressionArray = []

    useEffect(() => {
        activities && activities.forEach(activity => {
            const progress = activity.Progression

            const maxProgression = activities.length

            const fractualProgression = progress/maxProgression

            totalProgressionArray.push(fractualProgression)

            const totalProgression = totalProgressionArray.reduce((a, b) => a + b, 0)

            setProgression(totalProgression)

        })
    }, [activities])

    const showContributionsGoal = () => {

        docs && docs.forEach(doc => {
            history.push(`/${client}/Contributions/${doc.ID}`)
        })
    }

    const activityGoalLink = (e) => {
        const id = e.target.dataset.id 
        history.push(`/${client}/ActivityGoal/${id}`)
    }

    const ProgressionBar = () => {
        return(
        <div className='progression-container-goal-detail'>
            <p>Voortgang {Math.trunc(progression)}%</p>
            <div className='progressionbar-outer-bar'>
                <div className='progressionbar-completed' style={{width: `${progression}%`}}></div>
            </div>
        </div>
        )
    }

    return (
        <div className="main">
            <LeftSideBar />
            <LeftSideBarFullScreen/>
            <div className="card-overview goal-detail-container" style={{display: menuState}}>
            {docs && docs.map(doc => (
                <motion.div className="article" key={doc.id}>
                    <img src={doc.Banner} alt="" className='goal-detail-banner' />
                    <div className="list-inner-container">
                        <h2>{doc.Title}</h2>
                        <h3>Voortgang</h3>
                        <ProgressionBar/>
                        <button className='button-simple' data-id={doc.ID} onClick={activityGoalLink}>Details</button>
                        <h3>SDG</h3>
                        <p>{doc.SDG}</p>
                        <h3>Impact op maatschappij</h3>
                        <p>{doc.ImpactSociety}</p>
                        <h3>Impact op doelgroep</h3>
                        <p>{doc.ImpactTargetgroup}</p>
                        <div className='like-count-container'>
                            <img src={worldIcon} alt="" onClick={showContributionsGoal} />
                            <p className='notification-counter-small'>{doc.Contributions.length}</p>
                        </div>
                    </div>
                </motion.div>
                ))
            }

            <p> --- Reacties ---</p>
            <MessageBar route={route} auth={auth}/>
            <div className="reaction-area">
                {reactions && reactions.map(reaction => (
                    <Reaction message={reaction}/>
                ))}
            </div>
            </div>
            <RightSideBar />
        </div>
    )
}

export default GoalDetail
