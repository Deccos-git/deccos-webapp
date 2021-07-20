import LeftSideBarPublicProfile from "./LeftSideBarPublicProfile";
import RightSideBar from "./rightSideBar/RightSideBar"
import { useFirestore, useFirestoreID, useFirestoreChats } from "./../firebase/useFirestore";
import { db, timestamp } from "../firebase/config";
import uuid from 'react-uuid';
import Auth from "../firebase/Auth";
import { client } from "../hooks/Client";
import { useHistory } from "react-router-dom";

const PublicProfile = ({route}) => {

    const auth = Auth()
    const history = useHistory()

    const users = useFirestoreID("Users", route.Route)

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    let room = ""
    let userName = ""

    users && users.forEach(user => {
        room = auth.UserName < user.UserName ? auth.UserName+'_'+user.UserName : user.UserName+'_'+auth.UserName

        userName = user.UserName

    })

    console.log(room === route.Room)

    const startChat = () => {

        if(room != route.Room){

            db.collection("Chats")
            .doc()
            .set({
                ID: route.Route,
                Room: room,
                Members: [
                    userName,
                    auth.UserName
                ],
                Timestamp: timestamp,
                Compagny: client,
                Messages: 0
            })
            .then(() => {
                const docRef = db.collection("Route")
                .doc(route.docid)

                users && users.forEach(user => {
                    docRef.update({
                        Route: route.Route,
                        User: user.UserName,
                        Room: room,
                        Members: [
                            userName,
                            auth.UserName
                        ],

                    })
                    .then(() => {
                        history.push(`/${client}/ChatRoom`)
                    })
                })
            })
        } else {
            const docRef = db.collection("Route")
            .doc(route.docid)

            users && users.forEach(user => {
                docRef.update({
                    Route: route.Route,
                    User: user.UserName,
                    Room: room,
                    Members: [
                        userName,
                        auth.UserName
                    ],

                })
                .then(() => {
                    history.push(`/${client}/ChatRoom`)
                })
            })
        }
    }

    return (
            <div className="main">
                <LeftSideBarPublicProfile />
                {users && users.map(user => (
                    <div className="profile public-profile-container">
                        <div className="divider ">
                            <img className="public-profile-photo" src={user.Photo} alt="" />  
                            <h2>{user.UserName}</h2>
                            <p className="timestamp-public-profile">Lid sinds {user.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                            <div className="button-container">
                                <button onClick={startChat}>Chatten</button>
                            </div>
                        </div>
                        <div className="divider" >
                            <p>{user.Description}</p>
                        </div>
                    </div>
                ))}
              
                <RightSideBar />
            </div>
    )
}

export default PublicProfile