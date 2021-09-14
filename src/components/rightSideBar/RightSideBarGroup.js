import { useHistory } from "react-router-dom";
import { db } from '../../firebase/config';
import { client } from '../../hooks/Client';
import { useContext } from 'react';
import { Route } from '../../StateManagment/Route';
import { useFirestoreID } from "../../firebase/useFirestore";

const RightSideBarGroup = () => {
    const [route, setRoute] = useContext(Route)

    const history = useHistory()
    const groups = useFirestoreID("Groups", route)

    const updateRoute = (e) => {
        const userID = e.target.dataset.id

        setRoute(userID)

        history.push(`/${client}/PublicProfile`)
   
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
