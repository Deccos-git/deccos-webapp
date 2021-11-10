import LeftSideBar from "./LeftSideBar"
import LeftSideBarFullScreen from "./LeftSideBarFullScreen"
import RightSideBar from "./rightSideBar/RightSideBar"
import MenuStatus from "../hooks/MenuStatus";
import { useFirestore } from "../firebase/useFirestore";

const Activitites = () => {

    const activities = useFirestore('Activities')

    const menuState = MenuStatus()
    return (
        <div className="main">
            <LeftSideBar />
            <LeftSideBarFullScreen/>
            <div className="card-overview" style={{display: menuState}}>
                <div className="page-header">
                    <h1>Activiteiten</h1>
                </div>
                <div>
                {activities && activities.map(activity => (
                    <div>
                        <h2>{activity.Activity}</h2>
                    </div>
                ))}
                </div>
            </div>
            <RightSideBar />
        </div>
    )
}

export default Activitites
