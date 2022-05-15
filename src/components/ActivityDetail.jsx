import LeftSideBar from "./LeftSideBar";
import LeftSideBarFullScreen from "./LeftSideBarFullScreen"
import MenuStatus from "../hooks/MenuStatus";
import { useFirestoreID, useFirestoreOutputs } from "../firebase/useFirestore"
import Location from "../hooks/Location"
import { useState, useEffect } from 'react'
import { motion } from "framer-motion"
import penIcon from '../images/icons/pen-icon.png'
import outputIcon from '../images/icons/output-icon.png'
import worldIcon from '../images/icons/world-icon.png'
import goalIcon from '../images/icons/milestone-icon.png'
import { useHistory } from "react-router-dom"
import { client } from "../hooks/Client"

const ActivityDetail = () => {
    const [title, setTitle] = useState('')

    const menuState = MenuStatus()
    const route = Location()[3]
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const history = useHistory()

    const activities = useFirestoreID('Activities', route)
    const outputs = useFirestoreOutputs(route)

    useEffect(() => {

        activities && activities.forEach(activity => {
            setTitle(activity.Activity)
        })
    }, [activities])

  return (
    <div className="main">
        <LeftSideBar />
        <LeftSideBarFullScreen/>
        <div className="card-overview goal-detail-container" style={{display: menuState}}>
            {activities && activities.map(activity => (
                <motion.div className="article" key={activity.ID}>
                    <img src={activity.Banner} alt="" className='goal-detail-banner' />
                    <div className="list-inner-container">
                        <div className='activity-meta-title-container'>
                            <h2>{activity.Activity}</h2>
                        </div>
                        <div className='activity-meta-title-container'>
                            <img src={goalIcon} alt="" />
                            <h3>Doel</h3>
                        </div>
                        <p className='output-seeting-effect'>{activity.Goal}</p>
                        <div className='activity-meta-title-container'>
                            <img src={worldIcon} alt="" />
                            <h3>Impact</h3>
                        </div>
                        <p className='output-seeting-effect'>{activity.Impact}</p>
                        <div className='activity-meta-title-container'>
                            <img src={outputIcon} alt="" />
                            <h3>Outputs</h3>
                        </div>
                        <ul className='output-seeting-effect'>
                            {outputs && outputs.map(output => (
                                <li>{output.Title}</li>
                            ))}
                        </ul>
                    </div>
                    <p>{activity.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                </motion.div>
                ))
            }
            </div>
    </div>
  )
}

export default ActivityDetail