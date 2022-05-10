import {useFirestore} from "../../firebase/useFirestore"
import LeftSideBar from "../LeftSideBar"
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import MenuStatus from "../../hooks/MenuStatus";
import arrowUpIcon from '../../images/icons/arrow-up-icon-white.png'
import penIcon from '../../images/icons/pen-icon.png'
import { NavLink, Link } from "react-router-dom";
import { client } from '../../hooks/Client';

const Stakeholders = () => {
    const menuState = MenuStatus()
    const stakeholders = useFirestore('Stakeholders')

    return (
        <div className="main">
            <LeftSideBar />
            <LeftSideBarFullScreen/>
            <div className="main-container" style={{display: menuState}}>
                <div className="page-header">
                    <h1>Stakeholders</h1>
                    <div className='edit-icon-header-container'>
                        <NavLink activeClassName='active' to={`/${client}/StakeholderAnalysis`}>
                            <img src={penIcon} alt="" />
                        </NavLink>
                    </div>
                </div>
                <div className="card-container">
                    <div className='list-container list-container-stakeholder-management-page'>
                        <div className='list-top-row-container'>
                            <p>CATEGORIE</p>
                            <p>ORGANISATIE</p>
                            <p>CONTACTPERSOON</p>
                        </div>
                        {stakeholders && stakeholders.map(stakeholder => (
                            <div className='list-row-container'>
                                <p>{stakeholder.Categorie}</p>
                                <p>{stakeholder.Organisation} </p>
                                <p>{stakeholder.Name}</p>
                            </div>  
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Stakeholders
