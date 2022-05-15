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

const Impacthub = () => {

    const menuState = MenuStatus()
    const history = useHistory()

    const compagnies = useFirestore('CompagnyMeta')

  return (
    <div className="main">
    <LeftSideBar />
    <LeftSideBarFullScreen/>
    <div className="main-container" style={{display: menuState}}>
        <div className='page-header'>
            <h1>Impactclub</h1>
                <div className='edit-icon-header-container'>
                    <NavLink activeClassName='active' to={`/${client}/Impactclub`}>
                        <img src={penIcon} alt="" />
                    </NavLink>
                </div>
        </div>
        <div className='card-container milestone-card-container'>
            {compagnies && compagnies.map(comp => (
                <div className='impactclub-banner-container'>
                    <img src={comp.ImpactBanner} alt="" />
                </div>
            ))}
    
        </div>
    </div>
</div>
  )
}

export default Impacthub