import { useFirestore } from "../firebase/useFirestore"

const GroupMembers = () => {

    const docs = useFirestore("CompagnyMeta")

    return (
        <div className="all-members-container">
            {docs && docs.map(doc => (
                <div>
                    <h3>Leden van {doc.CommunityName}</h3>
                    {doc.Members.map(member => (
                        <div className="all-members-member-container" key={member.ID}>
                            <img src={member.Photo} alt="" />
                            <p>{member.UserName}</p>
                        </div>
                    ))}     
                </div>
            ))}  
        </div>
    )
}

export default GroupMembers