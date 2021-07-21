import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import RightSideBar from "./rightSideBar/RightSideBar"
import { useFirestore } from "./../firebase/useFirestore";

const Members = () => {

    const docs = useFirestore("Users")
    const compagnies = useFirestore("CompagnyMeta")

    return (
            <div className="main">
                <LeftSideBarAuthProfile />
                {compagnies && compagnies.map(compagny => (
                <div className="profile">
                    <div className="card-header">
                        <h2>Leden van de community</h2>
                        <p>Bekijk alle {compagny.Members.length} leden van de community</p>
                    </div>
                    {docs && docs.map(doc => (
                        <div id="members-container" key={doc.ID}>
                            <img src={doc.Photo} alt="" />
                            <h3>{doc.UserName}</h3>
                        </div>
                    ))}
                </div>
                  ))}
                <RightSideBar />
            </div>
    )
}

export default Members