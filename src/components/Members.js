import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import RightSideBar from "./rightSideBar/RightSideBar"
import { useFirestore } from "./../firebase/useFirestore";
import { useHistory } from "react-router-dom";
import { client } from '../hooks/Client';
import { db } from "../firebase/config";

const Members = () => {

    const docs = useFirestore("Users")
    const compagnies = useFirestore("CompagnyMeta")
    const history = useHistory()

    
    const updateRoute = (e) => {

        const memberID = e.target.id

        history.push(`/${client}/PublicProfile/${memberID}`)
    }

    const deleteUser = (e) => {

        const id = e.target.dataset.id

        db.collection("Users")
        .doc(id)
        .update({
            Deleted: true
        })
    }

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
                        <div id="members-container" key={doc.ID} onClick={updateRoute}>
                            <img src={doc.Photo} alt="" id={doc.ID} onClick={updateRoute} />
                            <h3 id={doc.ID} onClick={updateRoute}>{doc.UserName}</h3>
                            <p className="userrole-users-delete-button" data-id={doc.ID} onClick={deleteUser}>Verwijderen</p>
                        </div>
                    ))}
                </div>
                  ))}
                <RightSideBar />
            </div>
    )
}

export default Members