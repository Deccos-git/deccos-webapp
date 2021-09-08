import { useHistory } from "react-router-dom";
import { db } from '../../firebase/config';
import { client } from '../../hooks/Client';

const RightSideBarGroup = ({group, route}) => {

    const history = useHistory()

    const updateRoute = (e) => {
        const userID = e.target.dataset.id

        const docRef = db.collection("Route")
        .doc(route.docid)
        docRef.update({
            Route: userID
        })
        .then(() => {
            history.push(`/${client}/PublicProfile`)
        })
    }

    return (
        <div className="right-sidebar">
            <div>
                <h3>Leden van {group.Room}</h3>
                {group.Members.map(member => (
                        <div className="all-members-member-container" key={member.ID}>
                            <img src={member.Photo} alt="" data-id={member.ID} onClick={updateRoute} />
                            <p name={member.ID} data-id={member.ID} onClick={updateRoute}>{member.UserName}</p>
                        </div>
                    ))}   
            </div>
    </div>
    )
}

export default RightSideBarGroup
