import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "./LeftSideBarAuthProfileFullScreen";
import RightSideBar from "./rightSideBar/RightSideBar"
import { useFirestoreUsersApproved, useFirestore } from "./../firebase/useFirestore";
import { useHistory } from "react-router-dom";
import { client } from '../hooks/Client';
import { db, auth } from "../firebase/config";
import { useState, useContext, useEffect } from "react";
import MenuStatus from "../hooks/MenuStatus";
import { Auth } from '../StateManagment/Auth';
import deleteIcon from '../images/icons/delete-icon.png'

const Members = () => {
    const [authO] = useContext(Auth)
    const [showDeleteButton, setShowDeleteButton] = useState("none")
    const [memberCount, setMemberCount] = useState('')
    const [communityName, setCommunityName] = useState('')

    const docs = useFirestoreUsersApproved(false, true)
    const compagnies = useFirestore("CompagnyMeta")
    const admins = useFirestore('Admins')

    const history = useHistory()
    const menuState = MenuStatus()
    
    const updateRoute = (e) => {

        const memberID = e.target.id

        history.push(`/${client}/PublicProfile/${memberID}`)
    }

    useEffect(() => {
        compagnies && compagnies.forEach(compagny => {
            setCommunityName(compagny.CommunityName)
        })
 
    }, [compagnies])

    useEffect(() => {
        const docArray = []
        docs && docs.forEach(doc => {
            docArray.push(doc)
        })
        setMemberCount(docArray.length)
    }, [docs])

    useEffect(() => {
        const showDeleteButtonForAdmin = () => {
            admins && admins.forEach(admin => {
                if(admin.UserID === authO.ID){
                    setShowDeleteButton("block")
                }
            })
        }
        showDeleteButtonForAdmin()
    }, [admins])

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
                <div className="profile profile-auth-profile" style={{display: menuState}}>
                    <div className="card-header">
                        <h1>Leden</h1>
                        <p>Beheer de leden ({memberCount}) van {communityName}</p>
                    </div>
                    {docs && docs.map(doc => (
                    <div id="members-container" key={doc.ID}>
                        <img src={doc.Photo} alt="" id={doc.ID} onClick={updateRoute} />
                        <h3 id={doc.ID} onClick={updateRoute}>{doc.UserName}</h3>
                        <img src={deleteIcon} alt="" style={{display: showDeleteButton}} className="userrole-users-delete-button" data-id={doc.docid} onClick={deleteUser} />
                    </div>
                      ))}
                </div>
                <RightSideBar />
            </div>
    )
}

export default Members