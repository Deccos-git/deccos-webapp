import LeftSideBar from "./LeftSideBar"
import LeftSideBarFullScreen from "./LeftSideBarFullScreen"
import RightSideBar from "./rightSideBar/RightSideBar"
import MenuStatus from "../hooks/MenuStatus";
import { useFirestore } from "../firebase/useFirestore";

const Tasks = () => {
    const tasks = useFirestore('Tasks')
    const menuState = MenuStatus()


    return (
        <div className="main">
            <LeftSideBar />
            <LeftSideBarFullScreen/>
            <div className="card-overview" style={{display: menuState}}>
                <div className="page-header">
                    <h1>Taken</h1>
                </div>
                <div>
                {tasks && tasks.map(task => (
                    <div>
                        <h2>{task.Task}</h2>
                    </div>
                ))}
                </div>
            </div>
            <RightSideBar />
        </div>
    )
}

export default Tasks
