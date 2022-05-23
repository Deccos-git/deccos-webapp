import Calendar from "../Calender"
import LeftSideBar from "../LeftSideBar"
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import MenuStatus from "../../hooks/MenuStatus";
import { useFirestoreTimestamp } from "../../firebase/useFirestore"
import Premium from "../../hooks/Premium";
import PremiumNotice from "../PremiumNotice";

const Agenda = () => {

    const menuState = MenuStatus()
    const premium = Premium() 

    const tasks = useFirestoreTimestamp('Tasks', 'desc')
    
  return (
    <div className="main">
        <LeftSideBar />
        <LeftSideBarFullScreen/>
        <div className="main-container" style={{display: menuState}}>
            <div className="page-header">
                <h1>Agenda</h1>
            </div>
            <div id='agenda-calender-container' style={{display: premium ? 'flex' : 'none'}}>
              <Calendar events={tasks}/>
            </div>
            <div style={{display: premium ? 'none' : 'flex'}}>
                <PremiumNotice/>
            </div>
        </div>
    </div>
  )
}

export default Agenda