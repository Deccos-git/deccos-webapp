import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "./LeftSideBarAuthProfileFullScreen";
import RightSideBar from "./rightSideBar/RightSideBar"
import { useFirestoreUsers, useFirestore } from "./../firebase/useFirestore";
import { useHistory } from "react-router-dom";
import { client } from '../hooks/Client';
import { db, auth } from "../firebase/config";
import { useState } from "react";
import MenuStatus from "../hooks/MenuStatus";

const Members = () => {
    const [showDeleteButton, setShowDeleteButton] = useState("none")

    const docs = useFirestoreUsers(false)
    const compagnies = useFirestore("CompagnyMeta")
    const history = useHistory()
    const menuState = MenuStatus()
    
    const updateRoute = (e) => {

        const memberID = e.target.id

        history.push(`/${client}/PublicProfile/${memberID}`)
    }

    const showDeleteButtonForAdmin = () => {
        auth.onAuthStateChanged(User =>{
            if(User){
                db.collection("Users")
                .doc(User.uid)
                .onSnapshot(doc => {

                    const admin = doc.data().Admin
                    if(admin === true){
                        setShowDeleteButton("block")
                    } else if (admin === false){
                        setShowDeleteButton("none")
                    }
                })
            }
        })
    }

    showDeleteButtonForAdmin()

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
                <LeftSideBarAuthProfileFullScreen/>
                {compagnies && compagnies.map(compagny => (
                <div className="profile" key={compagny.ID} style={{display: menuState}}>
                    <div className="card-header">
                        <h2>Leden van de community</h2>
                        <p>Bekijk alle {compagny.Members.length} leden van de community</p>
                    </div>
                    {docs && docs.map(doc => (
                        <div id="members-container" key={doc.ID}>
                            <img src={doc.Photo} alt="" id={doc.ID} onClick={updateRoute} />
                            <h3 id={doc.ID} onClick={updateRoute}>{doc.UserName}</h3>
                            <p style={{display: showDeleteButton}} className="userrole-users-delete-button" data-id={doc.docid} onClick={deleteUser}>Verwijderen</p>
                        </div>
                    ))}
                </div>
                  ))}
                <RightSideBar />
            </div>
    )
}

export default Members