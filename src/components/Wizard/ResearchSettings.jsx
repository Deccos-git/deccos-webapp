import LeftSideBar from "../LeftSideBar";
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import Location from "../../hooks/Location"
import MenuStatus from "../../hooks/MenuStatus";
import { useHistory } from "react-router-dom";
import { client } from "../../hooks/Client"
import plusIcon from '../../images/icons/plus-icon.png'
import { useFirestore, useFirestoreMeasureMoments} from "../../firebase/useFirestore"
import { db } from "../../firebase/config.js"
import penIcon from '../../images/icons/pen-icon.png'
import { NavLink } from "react-router-dom";
import resultsIcon from '../../images/icons/results-icon.png'
import activityIcon from '../../images/icons/activity-icon.png'
import outputIcon from '../../images/icons/output-icon.png'
import calendarIcon from '../../images/icons/calendar-icon.png'
import titleIcon from '../../images/icons/title-icon.png'

const ResearchSettings = () => {

    const menuState = MenuStatus()
    const history = useHistory()

    const researches = useFirestore('Research')


    const MeasureMoments = ({research}) => {

        const moments = useFirestoreMeasureMoments(research.ID)

        return(
            <div>
                {moments && moments.map(moment => (
                    <div className='measure-moments-inner-container measure-moments-container-research-main-page'>
                        <div className='activity-meta-title-container'>
                            <img src={titleIcon} alt="" />
                            <h4>Titel</h4>
                        </div>
                        <p className='questionnaire-results-container'>{moment.Title}</p>
                        <div className='activity-meta-title-container'>
                            <img src={calendarIcon} alt="" />
                            <h4>Meetmoment</h4>
                        </div>
                        <p className='questionnaire-results-container'>{moment.Moment}</p>
                    </div>
                ))}
            </div>
        )
    }

  return (
    <div className="main">
    <LeftSideBar />
    <LeftSideBarFullScreen/>
    <div className="main-container" style={{display: menuState}}>
        <div className='page-header'>
            <h1>Onderzoeken</h1>
            <div className='edit-icon-header-container'>
                <NavLink activeClassName='active' to={`/${client}/Research`}>
                    <img src={penIcon} alt="" />
                </NavLink>
            </div>
        </div>
        <div className='card-container'>
            {researches && researches.map(research => (
                <div className='instrument-card output-card-container'>
                    <h2>{research.Title}</h2>
                    <div className='task-detail-inner-container'>
                        <div className='activity-meta-title-container'>
                            <img src={outputIcon} alt="" />
                            <h3>Output</h3>
                        </div>
                        <p className='questionnaire-results-container'>{research.OutputTitle}</p>
                        <div className='activity-meta-title-container'>
                            <img src={resultsIcon} alt="" />
                            <h3>Meetmomenten</h3>
                        </div>
                        <MeasureMoments research={research}/>
                    </div>
                </div>
            ))}
        </div>
    </div>
</div>
  )
}

export default ResearchSettings