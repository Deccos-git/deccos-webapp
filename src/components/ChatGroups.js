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

   const newAndTotalMessages = async (chatID) => {

    let messageArray = []

        await db.collection("Messages")
        .where("Compagny", "==", client)
        .where("ParentID", "==", chatID)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach((doc) => {

                const read = doc.data().Read

                console.log(querySnapshot)

                const allMessages = {
                    AllMessages: querySnapshot.length
                }

                if(!read.includes(route)){

                    const newMessages = {
                        NewMessages: read.length
                    }

                    messageArray = [
                        allMessages,
                        newMessages
                    ]
                } 
            })
        })

        return messageArray
   }

   const chatsOverview = () => {

    const summary = {
        chatsOverview = [

        ]
    }

    chats && chats.forEach(async (chat) => {

        const messages = await newAndTotalMessages(chat.ID)

        const members = chat.Members
        members.forEach(async (member) => {

            const userName = await partnerName(member)

            const chatOverview = [
                {
                    Messages: null,
                    NewMessages: null,
                    Photo: null,
                    UserName: userName,
                    ID: null
                }
            ]

            summary.chatOveriew = chats

            })
        })

        return summary
    } 

    const DisplayChats = () => {
        return chatsOverview.chatOverview && chatsOverview.chatOverview.map(chat => (
            <div className="chatpartner-meta-container divider" >
                <div className="chatpartner-container" onClick={updateRoute}>
                    <img src={partners.photo} alt="" />
                    <p className="chat-overview-username">{partners.name}</p>
                </div>
                <p>{allMessages.AllMessages} berichten</p>
                <p className="new-messages">{newMessages.NewMessages} nieuw</p>
            </div>
            ))
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