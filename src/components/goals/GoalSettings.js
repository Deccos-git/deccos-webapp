import {useFirestore} from "../../firebase/useFirestore"
import { Link } from "react-router-dom";
import { client } from '../../hooks/Client';
import LeftSideBarAuthProfile from "../LeftSideBarAuthProfile"
import RightSideBar from "../rightSideBar/RightSideBar";
import deleteIcon from '../../images/icons/delete-icon.png'
import settingsIcon from '../../images/icons/settings-icon.png'
import { db } from "../../firebase/config";
import plusIcon from '../../images/icons/plus-icon.png'

const GoalSettings = () => {

    const goals = useFirestore("Goals")

    const deleteGoal = (e) => {

        const goalID = e.target.name

        goals && goals.forEach(goal => {
            if(goal.ID === goalID){
                db.collection("Goals")
                .doc(goal.docid)
                .delete()
            }
        })

        console.log(goalID)
    }

    const goalSettings = (e) => {

    }

    return (
        <div className="main">
        <LeftSideBarAuthProfile />
        <div className="profile">
            <div className="divider card-header">
                <h2>Doel instellingen</h2>
                <p>Pas de instellingen van je doelen aan</p>
            </div>
            <div className="divider">
                <h3>Community doelen</h3>
                {goals && goals.map(goal => (
                    <div className="channel-container">
                        <p>{goal.Title}</p>
                        <div className="icon-container">
                            <img src={deleteIcon} name={goal.ID} onClick={deleteGoal} />
                            <img src={settingsIcon} name={goal.ID} onClick={goalSettings} />
                        </div>
                    </div>
                ))}
            </div>
            <div className="divider">
                <h3>Maak een nieuw doel</h3>
                <Link to={`/${client}/AddGoal`} ><img id="plus-icon-goal-settings" src={plusIcon} alt="" /></Link>
            </div>
        </div>
        <RightSideBar />
        </div>
    )
}

export default GoalSettings
