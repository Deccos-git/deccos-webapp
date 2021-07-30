import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./rightSideBar/RightSideBar"
import { useFirestoreID } from "../firebase/useFirestore"
import { db } from "../firebase/config"
import firebase from "firebase"
import { useHistory } from "react-router"
import { client } from '../hooks/Client';

const GroupLanding = ({route, auth}) => {

    const groups = useFirestoreID("Groups", route.Group)
    const history = useHistory()

    const redirectMemberToGroup = () => {
        groups && groups.forEach(group => {
                if(group.MemberList.includes(auth.ID)){
                    history.push(`/${client}/Group`)
                } else {
                    return
                }
        })
    }

    redirectMemberToGroup()

    const newMember = {
        ID: auth.ID,
        UserName: auth.UserName,
        Photo: auth.Photo
    }

    const subscribeToGroup = () => {
        groups && groups.forEach(group => {
            db.collection("Groups")
            .doc(group.docid)
            .update({
                Members: firebase.firestore.FieldValue.arrayUnion(newMember)
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

        const docRef = db.collection("Route")
        .doc(route.docid)
        docRef.update({
            Group: groupID,
            Route: groupID
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
