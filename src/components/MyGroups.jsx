import { useFirestoreChatsGroups } from "../firebase/useFirestore";
import LeftSideBarPublicProfile from "./LeftSideBarPublicProfile";
import RightSideBar from "./rightSideBar/RightSideBar"
import Location from "../hooks/Location"
import { client } from "../hooks/Client";
import { useHistory } from "react-router-dom";

const MyGroups = () => {

    const route = Location()[3]
    const history = useHistory()

    const groups = useFirestoreChatsGroups("Groups", route)

    const groupDetail = (e) => {
        const id = e.target.dataset.id

        console.log(id)

        history.push(`/${client}/Group/${id}`)
    }

    return (
        <div className="main">
            <LeftSideBarPublicProfile />
            <div className="card-overview">
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
