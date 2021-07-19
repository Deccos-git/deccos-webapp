import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import RightSideBar from "./rightSideBar/RightSideBar"
import { useFirestore } from "./../firebase/useFirestore";

const Members = () => {

    const docs = useFirestore("Users")
    const compagnies = useFirestore("CompagnyMeta")

    return (
            <div className="main">
                <LeftSideBarAuthProfile />
                <div className="profile">
                    <h2>Leden van de community</h2>
                    <p>Bekijk alle leden van de community</p>
                    {compagnies && compagnies.map(compagny => (
                        <div id="members-total-count-container">
                            <p>Totaal</p>
                            <h4>{compagny.Members.length}</h4>
                        </div>  
                    ))}
                    {docs && docs.map(doc => (
                        <div id="members-container" key={doc.ID}>
                            <img src={doc.Photo} alt="" />
                            <h3>{doc.UserName}</h3>
                        </div>
                    ))}
                </div>
                <RightSideBar />
            </div>
    )
}

export default Members