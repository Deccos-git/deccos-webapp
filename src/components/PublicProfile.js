import LeftSideBarPublicProfile from "./LeftSideBarPublicProfile";
import RightSideBar from "./rightSideBar/RightSideBar"
import { useFirestore, useFirestoreID, useFirestoreChatsGroups } from "./../firebase/useFirestore";
import { db, timestamp } from "../firebase/config";
import uuid from 'react-uuid';
import Auth from "../firebase/Auth";
import { client } from "../hooks/Client";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";

const PublicProfile = ({route, auth}) => {

    const history = useHistory()
    const id = uuid()
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    let members = ""
    let roomID = ""
    let room = ""

    // Find doc of chatpartner
    const profiles = useFirestoreID("Users", route.Route)

    // Find chats of auth
    const chats = useFirestoreChatsGroups("Chats", auth.ID )

    // Find chats of auth and chatpartner
    chats && chats.forEach(chat => {
        members = chat.Members
        roomID = chat.ID
    })

    //Create roomname of auth and chatpartner
    profiles && profiles.forEach(profile => {
        room = auth.ID < profile.ID ? auth.ID+'_'+profile.ID : profile.ID+'_'+auth.ID
    })

    // Open chat if chat excists or create a new chat
    const startChat = () => {
        if(members.includes(route.Route)){
            updateRoute(roomID)
        } else if (!members.includes(route.Profile)){
            createChat()
        } else if (members === ""){
            createChat()
        }
    }

    const updateRoute = (ID) => {
        db.collection("Route")
        .doc(route.docid)
        .update({
            Chat: ID,
            Route: ID,
            Channel: "Chat"
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
                route.Profile,
                auth.ID
            ],
            MemberList: [
                route.Profile,
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
                    <div className="profile public-profile-container">
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