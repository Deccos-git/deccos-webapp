import RightSideBar from "./rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import deleteIcon from '../images/icons/delete-icon.png'
import { useState } from "react";
import uuid from 'react-uuid';
import { db, timestamp } from "../firebase/config";
import checkIcon from '../images/icons/check-icon.png'
import { useFirestore } from "../firebase/useFirestore";
import { client } from '../hooks/Client';

const GroupSettings = ({compagny, auth}) => {
    const [groupTitle, setGroupTitle] = useState("")
    const [updateTitle, setUpdateTitle] = useState("")

    const groups = useFirestore("Groups")
   
    const id = uuid()

    const docid = compagny.docid


    const newGroupTitleHandler = (e) => {
        const groupTitle = e.target.value

        setGroupTitle(groupTitle)
    }

    const newGroup = {
        Name: groupTitle,
        ID: id,
        Link: "Channel"
    }

    const saveNewGroup = () => {
        db.collection("Groups")
        .doc()
        .set({
            ID: id,
            Room: groupTitle,
            Members: [
                auth.ID
            ],
            Timestamp: timestamp,
            Compagny: client
        })
    }

    let updateButtonGroup = "update-button-channel"

    const updateGroupName = (e) => {

        updateButtonGroup = ""

        console.log(updateButtonGroup)

        console.log(e.target)

        const oldName = e.target.id
        setUpdateTitle(e.target.value)

    }

    const updateGroup = () => {
    //     compagny.Channels.forEach(channel => {
    //         if("oldName" === channel.Name){

    //             console.log(channel.index)

    //             const newChannel = {
    //                 Name: "newName",
    //                 Link: channel.Link,
    //                 ID: channel.ID,
    //                 Layout: channel.Layout
    //             }

                // db.collection("CompagnyMeta")
                // .doc(compagny.docid)
                // .update({
                //     Channels: firebase.firestore.FieldValue.arrayUnion(newChannel)
                // })
    //         }
    //     })
    }

    const deleteGroup = (e) => {
    //     const deleteID = e.target.id

    //     compagnies && compagnies.forEach(compagny => {
    //         compagny.Channels.forEach(channel => {
    //             if(deleteID === channel.ID){
    //                 db.collection("CompagnyMeta")
    //                 .doc(compagny.docid)
    //                 .update({
    //                     Channels: firebase.firestore.FieldValue.arrayRemove(channel)
    //                 })
    //             }
    //         })
    //     })
    }

    return (
        <div className="main">
            <LeftSideBarAuthProfile />
            <div className='profile'>
                <div className="divider card-header">
                    <h2>Groep instellingen</h2>
                    <p>Pas de instellingen van je groepen aan</p>
                </div>
                <div className="divider">
                    <h3>Groep toevoegen</h3>
                    <div >
                        <p>Geef je groep een naam</p>
                        <input type="text" placeholder="Schrijf hier de naam van het nieuwe kanaal" onChange={newGroupTitleHandler}/>
                    </div>
                    <button onClick={saveNewGroup}>Toevoegen</button>
                </div>
                {groups && groups.map(group => (
                <div className="divider">
                    <h3>Community groepen</h3>
                    <div className="channel-container" key={group.ID}>
                        <input type="text" id={group.Room} placeholder={group.Room} onChange={updateGroupName} />
                        <img src={deleteIcon} id={group.ID} onClick={deleteGroup} />
                        <img className={updateButtonGroup} src={checkIcon} id={group.ID} onClick={updateGroup} />
                    </div>
                </div>
                ))}
                {/* <div className="save-bar">
                    <button>Opslaan</button>
                </div> */}
            </div>
            <RightSideBar/>
        </div>
    )
}

export default GroupSettings
