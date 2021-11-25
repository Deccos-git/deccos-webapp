import { useFirestoreChatsGroups } from "../firebase/useFirestore";
import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "./LeftSideBarAuthProfileFullScreen";
import RightSideBar from "./rightSideBar/RightSideBar"
import Location from "../hooks/Location"
import { client } from "../hooks/Client";
import { useHistory } from "react-router-dom";
import MenuStatus from "../hooks/MenuStatus";

const MyGroups = () => {

    const route = Location()[3]
    const history = useHistory()
    const menuState = MenuStatus()

    const groups = useFirestoreChatsGroups("Groups", route)

    const groupDetail = (e) => {
        const id = e.target.dataset.id

        history.push(`/${client}/Group/${id}`)
    }

    return (
        <div className="main">
            <LeftSideBarAuthProfile />
            <LeftSideBarAuthProfileFullScreen/>
            <div className="card-overview" style={{display: menuState}}>
            <div className="page-header">
                <h1>Mijn groepen</h1>
            </div>
            {groups && groups.map(group => (
                <div className="list introductions-list my-message">
                    <div className="introduction-list-inner-container">
                        <h2 data-id={group.ID} onClick={groupDetail}>{group.Room}</h2>
                        <p>Aantal leden: {group.Members.length}</p>
                        <p>Aantal berichten: {group.Messages}</p>
                    </div>
                </div>
            ))}
            </div>
            <RightSideBar />
        </div>
    )
}

export default MyGroups
