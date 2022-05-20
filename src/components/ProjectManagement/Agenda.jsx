import Calendar from "../Calender"
import LeftSideBar from "../LeftSideBar"
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import MenuStatus from "../../hooks/MenuStatus";
import { useFirestoreTimestamp } from "../../firebase/useFirestore"

const Agenda = () => {

    const menuState = MenuStatus() 

    const tasks = useFirestoreTimestamp('Tasks', 'desc')

    console.log(tasks)
    
  return (
    <div className="main">
        <LeftSideBar />
        <LeftSideBarFullScreen/>
        <div className="main-container" style={{display: menuState}}>
            <div className="page-header">
                <h1>Agenda</h1>
            </div>
            <Calendar events={tasks}/>
        </div>
    </div>
  )
}

export default Agenda