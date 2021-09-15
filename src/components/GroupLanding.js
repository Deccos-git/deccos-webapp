import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./rightSideBar/RightSideBar"
import { useFirestoreID } from "../firebase/useFirestore"
import { db } from "../firebase/config"
import firebase from "firebase"
import { useHistory } from "react-router"
import { client } from '../hooks/Client';
import { useContext } from 'react';
import { Auth } from '../StateManagment/Auth';
import Location from "../hooks/Location"

const GroupLanding = () => {
    const [authO] = useContext(Auth)

    const route = Location()[3]
    const groups = useFirestoreID("Groups", route)
    const history = useHistory()

    const redirectMemberToGroup = () => {
        groups && groups.forEach(group => {
                if(group.MemberList.includes(authO.ID)){
                    history.push(`/${client}/Group/${group.ID}`)
                } else {
                    return
                }
        })
    }

    redirectMemberToGroup()

    const newMember = {
        ID: authO.ID,
        UserName: authO.UserName,
        Photo: authO.Photo
    }

    const subscribeToGroup = () => {
        groups && groups.forEach(group => {
            db.collection("Groups")
            .doc(group.docid)
            .update({
                Members: firebase.firestore.FieldValue.arrayUnion(newMember),
                MemberList: firebase.firestore.FieldValue.arrayUnion(authO.ID)
            })
            .then(() => {
                history.push(`/${client}/Group/${group.ID}`)
            })
        })
    }

    return (
        <div className="main"> 
            <LeftSideBar />
            {groups && groups.map(group => (
                <>
                <div className="profile">
                    <div className="group-landing-container">
                        <h2>{group.Room}</h2>
                        <img src={group.Banner} alt="" />
                        <p>Aantal leden: {group.Members.length}</p>
                        <p>Status: {group.Status}</p>
                    </div>
                    <div className="button-container">
                        <button onClick={subscribeToGroup}>Aanmelden</button>
                    </div>
                </div>
            <RightSideBar /> 
            </> 
            ))}
        </div>
    )
}

export default GroupLanding
