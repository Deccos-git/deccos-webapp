import RightSideBar from "./rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import deleteIcon from '../images/icons/delete-icon.png'
import { useState } from "react";
import uuid from 'react-uuid';
import { db } from "../firebase/config";
import checkIcon from '../images/icons/check-icon.png'
import { useFirestore, useFirestoreID } from "../firebase/useFirestore";
import firebase from "firebase";

const ChannelSettings = () => {
    const [channelTitle, setChannelTitle] = useState("")
    const [channelLayout, setChannelLayout] = useState("")
    const [updateTitle, setUpdateTitle] = useState("")

    const compagnies = useFirestore("CompagnyMeta")
    const id = uuid()

    let docid = ""

    compagnies && compagnies.forEach(compagny => {
        docid = compagny.docid
    })

    const newChannelTitleHandler = (e) => {
        const channelTitle = e.target.value

        setChannelTitle(channelTitle)
    }

    const layoutHandler = (e) => {
        const channelLayout = e.target.id
        
        setChannelLayout(channelLayout)
    }

    const newChannel = {
        Name: channelTitle,
        Layout: channelLayout,
        ID: id,
        Link: "Channel"
    }

    const saveNewChannel = () => {
        db.collection("CompagnyMeta")
        .doc(docid)
        .update({
            Channels: firebase.firestore.FieldValue.arrayUnion(newChannel)
        })
    }

    let updateButtonChannel = "update-button-channel"

    const updateChannelName = (e) => {

        updateButtonChannel = ""

        console.log(updateButtonChannel)

        console.log(e.target)

        const oldName = e.target.id
        setUpdateTitle(e.target.value)

    }

    const updateChannel = () => {
        compagnies && compagnies.forEach(compagny => {
            compagny.Channels.forEach(channel => {
                if("oldName" === channel.Name){

                    console.log(channel.index)

                    const newChannel = {
                        Name: "newName",
                        Link: channel.Link,
                        ID: channel.ID,
                        Layout: channel.Layout
                    }

                    // db.collection("CompagnyMeta")
                    // .doc(compagny.docid)
                    // .update({
                    //     Channels: firebase.firestore.FieldValue.arrayUnion(newChannel)
                    // })
                }
            })
        })
    }

    const deleteChannel = (e) => {
        const deleteID = e.target.id

        compagnies && compagnies.forEach(compagny => {
            compagny.Channels.forEach(channel => {
                if(deleteID === channel.ID){
                    db.collection("CompagnyMeta")
                    .doc(compagny.docid)
                    .update({
                        Channels: firebase.firestore.FieldValue.arrayRemove(channel)
                    })
                }
            })
        })
    }

    return (
        <div className="main">
            <LeftSideBarAuthProfile />
            <div className='profile'>
                <div className="divider card-header">
                    <h2>Kanaal instellingen</h2>
                    <p>Pas de instellingen van je kanalen aan</p>
                </div>
                <div className="divider">
                    <h3>Kanaal toevoegen</h3>
                    <div >
                        <p>Geef je kanaal een naam</p>
                        <input type="text" placeholder="Schrijf hier de naam van het nieuwe kanaal" onChange={newChannelTitleHandler}/>
                        <p>Kies een layout</p>
                        <div className="layout-container">
                            <div className="layout-inner-container" id="Card" onClick={layoutHandler}>
                                <p>Kaart</p>
                            </div>
                            <div className="layout-inner-container" id="List" onClick={layoutHandler}>
                                <p>Lijst</p>
                            </div>
                            <div className="layout-inner-container" id="Post" onClick={layoutHandler}>
                                <p>Post</p>
                            </div>
                        </div>
                    </div>
                    <button onClick={saveNewChannel}>Toevoegen</button>
                </div>
                {compagnies && compagnies.map(compagny => (
                <div className="divider">
                    <h3>Community kanalen</h3>
                    {compagny.Channels && compagny.Channels.map(channel =>(
                    <div className="channel-container">
                        <input type="text" id={channel.Name} placeholder={channel.Name} onChange={updateChannelName} />
                        <img src={deleteIcon} id={channel.ID} onClick={deleteChannel} />
                        <img className={updateButtonChannel} src={checkIcon} id={channel.ID} onClick={updateChannel} />
                    </div>
                    ))}
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

export default ChannelSettings
