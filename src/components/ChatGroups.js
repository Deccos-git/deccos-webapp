import LeftSideBar from "./LeftSideBar"
import LeftSideBarFullScreen from "./LeftSideBarFullScreen"
import RightSideBar from "./rightSideBar/RightSideBar"
import { useFirestoreChatsGroups, useFirestoreGroupsAuth } from "./../firebase/useFirestore";
import { useHistory } from "react-router-dom";
import { db } from '../firebase/config';
import { client } from '../hooks/Client';
import groupIcon from '../images/icons/group-icon.png'
import Location from "../hooks/Location"
import MenuStatus from "../hooks/MenuStatus";
import { useState, useEffect } from "react";
import firebase from "firebase";

const ChatGroups = () => {
    const [chatSummary, setChatSummary] = useState("")
    const [groupSummary, setGroupSummary] = useState("")
    const route = Location()[3]

    const groups = useFirestoreGroupsAuth(route)
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
                        <img src={ch.photo} alt="" data-id={ch.chatID} onClick={updateRouteChat} />
                        <p className="chat-overview-username" data-id={ch.chatID} onClick={updateRouteChat}>{ch.userName}</p>
                    </div>
                    <p data-id={ch.chatID} onClick={updateRouteChat}>{ch.messages} berichten</p>
                    <p className="new-messages" data-id={ch.chatID} onClick={updateRouteChat}>{ch.newMessages} nieuw</p>
                </div>
                )))
             ))
         )
    }
 
    const updateRouteChat = (e) => {

        const id = e.target.dataset.id

        db.collection("Messages")
        .where("Compagny", "==", client)
        .where("ParentID", "==", id)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach((doc) => {

                const read = doc.data().Read

                if(!read.includes(route)){

                        db.collection('Messages')
                        .doc(doc.id)
                        .update({
                            Read:firebase.firestore.FieldValue.arrayUnion(route)
                        })
                    }
                })
            })
            .then(() => {
                history.push(`/${client}/ChatRoom/${id}`)
            })
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

    const totalGroupMessages = async (groupID) => {

        let totalMessages = ""
    
            await db.collection("Messages")
            .where("Compagny", "==", client)
            .where("ParentID", "==", groupID)
            .get()
            .then(querySnapshot => {
                console.log(querySnapshot.docs.length)
              totalMessages = querySnapshot.docs.length
            })
    
            return totalMessages
       }

    const groupsOverview = async () => {

        const summary = {
            groups:[]
        }
    
        for(const group of groups){
            const groupsArray = []
    
            const newMessages = await newGroupMessages(group.SubID)
            const totalMessages = await totalGroupMessages(group.SubID)


            const groupObject = {
                room: group.SubName,
                messages: totalMessages,
                newMessages: newMessages,
                ID: group.SubID
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
                        <div className="chatpartner-container">
                            <img src={groupIcon} alt="" data-id={gr.ID} onClick={updateRouteGroup} />
                            <p className="chat-overview-username" data-id={gr.ID} onClick={updateRouteGroup}>{gr.room}</p>
                        </div>
                        <p data-id={gr.ID} onClick={updateRouteGroup}>{gr.messages} berichten</p>
                        <p data-id={gr.ID} className="new-messages" onClick={updateRouteGroup}> {gr.newMessages} nieuw</p>
                    </div>
                </div>
                ))
            ))
        )
    }

    const updateRouteGroup = (e) => {

        const id = e.target.dataset.id

        db.collection("Messages")
        .where("Compagny", "==", client)
        .where("ParentID", "==", id)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach((doc) => {

                const read = doc.data().Read

                if(!read.includes(route)){

                    console.log(doc)

                        db.collection('Messages')
                        .doc(doc.id)
                        .update({
                            Read:firebase.firestore.FieldValue.arrayUnion(route)
                        })
                    }
                })
            })
            .then(() => {
                history.push(`/${client}/Group/${id}`)
            })   
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