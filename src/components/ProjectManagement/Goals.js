import GoalCard from "./GoalCard"
import {useFirestoreTimestamp} from "../../firebase/useFirestore"
import LeftSideBar from "../LeftSideBar"
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import MenuStatus from "../../hooks/MenuStatus";
import penIcon from '../../images/icons/pen-icon.png'
import { NavLink } from "react-router-dom";
import { client } from "../../hooks/Client"
import { useHistory } from "react-router-dom";

const Goals = () => {
    const docs  = useFirestoreTimestamp("Goals")
    const menuState = MenuStatus()
    const history = useHistory()

    const guideLink = () => {
        history.push(`/${client}/GoalTitle`)
    }

    const displayContent = () => {

        setTimeout(() => {
            return docs.length > 0 ? 'none' : 'flex'
        }, 1000)
    }

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
                <div className='empty-page-container' style={{display: displayContent()}}>
                    <h2>Je hebt nog geen doel(en) gesteld.</h2>
                    <div className='button-container-margin-top'>
                        <button onClick={guideLink}>Aan de slag</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Goals
