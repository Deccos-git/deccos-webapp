import LeftSideBarPublicProfile from "./LeftSideBarPublicProfile";
import LeftSideBarPublicProfileFullScreen from "./LeftSideBarPublicProfileFullScreen";
import RightSideBar from "./rightSideBar/RightSideBar"
import { useFirestoreUser, useFirestoreIntroductions } from "./../firebase/useFirestore";
import { db, timestamp } from "../firebase/config";
import uuid from 'react-uuid';
import { client } from "../hooks/Client";
import { useHistory } from "react-router-dom";
import { useContext } from 'react';
import { Auth } from '../StateManagment/Auth';
import Location from "../hooks/Location"
import MenuStatus from "../hooks/MenuStatus";

const PublicProfile = () => {
    const [authO] = useContext(Auth)

    const history = useHistory()
    const route = Location()[3]
    const id = uuid()
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const menuState = MenuStatus()

    const profiles = useFirestoreUser(route)
    const introductions = useFirestoreIntroductions("Introductions", route)

    let room = ""

    function createRoomName(){

        profiles && profiles.forEach(profile => {
            room = authO.ID < profile.ID ? authO.ID+'_'+profile.ID : profile.ID+'_'+authO.ID
        })
    } createRoomName()

    console.log(room)

    const findChat = async() => {

        let chats = ""

        await db.collection("Chats")
            .where("Compagny", "==", client)
            .where("Room", "==", room)
            .get()
            .then(querySnapshot => {

                chats = querySnapshot.docs.length

            })

        return chats
    }
    
    const startChat = async () => {

        if(await findChat() === 0){
            createChat()
            console.log("create chat")
        } else if (await findChat() === 1){
            console.log("link chat")
            linkToChat()
        }
    }

    const linkToChat = () => {
        db.collection("Chats")
            .where("Compagny", "==", client)
            .where("Room", "==", room)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {

                    const id = doc.data().ID

                    history.push(`/${client}/ChatRoom/${id}`)

                })
            })
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
                <LeftSideBarPublicProfileFullScreen/>
                {profiles && profiles.map(profile => (
                    <div className="profile public-profile-container" key={profile.ID} style={{display: menuState}}>
                        <div className="divider ">
                            <img className="public-profile-photo" src={profile.Photo} alt="" />  
                            <h2>{profile.UserName}</h2>
                            <p className="contributions-amount-profile" onClick={showContributions} data-id={profile.ID}>{profile.Contributions.length} bijdragen aan doelen</p>
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