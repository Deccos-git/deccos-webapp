import { useFirestoreUsersApproved, useFirestore } from "../../firebase/useFirestore"
import { client } from '../../hooks/Client';
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

const AllMembers = () => {

    const users = useFirestoreUsersApproved(false, true)
    const compagny = useFirestore("CompagnyMeta")
    const history = useHistory()

    let communityName = null

    compagny && compagny.forEach(comp => {
        communityName = comp.CommunityName
    })

    const updateRoute = (e) => {

        const memberID = e.target.id

        history.push(`/${client}/PublicProfile/${memberID}`)
    }

    return (
        <div className="all-members-container">
            <h3>Leden van {communityName}</h3>
            {users && users.map(user => (
                <div key={user.ID}>
                    <div className="all-members-member-container">
                        <img src={user.Photo} alt="" id={user.ID} onClick={updateRoute} />
                        <p id={user.ID} onClick={updateRoute}>{user.UserName}</p>
                    </div>   
                </div>
            ))} 
            <div>
                <Link to={`/${client}/Members`}>
                    <p>Bekijk alle leden</p>
                </Link>
            </div> 
        </div>
    )
}

export default AllMembers
