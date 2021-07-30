import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./rightSideBar/RightSideBar"
import { useFirestoreChatsGroups } from "./../firebase/useFirestore";
import { useHistory } from "react-router-dom";
import { db } from '../firebase/config';
import { client } from '../hooks/Client';
import groupIcon from '../images/icons/group-icon.png'

const ChatGroups = ({auth, route}) => {

    const groups = useFirestoreChatsGroups("Groups", auth.ID)
    const history = useHistory()

   const chatsArray = []

   // Find chats of auth
   const chats = useFirestoreChatsGroups("Chats", auth.ID)

    const partnerMeta = (id) => {

        let userMeta = []

        db.collection("Users")
        .where("ID", "==", id)
        .onSnapshot(querySnapshot => {
            querySnapshot.forEach(doc => {
                userMeta.push({
                    UserName: doc.data().UserName,
                    UserPhoto: doc.data().Photo,
                    UserID: doc.data().ID
                })
            })
        })

        return userMeta
    }

    const messages = (id) => {
        const messagesArray = []

        db.collection("Messages")
        .where("Compagny", "==", client)
        .where("ParentID", "==", id)
        .onSnapshot(querySnapshot => {
            querySnapshot.forEach(doc => {

                const read = doc.data().Read

                if(!read.includes(auth.ID)){
                    messagesArray.push(read)
                }    
            })
        })

        console.log(messagesArray)
        
        return messagesArray
    }

    const chatMeta = () => {
        let partners = ""

        chats && chats.forEach(chat => {
            const members = chat.Members
            members.forEach(member => {
                if(auth.ID != member){
                    partners = partnerMeta(member)
                }
            })
            
            const newMessages = messages(chat.ID).length
            chatsArray.push({
                newMessages,
                partners,
                messages: chat.Messages

            })
        })
    }

    chatMeta()

    console.log(chatsArray)


    chatsArray.forEach(chats => {
        console.log(typeof(chats.partners))
        console.log(chats.partners)
    })

    const DisplayChats = () => {
        
         return chatsArray && chatsArray.map(chats => (
            <div className="chatpartner-meta-container" key={chats.partners.UserID}>
                <div name={""} onClick={updateRoute}>
                    <img src={chats.partners.UserPhoto} alt="" />
                    <p className="chat-overview-username">{chats.partners.UserName}</p>
                </div>
                <p>{chats.messages} berichten</p>
                <p className="new-messages">{chats.newMessages} nieuw</p>
            </div>
         ))
    }

    const updateRoute = (e) => {
        chats && chats.forEach(chat => {
            const docRef = db.collection("Route")
            .doc(route.docid)
            docRef.update({
                Chat: chat.ID,
                Route: chat.ID,
                Channel: "Chats"
            })
            .then(() => {
                history.push(`/${client}/ChatRoom`)
            })
        })
    }

    return (
            <div className="main">
                <LeftSideBar />
                <div className="list">
                    <h2>Chats</h2>
                        <div className="chats-overview-container">
                            <DisplayChats />
                        </div>
                    <h2>Groepen</h2>
                    {groups && groups.map(group => (
                    <div className="chats-overview-container">
                        <div className="chatpartner-meta-container" name={group.ID} onClick={updateRoute}>
                            <img src={groupIcon} alt="" />
                            <p className="chat-overview-username">{group.Room}</p>
                            <p>{group.Messages} berichten</p>
                            <p className="new-messages"> 0 nieuw</p>
                        </div>
                    </div>
                    ))}
                </div>
                <RightSideBar />
            </div>
    )
}

export default ChatGroups