import LeftSideBar from "../LeftSideBar";
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import RightSideBar from "../rightSideBar/RightSideBar"
import Location from "../../hooks/Location"
import MenuStatus from "../../hooks/MenuStatus";
import { useHistory } from "react-router-dom";
import { client } from "../../hooks/Client"
import plusIcon from '../../images/icons/plus-icon.png'
import { useFirestore, useFirestoreResults } from "../../firebase/useFirestore"
import { db } from "../../firebase/config.js"
import resultsIcon from '../../images/icons/results-icon.png'
import activityIcon from '../../images/icons/activity-icon.png'
import penIcon from '../../images/icons/pen-icon.png'
import { NavLink } from "react-router-dom";
import sroiIcon from '../../images/icons/sroi-icon.png'
import attributionIcon from '../../images/icons/attribution-icon.png'
import weightIcon from '../../images/icons/weight-icon.png'
import horizonIcon from '../../images/icons/horizon-icon.png'
import selectedIcon from '../../images/icons/selected-icon.png'

const SROI = () => {

    const menuState = MenuStatus()
    const history = useHistory()

    const SROIs = useFirestore('SROIs')

    const TotalSROI = ({output, sroi, amount}) => {

        const results = useFirestoreResults(sroi.OutputID)

        return(
            <div>
                <p className='questionnaire-results-container'>
                    <b>
                    {results.length} (aantal {output}) x €{amount} (bedrag per persoon per jaar x deadweight x attributie x tijdshorizon) =
                    </b>
                </p>
                <p className='questionnaire-results-container'>€{results.length*amount}</p>
            </div>
        )
    }

  return (
    <div className="main">
    <LeftSideBar />
    <LeftSideBarFullScreen/>
    <div className="main-container" style={{display: menuState}}>
        <div className='page-header'>
            <h1>SROI</h1>
                <div className='edit-icon-header-container'>
                    <NavLink activeClassName='active' to={`/${client}/AddSROI`}>
                        <img src={penIcon} alt="" />
                    </NavLink>
                </div>
        </div>
        <div className='card-container milestone-card-container'>
        {SROIs && SROIs.map(sroi => (
                <div className='instrument-card'>
                    <div className='task-detail-inner-container'>
                        <h2>SROI van output: {sroi.Output}</h2>
                        <div className='activity-meta-title-container'>
                            <img src={selectedIcon} alt="" />
                            <h3>Type</h3>
                        </div>
                        <p className='questionnaire-results-container'>{sroi.Type}</p>
                        <div className='activity-meta-title-container'>
                            <img src={sroiIcon} alt="" />
                            <h3>Bedrag per persoon per jaar</h3>
                        </div>
                        <p className='questionnaire-results-container'>€{sroi.Amount}</p>
                        <div className='activity-meta-title-container'>
                            <img src={weightIcon} alt="" />
                            <h3>Deadweight</h3>
                        </div>
                        <p className='questionnaire-results-container'>{sroi.Deadweight}</p>
                        <div className='activity-meta-title-container'>
                            <img src={attributionIcon} alt="" />
                            <h3>Attributie</h3>
                        </div>
                        <p className='questionnaire-results-container'>{sroi.Attribution}</p>
                        <div className='activity-meta-title-container'>
                            <img src={horizonIcon} alt="" />
                            <h3>Tijdshorizon</h3>
                        </div>
                        <p className='questionnaire-results-container'>{sroi.Timehorizon}</p>
                        <div className='activity-meta-title-container'>
                            <img src={horizonIcon} alt="" />
                            <h3>Totale SROI</h3>
                        </div>
                        <TotalSROI output={sroi.Output} sroi={sroi} amount={sroi.Amount*sroi.Deadweight*sroi.Attribution*sroi.Timehorizon}/>
                    </div>
                </div>
            ))}
        </div>
    </div>
</div>
  )
}

export default SROI