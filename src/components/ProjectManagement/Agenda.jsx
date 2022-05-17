import Calendar from "../Calender"
import LeftSideBar from "../LeftSideBar"
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import MenuStatus from "../../hooks/MenuStatus";

const Agenda = () => {

    const menuState = MenuStatus() 
    
  return (
    <div className="main">
        <LeftSideBar />
        <LeftSideBarFullScreen/>
        <div className="main-container" style={{display: menuState}}>
            <div className="page-header">
                <h1>Agenda</h1>
            </div>
            <Calendar/>
        </div>
    </div>
  )
}

export default Agenda