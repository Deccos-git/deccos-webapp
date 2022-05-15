import LeftSideBar from "../LeftSideBar";
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import Location from "../../hooks/Location"
import MenuStatus from "../../hooks/MenuStatus";
import { useHistory } from "react-router-dom";
import { client } from "../../hooks/Client"
import plusIcon from '../../images/icons/plus-icon.png'
import { useFirestore, useFirestoreResults } from "../../firebase/useFirestore"
import { db } from "../../firebase/config.js"
import penIcon from '../../images/icons/pen-icon.png'
import { NavLink } from "react-router-dom";

const ResearchSettings = () => {

    const menuState = MenuStatus()
    const history = useHistory()

  return (
    <div className="main">
    <LeftSideBar />
    <LeftSideBarFullScreen/>
    <div className="main-container" style={{display: menuState}}>
        <div className='page-header'>
            <h1>Onderzoeken</h1>
                <div className='edit-icon-header-container'>
                    <NavLink activeClassName='active' to={`/${client}/Research`}>
                        <img src={penIcon} alt="" />
                    </NavLink>
                </div>
        </div>
        <div className='card-container milestone-card-container'>
    
        </div>
    </div>
</div>
  )
}

export default ResearchSettings