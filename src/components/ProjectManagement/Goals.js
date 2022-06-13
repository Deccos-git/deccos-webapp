import GoalCard from "./GoalCard"
import {useFirestoreTimestamp} from "../../firebase/useFirestore"
import LeftSideBar from "../LeftSideBar"
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import MenuStatus from "../../hooks/MenuStatus";
import penIcon from '../../images/icons/pen-icon.png'
import { NavLink } from "react-router-dom";
import { client } from "../../hooks/Client"
import { useHistory } from "react-router-dom";
import NoContentNotice from "../../hooks/NoContentNotice";
import ScrollToTop from "../../hooks/ScrollToTop";

const Goals = () => {
    const docs  = useFirestoreTimestamp("Goals")
    const menuState = MenuStatus()
    const history = useHistory()
    ScrollToTop()
    
    return (
        <div className="main">
            <LeftSideBar />
            <LeftSideBarFullScreen/>
            <div className="main-container" style={{display: menuState}}>
                <div className="page-header">
                    <h1>Impactdoelen</h1>
                    <div className='edit-icon-header-container'>
                        <NavLink activeClassName='active' to={`/${client}/GoalTitle`}>
                            <img src={penIcon} alt="" />
                        </NavLink>
                    </div>
                </div>
                <div className="card-container">
                    {docs && docs.map(doc => (
                        <GoalCard doc={doc} key={doc.ID} />  
                    ))
                    }
                </div>
                {NoContentNotice(docs, 'GoalTitle')}
            </div>
        </div>
    )
}

export default Goals
