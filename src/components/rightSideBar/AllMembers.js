import { useFirestore } from "../../firebase/useFirestore"
import { client } from '../../hooks/Client';
import { Link } from "react-router-dom";

const AllMembers = () => {

    const docs = useFirestore("CompagnyMeta")

    return (
        <div className="all-members-container">
            {docs && docs.map(doc => (
                <div key={doc.ID}>
                    <h3>Leden van {doc.CommunityName}</h3>
                    {doc.Members.map(member => (
                        <Link to={`/${client}/PublicProfile`} key={member.ID}>
                             <div className="all-members-member-container" >
                                <img src={member.Photo} alt="" />
                                <p>{member.UserName}</p>
                            </div>
                        </Link>
                       
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
