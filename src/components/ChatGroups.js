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

    const partnerMeta = async (id) => {

        const partnerMeta = []

        await db.collection("Users")
        .where("ID", "==", id)
        .onSnapshot(querySnapshot => {
            querySnapshot.forEach(doc => {

                const userName = doc.data().UserName
                const userPhoto = doc.data().Photo
                const userID = doc.data().ID

                 partnerMeta.push(
                    userName,
                    userPhoto,
                    userID
                 )

            })
        })
        return partnerMeta
        
    }

    const newMessages = (id) => {

        const newMessagesArray = []

        db.collection("Messages")
        .where("Compagny", "==", client)
        .where("ParentID", "==", id)
        .onSnapshot(querySnapshot => {
            querySnapshot.forEach(doc => {

                const read = doc.data().Read

                console.log(read)

                totalMessages(read)

                if(!read.includes(auth.ID)){
                    newMessagesArray.push(read)
                }    
            })
        })

        return newMessagesArray
    }

    const totalMessages = (read) => {

        const totalMessagesArray = [read]

        console.log(totalMessagesArray)

        return totalMessagesArray.length

    }

    const chatMeta = async () => {

        chats && chats.forEach(chat => {
            const members = chat.Members
            members.forEach(async (member) => {

                if(member != auth.ID){

                   const partner = await partnerMeta(member)

                    chatsArray.push({
                        partner,
                        newMessages: newMessages(chat.ID).length,
                        totalMessages: totalMessages()
                    })
                }
            })
        })
    }

    chatMeta()

    console.log(chatsArray)

    chatsArray.forEach(chat => {
        console.log(chat)
    })

   


    const DisplayChats = () => {
        
         return chatsArray && chatsArray.map(chats => (
            <div className="chatpartner-meta-container divider" key={chats.UserID}>
                <div name={""} onClick={updateRoute}>
                    <img src={chats.UserPhoto} alt="" />
                    <p className="chat-overview-username">{chats.partner[0]}</p>
                </div>
                <p>{chats.totalMessages} berichten</p>
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
                    <div className="chats-overview-container divider">
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