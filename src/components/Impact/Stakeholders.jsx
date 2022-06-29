import {useFirestore} from "../../firebase/useFirestore"
import LeftSideBar from "../LeftSideBar"
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import MenuStatus from "../../hooks/MenuStatus";
import arrowUpIcon from '../../images/icons/arrow-up-icon-white.png'
import penIcon from '../../images/icons/pen-icon-white.png'
import { NavLink, Link } from "react-router-dom";
import { client } from '../../hooks/Client';
import NoContentNotice from "../../hooks/NoContentNotice";
import ScrollToTop from "../../hooks/ScrollToTop";

const Stakeholders = () => {
    const menuState = MenuStatus()
    ScrollToTop()

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
                    <div className='list-container list-container-stakeholder-management-page' style={{display: stakeholders.length === 0 ? 'none' : 'flex'}}>
                    <div className='table-container'>
                        <table>
                            <tr>
                                <th>CATEGORIE</th>
                                <th>ORGANISATIE</th>
                                <th>CONTACTPERSOON</th>
                                <th>WIJZE VAN DIALOOH</th>
                                <th>FREQUENTIE</th>
                                <th>GESPREKSONDERWERP</th>
                            </tr>
                            {stakeholders && stakeholders.map(stakeholder => (
                                <tr key={stakeholder.ID}>
                                    <td>
                                        <p>{stakeholder.Categorie}</p>
                                    </td>
                                    <td>
                                        <p>{stakeholder.Organisation} </p>
                                    </td>
                                    <td>
                                        <p>{stakeholder.Name}</p>
                                    </td>
                                    <td>
                                        <p>{stakeholder.Dialog}</p>
                                    </td>
                                    <td>
                                        <p>{stakeholder.Frequention}</p>
                                    </td>
                                    <td>
                                        <p>{stakeholder.Subject}</p>
                                    </td>
                                </tr>
                            ))}
                        </table>
                        </div>
                    </div>
                </div>
                {NoContentNotice(stakeholders, 'StakeholderAnalysis')}
            </div>
        </div>
    )
}

export default Stakeholders
