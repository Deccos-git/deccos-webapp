import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "./LeftSideBarAuthProfileFullScreen";
import RightSideBar from "./rightSideBar/RightSideBar"
import Location from "../hooks/Location"
import { useFirestoreMyEvents } from "../firebase/useFirestore";
import MenuStatus from "../hooks/MenuStatus";
import Calendar from "./Calender";

const MyEvents = () => {

    const route = Location()[3]
    const menuState = MenuStatus()

    console.log(route)

    const events = useFirestoreMyEvents(route)

    console.log(events)

    return (
        <div className="main">
            <LeftSideBarAuthProfile />
            <LeftSideBarAuthProfileFullScreen/>
            <div className="card-overview" style={{display: menuState}}>
                <div className="page-header">
                    <h1>Mijn events</h1>
                </div>
                <div className='task-calendar-container'>
                    <Calendar events={events}/>
                </div>
            </div>
            <RightSideBar />
        </div>
    )
}

export default MyEvents
