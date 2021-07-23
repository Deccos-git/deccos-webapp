import RightSideBar from "./rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import deleteIcon from '../images/icons/delete-icon.png'
import { useState } from "react";
import uuid from 'react-uuid';
import { db } from "../firebase/config";
import settingsIcon from '../images/icons/settings-icon.png'
import { useFirestore, useFirestoreID } from "../firebase/useFirestore";
import firebase from "firebase";

const ChannelSettings = () => {
    const [channelTitle, setChannelTitle] = useState("")
    const [channelLayout, setChannelLayout] = useState("")

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

    const channelSettings = (e) => {
        const channelID = e.target.name
    }

    return (
        <div className="main">
            <LeftSideBarAuthProfile />
            <div className='profile'>
                <div className="divider card-header">
                    <h2>Kanaal instellingen</h2>
                    <p>Pas de instellingen van je kanalen aan</p>
                </div>
                {compagnies && compagnies.map(compagny => (
                <div className="divider">
                    <h3>Community kanalen</h3>
                    {compagny.Channels && compagny.Channels.map(channel =>(
                    <div className="channel-container">
                        <h3>{channel.Name}</h3>
                        <div className="icon-container">
                            <img src={deleteIcon} id={channel.ID} onClick={deleteChannel} />
                            <img src={settingsIcon} name={channel.ID} onClick={channelSettings} />
                        </div>
                    </div>
                    ))}
                </div>
                ))}
                <div className="divider">
                    <h3>Kanaal toevoegen</h3>
                    <div className="new-channel-container" >
                        <p>Geef je kanaal een naam</p>
                        <input type="text" placeholder="Schrijf hier de naam van het nieuwe kanaal" onChange={newChannelTitleHandler}/>
                    </div>
                    <div className="button-container">
                        <button onClick={saveNewChannel}>Toevoegen</button>
                    </div>
                </div>
            </div>
            <RightSideBar/>
        </div>
    )
}

export default ChannelSettings
