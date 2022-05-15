import {useFirestore} from "../firebase/useFirestore"
import LeftSideBar from "./LeftSideBar"
import LeftSideBarFullScreen from "./LeftSideBarFullScreen"
import MenuStatus from "../hooks/MenuStatus";

const Support = () => {

    const menuState = MenuStatus()

  return (
    <div className="main">
        <LeftSideBar />
        <LeftSideBarFullScreen/>
        <div className="card-overview" style={{display: menuState}}>
            <div className="page-header">
                <h1>Ondersteuning</h1>
            </div>
        </div>
    </div>
  )
}

export default Support