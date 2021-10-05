import LeftSideBar from "./LeftSideBar"
import LeftSideBarFullScreen from "./LeftSideBarFullScreen"
import RightSideBar from "./rightSideBar/RightSideBar"
import { useFirestoreChatsGroups } from "./../firebase/useFirestore";
import { useHistory } from "react-router-dom";
import { db } from '../firebase/config';
import { client } from '../hooks/Client';
import groupIcon from '../images/icons/group-icon.png'
import Location from "../hooks/Location"
import MenuStatus from "../hooks/MenuStatus";
import { useState, useEffect } from "react";

const ChatGroups = () => {
    const [chatSummary, setChatSummary] = useState("")
    const route = Location()[3]

    const groups = useFirestoreChatsGroups("Groups", route)
    const history = useHistory()
    const chats = useFirestoreChatsGroups("Chats", route)

    console.log(chats)

    const menuState = MenuStatus()

    const partnerName = async (member) => {

    let userName = ""

    if(member != route){

        await db.collection("Users")
        .where("ID", "==", member)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {

                userName = doc.data().UserName

                })
            })
        }

    return userName
    }

    const partnerPhoto = async (member) => {

        let photo = ""
    
        if(member != route){
    
            await db.collection("Users")
            .where("ID", "==", member)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
    
                    photo = doc.data().Photo
    
                    })
                })
            }
    
        return photo
        }

        const partnerID = async (member) => {

            let id = ""
        
            if(member != route){
        
                await db.collection("Users")
                .where("ID", "==", member)
                .get()
                .then(querySnapshot => {
                    querySnapshot.forEach(doc => {
        
                        id = doc.data().ID
        
                        })
                    })
                }
        
            return id
            }

   const totalMessages = async (chatID) => {

    let totalMessages = ""

        await db.collection("Messages")
        .where("Compagny", "==", client)
        .where("ParentID", "==", chatID)
        .get()
        .then(querySnapshot => {
          totalMessages = querySnapshot.docs.length
        })

        return totalMessages
   }

   const newestMessages = async (chatID) => {

    let messageArray = []

        await db.collection("Messages")
        .where("Compagny", "==", client)
        .where("ParentID", "==", chatID)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach((doc) => {

                const read = doc.data().Read

                if(!read.includes(route)){

                        messageArray.push(read)
                    }
                })
            })

        return messageArray.length
   }

   const chatsOverview = async () => {

    const summary = {
        chats:[]
    }

    for(const chat of chats){
        const chatsArray = []

        const allMessages = await totalMessages(chat.ID)
        const newMessages = await newestMessages(chat.ID)

        for(const member of chat.Members){
            if(member != route){

                const userName = await partnerName(member)
                const photo = await partnerPhoto(member)
                const id = await partnerID(member)

                const chat = {
                    userName: userName,
                    photo: photo,
                    id: id,
                    messages: allMessages,
                    newMessages: newMessages
                }

                chatsArray.push(
                    chat
                )
            }
        }

        summary.chats.push(chatsArray)
    }
        return summary
    }


    useEffect(() => {
        chatsOverview().then((summary) => {
            setChatSummary(summary)
        })
        
    }, [chats])

    chatSummary.chats.forEach(chat => {
        chat.forEach(ch => {
            console.log(ch)
        })
    })
 
    const updateRoute = (e) => {
        chats && chats.forEach(chat => {
         
            history.push(`/${client}/ChatRoom/${chat.ID}`)
            
        })
    }

    return (
            <div className="main">
                <LeftSideBar />
                <LeftSideBarFullScreen/>
                <div className="article" style={{display: menuState}}>
                    <h2>Chats</h2>
                        <div className="chats-overview-container">
                            {chatSummary.chats.forEach(chat => {
                                {chat.map(ch => (
                                <div className="chatpartner-meta-container divider" key={ch.id}>
                                    <div className="chatpartner-container" onClick={updateRoute}>
                                        <img src={ch.photo} alt="" />
                                        <p className="chat-overview-username">{ch.userName}</p>
                                    </div>
                                    <p>{ch.allMessages} berichten</p>
                                    <p className="new-messages">{ch.newMessages} nieuw</p>
                                </div>
                                ))}
                            })}
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