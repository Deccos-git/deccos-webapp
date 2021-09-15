import { useHistory } from "react-router-dom";
import { client } from '../../hooks/Client';
import { useFirestoreID } from "../../firebase/useFirestore";
import Location from "../../hooks/Location"

const RightSideBarGroup = () => {

    const history = useHistory()
    const route = Location()[3]
    const groups = useFirestoreID("Groups", route)

    const updateRoute = (e) => {
        const userID = e.target.dataset.id

        history.push(`/${client}/PublicProfile/${userID}`)
   
    }

    return (
        <div className="right-sidebar">
            {groups && groups.map(group => (
                <div>
                <h3>Leden van {group.Room}</h3>
                {group.Members.map(member => (
                        <div className="all-members-member-container" key={member.ID}>
                            <img src={member.Photo} alt="" data-id={member.ID} onClick={updateRoute} />
                            <p name={member.ID} data-id={member.ID} onClick={updateRoute}>{member.UserName}</p>
                        </div>
                    ))}   
                </div>
            ))}
    </div>
    )
}

export default RightSideBarGroup
