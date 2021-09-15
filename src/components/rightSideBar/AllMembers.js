import { useFirestore } from "../../firebase/useFirestore"
import { client } from '../../hooks/Client';
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

const AllMembers = () => {

    const docs = useFirestore("CompagnyMeta")
    const history = useHistory()

    const updateRoute = (e) => {

        const memberID = e.target.id

        history.push(`/${client}/PublicProfile/${memberID}`)
    }

    return (
        <div className="all-members-container">
            {docs && docs.map(doc => (
                <div key={doc.ID}>
                    <h3>Leden van {doc.CommunityName}</h3>
                    {doc.Members.map(member => (
                             <div className="all-members-member-container" key={member.ID}>
                                <img src={member.Photo} alt="" id={member.ID} onClick={updateRoute} />
                                <p id={member.ID} onClick={updateRoute}>{member.UserName}</p>
                            </div>
                       
                    ))}     
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
