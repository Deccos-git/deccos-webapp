import { useFirestoreID, useFirestoreMessages, useFirestoreActivities } from "../../firebase/useFirestore"
import { motion } from "framer-motion"
import penIcon from '../../images/icons/pen-icon.png'
import worldIcon from '../../images/icons/world-icon.png'
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
import leafIcon from '../../images/icons/leaf-icon.png'
import newUserIcon from '../../images/icons/new-user-icon.png'
import groupIcon from '../../images/icons/group-icon.png'
import preconditionsIcon from '../../images/icons/preconditions-icon.png'
import externalFactorsIcon from '../../images/icons/external-factors-icon.png'

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


    const activityGoalLink = (e) => {
        const id = e.target.dataset.id 
        history.push(`/${client}/ActivityGoal/${id}`)
    }

    const goalTitleSettingsLink = (e) => {
        const id = e.target.dataset.id 
        history.push(`/${client}/GoalTitle/${id}`)
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
                        <div className='activity-meta-title-container'>
                            <h2>{doc.Title}</h2>
                            <img className='settings-icon' src={penIcon} data-id={doc.ID} alt="" onClick={goalTitleSettingsLink} />
                        </div>
                        <div className='activity-meta-title-container'>
                            <img src={groupIcon} alt="" />
                            <h3>Doelgroep</h3>
                            <img className='settings-icon' src={penIcon} alt="" />
                        </div>
                        <p className='output-seeting-effect'>{doc.Targetgroup}</p>
                        <div className='activity-meta-title-container'>
                            <img src={newUserIcon} alt="" />
                            <h3>Impact op doelgroep</h3>
                            <img className='settings-icon' src={penIcon} alt="" />
                        </div>
                        <p className='output-seeting-effect'>{doc.ImpactTargetgroup}</p>
                         <div className='activity-meta-title-container'>
                            <img src={leafIcon} alt="" />
                            <h3>Impact op maatschappij</h3>
                            <img className='settings-icon' src={penIcon} alt="" />
                        </div>
                        <p className='output-seeting-effect'>{doc.ImpactSociety}</p>
                        <div className='activity-meta-title-container'>
                            <img src={worldIcon} alt="" />
                            <h3>Bijdrage aan SDG's</h3>
                            <img className='settings-icon' src={penIcon} alt="" />
                        </div>
                        {doc.SDG && doc.SDG.map(sdg => (
                            <p className='output-seeting-effect'>{sdg}</p>
                        ))}
                        <div className='goal-meta-title-container'>
                            <img src={preconditionsIcon} alt="" />
                            <h3>Randvoorwaarden</h3>
                            <img className='settings-icon' src={penIcon} alt="" />
                        </div>
                        <p className='output-seeting-effect'>{doc.Preconditions}</p>
                        <div className='goal-meta-title-container'>
                            <img src={externalFactorsIcon} alt="" />
                            <h3>Externe factoren</h3>
                            <img className='settings-icon' src={penIcon} alt="" />
                        </div>
                        <p className='output-seeting-effect'>{doc.ExternalFactors}</p>
                    </div>
                    <p>{doc.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                </motion.div>
                ))
            }
            </div>
        </div>
    )
}

export default GoalDetail
