import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./rightSideBar/RightSideBar"
import { useFirestoreChatsGroups } from "./../firebase/useFirestore";
import { useHistory } from "react-router-dom";
import { db } from '../firebase/config';
import { client } from '../hooks/Client';
import groupIcon from '../images/icons/group-icon.png'
import { useEffect, useState, useContext } from "react";
import { Auth } from '../StateManagment/Auth';
import Location from "../hooks/Location"

const ChatGroups = () => {
    const [authO] = useContext(Auth)
    const route = Location()[3]
    const [chats, setChats] = useState("")
    const [partners, setPartners] = useState("")
    const [allMessages, setAllMessages] = useState("")
    const [newMessages, setNewMessages] = useState("")

    const groups = useFirestoreChatsGroups("Groups", authO.ID)
    const history = useHistory()

   // Find chats of auth
   useEffect(() => {

        db.collection("Chats")
        .where("Compagny", "==", client)
        .where("MemberList", "array-contains", authO.ID)
        .onSnapshot(querySnapshot => {
            let docArray = []
            querySnapshot.forEach( doc => {
                docArray.push({...doc.data(), docid: doc.id})
            })
            setChats(docArray)
        })
    }, [])  


   let userName = ""
   let userPhoto = ""

   const array = []

   useEffect(() => {

    chats && chats.forEach(chat => {
        const members = chat.Members
        members.forEach((member) => {

            const partners = findChatPartner(member)
            const messages = newAndTotalMessages(chat.ID)

            array.push(partners, messages)

            })
        })

   },[])

   console.log(array)
   


   const findChatPartner = (member) => {

    const partnerArray = []

    if(member != authO.ID){

        db.collection("Users")
        .where("ID", "==", member)
        .onSnapshot(querySnapshot => {
            querySnapshot.forEach((doc) => {

                const userName = doc.data().UserName
                const userPhoto = doc.data().Photo
                const userID = doc.data().ID

                const partner = {
                    name: userName,
                    photo: userPhoto,
                    id: userID
                } 

                partnerArray.push(partner)
            })
        })
    }

    return partnerArray
}


   const newAndTotalMessages = (chatID) => {

    const messageArray = []

        db.collection("Messages")
        .where("Compagny", "==", client)
        .where("ParentID", "==", chatID)
        .onSnapshot(querySnapshot => {
            querySnapshot.forEach((doc) => {

                const read = doc.data().Read

                const totalMessagesArray = [read]

                const allMessages = {
                    AllMessages: totalMessagesArray.length
                }

                messageArray.push(allMessages)

                if(!read.includes(authO.ID)){

                    const newMessages = {
                        NewMessages: read.length
                    }

                    messageArray.push(newMessages)
                } 
            })
        })

        return messageArray
   }

    const DisplayChats = () => {
           return <div className="chatpartner-meta-container divider" >
                <div className="chatpartner-container" onClick={updateRoute}>
                    <img src={partners.photo} alt="" />
                    <p className="chat-overview-username">{partners.name}</p>
                </div>
                <p>{allMessages.AllMessages} berichten</p>
                <p className="new-messages">{newMessages.NewMessages} nieuw</p>
            </div>
    }

    const updateRoute = (e) => {
        chats && chats.forEach(chat => {
         
            history.push(`/${client}/ChatRoom/${chat.ID}`)
            
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
                    <div className="chats-overview-container divider" key={group.ID}>
                        <div className="chatpartner-meta-container" data-id={group.ID} name={group.ID} onClick={updateRoute}>
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