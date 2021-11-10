import {useFirestore} from "../../firebase/useFirestore"
import { Link } from "react-router-dom";
import { client } from '../../hooks/Client';
import LeftSideBarAuthProfile from "../LeftSideBarAuthProfile"
import LeftSideBarAuthProfileFullScreen from "../LeftSideBarAuthProfileFullScreen";
import RightSideBar from "../rightSideBar/RightSideBar";
import deleteIcon from '../../images/icons/delete-icon.png'
import settingsIcon from '../../images/icons/settings-icon.png'
import { db } from "../../firebase/config";
import plusIcon from '../../images/icons/plus-icon.png'
import { useHistory } from "react-router-dom";
import MenuStatus from "../../hooks/MenuStatus";

const GoalSettings = () => {

    const goals = useFirestore("Goals")

    const history = useHistory();
    const menuState = MenuStatus()

    const goalSettings = (e) => {

        const id = e.target.dataset.id

        history.push(`/${client}/GoalSettingsDetail/${id}`)

    }

    return (
        <div className="main">
        <LeftSideBarAuthProfile />
        <LeftSideBarAuthProfileFullScreen/>
        <div className="profile profile-auth-profile" style={{display: menuState}}>
            <div className="settings-inner-container">
                <div className="divider card-header">
                    <h1>Doelen</h1>
                    <p>Pas de instellingen aan de doelen aan</p>
                </div>
                <div className="divider">
                    <h3>Community doelen</h3>
                    {goals && goals.map(goal => (
                        <div className="channel-container">
                            <p>{goal.Title}</p>
                            <div className="icon-container">
                                <img src={settingsIcon} data-id={goal.ID} onClick={goalSettings} />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="divider">
                    <h3>Maak een nieuw doel</h3>
                    <Link to={`/${client}/AddGoal`} ><img id="plus-icon-goal-settings" src={plusIcon} alt="" /></Link>
                </div>
            </div>
        </div>
        <RightSideBar />
        </div>
    )
}

export default GoalSettings
