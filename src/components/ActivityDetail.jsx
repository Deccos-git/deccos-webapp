import LeftSideBar from "./LeftSideBar";
import LeftSideBarFullScreen from "./LeftSideBarFullScreen"
import MenuStatus from "../hooks/MenuStatus";
import { useFirestoreID, useFirestoreOutputs } from "../firebase/useFirestore"
import Location from "../hooks/Location"
import { client } from "../hooks/Client"
import { motion } from "framer-motion"
import arrowLeftIcon from '../images/icons/arrow-left-icon.png'
import outputIcon from '../images/icons/output-icon.png'
import worldIcon from '../images/icons/world-icon.png'
import goalIcon from '../images/icons/milestone-icon.png'
import { NavLink } from "react-router-dom";
import ScrollToTop from "../hooks/ScrollToTop";

const ActivityDetail = () => {

    const menuState = MenuStatus()
    const route = Location()[3]
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    ScrollToTop()

    const activities = useFirestoreID('Activities', route)
    const outputs = useFirestoreOutputs(route)

  return (
    <div className="main">
        <LeftSideBar />
        <LeftSideBarFullScreen/>
        <div className="main-container" style={{display: menuState}}>
            <NavLink to={`/${client}/Activities`} >
                <div className='back-container'>
                    <img src={arrowLeftIcon} alt="pijl naar links" />
                    <p>Alle activiteiten</p>
                </div>
            </NavLink>
            {activities && activities.map(activity => (
                <motion.div className="article" key={activity.ID}>
                    <div className="list-inner-container">
                        <img className='activity-detail-banner' src={activity.Banner} alt="banner image of activity" />
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