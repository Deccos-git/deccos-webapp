import LeftSideBarPublicProfile from "./LeftSideBarPublicProfile";
import RightSideBar from "./rightSideBar/RightSideBar"
import { useFirestoreID, useFirestoreChats } from "./../firebase/useFirestore";
import { db, timestamp } from "../firebase/config";
import uuid from 'react-uuid';
import { client } from "../hooks/Client";
import { useHistory } from "react-router-dom";
import { useEffect, useState} from 'react';

const PublicProfile = ({route, auth}) => {

    const history = useHistory()
    const id = uuid()
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const profiles = useFirestoreID("Users", route.Route)

    let members = ""
    let chatID = ""
    let room = ""

    function createRoomName(){

        profiles && profiles.forEach(profile => {
            room = auth.ID < profile.ID ? auth.ID+'_'+profile.ID : profile.ID+'_'+auth.ID
        })
    } createRoomName()

    //Find chatroom
    const chats = useFirestoreChats(room)

    console.log(chats)

    function startChat(){

        if(chats.length === 0){
            createChat()
        } else if (chats.length != 0){
            chats.forEach(chat => {
                updateRoute(chat.ID)
            })
        }
    } 

    const updateRoute = (ID) => {
        db.collection("Route")
        .doc(route.docid)
        .update({
            Route: ID
        })
        .then(() => {
            history.push(`/${client}/ChatRoom`)
        })
    }

    const createChat = () => {
        db.collection("Chats")
        .doc()
        .set({
            ID: id,
            Room: room,
            Members: [
                route.Route,
                auth.ID
            ],
            MemberList: [
                route.Route,
                auth.ID
            ],
            Timestamp: timestamp,
            Compagny: client,
            Messages: 0
        })
        .then(() => {
            updateRoute(id)
        })
    }

    const showContributions = (e) => {

        const id = e.target.dataset.id
        
        db.collection("Route")
            .doc(route.docid)
            .update({
                Route: id
            })

        history.push(`/${client}/Contributions`)

    }

    return (
            <div className="main">
                <LeftSideBarPublicProfile />
                {profiles && profiles.map(profile => (
                    <div className="profile public-profile-container" key={profile.ID}>
                        <div className="divider ">
                            <img className="public-profile-photo" src={profile.Photo} alt="" />  
                            <h2>{profile.UserName}</h2>
                            <p className="contributions-amount-profile" onClick={showContributions} data-id={profile.ID}>{profile.Likes} bijdragen aan doelen</p>
                            <p className="timestamp-public-profile">Lid sinds {profile.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                            <div className="button-container">
                                <button onClick={startChat}>Chatten</button>
                            </div>
                        </div>
                        <div className="divider" >
                            <h4>Over mij</h4>
                            <p dangerouslySetInnerHTML={{__html:profile.About}}></p>
                        </div>
                    </div>
                ))}
                <RightSideBar />
            </div>
    )
}

export default PublicProfile