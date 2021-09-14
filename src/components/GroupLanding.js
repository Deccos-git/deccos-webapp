import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./rightSideBar/RightSideBar"
import { useFirestoreID } from "../firebase/useFirestore"
import { db } from "../firebase/config"
import firebase from "firebase"
import { useHistory } from "react-router"
import { client } from '../hooks/Client';
import { useContext } from 'react';
import { Route } from '../StateManagment/Route';
import { Auth } from '../StateManagment/Auth';

const GroupLanding = () => {
    const [route, setRoute] = useContext(Route)
    const [authO] = useContext(Auth)

    const groups = useFirestoreID("Groups", route)
    const history = useHistory()

    const redirectMemberToGroup = () => {
        groups && groups.forEach(group => {
                if(group.MemberList.includes(authO.ID)){
                    history.push(`/${client}/Group`)
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
                updateRoute(group.ID)
            })
            .then(() => {
                history.push(`/${client}/Group`)
            })
        })
    }

    const updateRoute = (groupID) => {

       setRoute(groupID)
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
