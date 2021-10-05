import { useFirestoreChatsGroups } from "../firebase/useFirestore";
import LeftSideBarPublicProfile from "./LeftSideBarPublicProfile";
import LeftSideBarPublicProfileFullScreen from "./LeftSideBarPublicProfileFullScreen";
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

        console.log(id)

        history.push(`/${client}/Group/${id}`)
    }

    return (
        <div className="main">
            <LeftSideBarPublicProfile />
            <LeftSideBarPublicProfileFullScreen/>
            <div className="card-overview" style={{display: menuState}}>
            {groups && groups.map(group => (
                <div className="list introductions-list my-message" data-id={group.ID} onClick={groupDetail}>
                    <h2>{group.Room}</h2>
                    <p>Aantal leden: {group.Members.length}</p>
                    <p>Aantal berichten: {group.Messages}</p>
                </div>
            ))}
            </div>
            <RightSideBar />
        </div>
    )
}

export default MyGroups
