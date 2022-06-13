import {useFirestore} from "../../firebase/useFirestore"
import { Link } from "react-router-dom";
import { client } from '../../hooks/Client';
import LeftSideBar from "../LeftSideBar";
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import deleteIcon from '../../images/icons/delete-icon.png'
import settingsIcon from '../../images/icons/settings-icon.png'
import { db } from "../../firebase/config";
import plusIcon from '../../images/icons/plus-icon.png'
import { useHistory } from "react-router-dom";
import MenuStatus from "../../hooks/MenuStatus";
import ScrollToTop from "../../hooks/ScrollToTop";

const GoalSettings = () => {

    const goals = useFirestore("Goals")

    const history = useHistory();
    const menuState = MenuStatus()
    ScrollToTop()
    

    const goalLink = (e) => {

        const id = e.target.dataset.id

        history.push(`/${client}/GoalSettingsDetail/${id}`)

    }

    return (
        <div className="main">
            <LeftSideBar/>
            <LeftSideBarFullScreen/>
            <div className="main-container" style={{display: menuState}}>
                <div className="page-header">
                    <h1>Impactdoelen</h1>
                </div>
                <div className="card-container" >
                    {goals && goals.map(goal => (
                        <div className="card">
                            <img className="goal-card-banner" src={goal.Banner} alt="" />
                            <div className="goalcard-body-div">
                                <h2>{goal.Title}</h2>
                            </div>
                            <div className="button-container">
                                <button className="goal-card-button" data-id={goal.ID} onClick={goalLink}>Bekijk</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default GoalSettings
