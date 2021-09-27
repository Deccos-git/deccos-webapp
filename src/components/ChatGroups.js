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
    const route = Location()[3]

    const groups = useFirestoreChatsGroups("Groups", route)
    const history = useHistory()
    const chats = useFirestoreChatsGroups("Chats", route)
    
   let partners = ""
   let allMessages = ""
   let newMessages = ""

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

                        newMessages = read.length
                    }
                })
            })

        return messageArray.length
   }



   const chatsOverview = () => {

    let summary = {}

    chats && chats.forEach(async (chat) => {

        const chats = [{}]

        const allMessages = await totalMessages(chat.ID)
        const newMessages = await newestMessages(chat.ID)

        console.log(chats)

        const members = chat.Members
        members.forEach(async (member) => {

            const userName = await partnerName(member)
            const photo = await partnerPhoto(member)
            const id = await partnerID(member)

            chats.push(
                {
                userName: userName,
                photo: photo,
                id: id,
                messages: allMessages,
                newMessages: newMessages
                }
            )

            summary.chats = chats

            })
        })

        return summary
    }
    
    console.log(chatsOverview())

    // const DisplayChats = () => {
    //     return chatsOverview().chats && chatsOverview().chats.map(chat => (
    //         <div className="chatpartner-meta-container divider" >
    //             <div className="chatpartner-container" onClick={updateRoute}>
    //                 <img src={chat.photo} alt="" />
    //                 <p className="chat-overview-username">{chat.userName}</p>
    //             </div>
    //             <p>{chat.messages} berichten</p>
    //             <p className="new-messages">{chat.newMessages} nieuw</p>
    //         </div>
    //         ))
    // }

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
                            {/* <DisplayChats /> */}
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