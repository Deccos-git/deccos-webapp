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
    const [groupSummary, setGroupSummary] = useState("")
    const route = Location()[3]

    const groups = useFirestoreChatsGroups("Groups", route)
    const history = useHistory()
    const chats = useFirestoreChatsGroups("Chats", route)

    const menuState = MenuStatus()

    // Chats Overview

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

    const messageArray = []

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

                const chatObject = {
                    userName: userName,
                    photo: photo,
                    id: id,
                    messages: allMessages,
                    newMessages: newMessages,
                    chatID: chat.ID
                }

                chatsArray.push(
                    chatObject
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

    const ChatsAuth = () => {
         return (
             chatSummary && chatSummary.chats.map(chat => (
                chat.map(ch => ((
                <div className="chatpartner-meta-container divider" key={ch.id}>
                    <div className="chatpartner-container">
                        <img src={ch.photo} alt=""data-id={ch.chatID} onClick={updateRouteChat} />
                        <p className="chat-overview-username" data-id={ch.chatID} onClick={updateRouteChat}>{ch.userName}</p>
                    </div>
                    <p>{ch.messages} berichten</p>
                    <p className="new-messages">{ch.newMessages} nieuw</p>
                </div>
                )))
             ))
         )
    }
 
    const updateRouteChat = (e) => {

        const id = e.target.dataset.id
         
        history.push(`/${client}/ChatRoom/${id}`)
            
    }

    // Groups overview

    const newGroupMessages = async (groupID) => {
        const messageArray = []

        await db.collection("Messages")
        .where("Compagny", "==", client)
        .where("ParentID", "==", groupID)
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

    const groupsOverview = async () => {

        const summary = {
            groups:[]
        }
    
        for(const group of groups){
            const groupsArray = []
    
            const newMessages = await newGroupMessages(group.ID)

            const groupObject = {
                room: group.Room,
                messages: group.Messages,
                newMessages: newMessages,
                ID: group.ID
            }

            groupsArray.push(
                groupObject
            )

            summary.groups.push(groupsArray)
        }

        return summary
    }

    useEffect(() => {
        groupsOverview().then((summary) => {
            setGroupSummary(summary)
        })
        
    }, [groups])

    const GroupsAuth = () => {
        return (
            groupSummary && groupSummary.groups.map(group => (
                group.map(gr => (
                    <div className="chats-overview-container divider" key={gr.ID}>
                    <div className="chatpartner-meta-container" data-id={gr.ID} name={gr.ID}>
                        <img src={groupIcon} alt="" data-id={gr.ID} onClick={updateRouteGroup} />
                        <p className="chat-overview-username" data-id={gr.ID} onClick={updateRouteGroup}>{gr.room}</p>
                        <p>{gr.messages} berichten</p>
                        <p className="new-messages"> {gr.newMessages} nieuw</p>
                    </div>
                </div>
                ))
            ))
        )
    }

    const updateRouteGroup = (e) => {

        const id = e.target.dataset.id
         
        history.push(`/${client}/Group/${id}`)
            
    }

    

    return (
            <div className="main">
                <LeftSideBar />
                <LeftSideBarFullScreen/>
                <div className="card-overview" style={{display: menuState}}>
                    <div className="page-header">
                        <h1>Chats en groepen</h1>
                    </div>
                    <div className="article" >
                        <h2>Chats</h2>
                            <div className="chats-overview-container">
                                <ChatsAuth/>
                            </div>
                        <h2>Groepen</h2>
                            <GroupsAuth/>
                    </div>
                </div>
                <RightSideBar />
            </div>
    )
}

export default ChatGroups