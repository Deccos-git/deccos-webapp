import LeftSideBar from "../LeftSideBar";
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import MenuStatus from "../../hooks/MenuStatus";
import { useFirestore } from "../../firebase/useFirestore"

const Planning = () => {

    const menuState = MenuStatus()

  return (
    <div className="main">
        <LeftSideBar />
        <LeftSideBarFullScreen/>
        <div className="main-container" style={{display: menuState}}>
            <div className='page-header'>
                <h1>Planning</h1>
            </div>
        </div>  
    </div>
  )
}

export default Planning