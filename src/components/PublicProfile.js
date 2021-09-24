import LeftSideBarPublicProfile from "./LeftSideBarPublicProfile";
import RightSideBar from "./rightSideBar/RightSideBar"
import { useFirestoreUser, useFirestoreChats, useFirestoreIntroductions } from "./../firebase/useFirestore";
import { db, timestamp } from "../firebase/config";
import uuid from 'react-uuid';
import { client } from "../hooks/Client";
import { useHistory } from "react-router-dom";
import { useContext } from 'react';
import { Auth } from '../StateManagment/Auth';
import Location from "../hooks/Location"

const PublicProfile = () => {
    const [authO] = useContext(Auth)

    const history = useHistory()
    const route = Location()[3]
    const id = uuid()
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const profiles = useFirestoreUser(route)
    const introductions = useFirestoreIntroductions("Introductions", route)

    let members = ""
    let chatID = ""
    let room = ""

    function createRoomName(){

        profiles && profiles.forEach(profile => {
            room = authO.ID < profile.ID ? authO.ID+'_'+profile.ID : profile.ID+'_'+authO.ID
        })
    } createRoomName()

    console.log(room)

    //Find chatroom

    const chats = useFirestoreChats(room)

    console.log(chats)

    


    function startChat(){

        if(chats.length === 0){
            createChat()
        } else if (chats.length === 1){
            chats.forEach(chat => {
                history.push(`/${client}/ChatRoom/${chat.ID}`)
            })
        }
    } 

    const createChat = () => {
        db.collection("Chats")
        .doc()
        .set({
            ID: id,
            Room: room,
            Members: [
                route,
                authO.ID
            ],
            MemberList: [
                route,
                authO.ID
            ],
            Timestamp: timestamp,
            Compagny: client,
            Messages: 0
        })
        .then(() => {
            history.push(`/${client}/ChatRoom/${id}`)
        })
    }

    const showContributions = (e) => {

        const id = e.target.dataset.id
        
        history.push(`/${client}/Contributions/${id}`)

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
                        <div>
                            {introductions && introductions.map(introduction => (
                            <p>{introduction.Body}</p>
                            ))}
                        </div>
                    </div>
                ))}
                <RightSideBar />
            </div>
    )
}

export default PublicProfile