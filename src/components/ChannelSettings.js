import RightSideBar from "./rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import { useState } from "react";
import uuid from 'react-uuid';
import { db } from "../firebase/config";
import settingsIcon from '../images/icons/settings-icon.png'
import { useFirestore, useFirestoreID } from "../firebase/useFirestore";
import { client } from '../hooks/Client';
import { useHistory } from "react-router-dom"

const ChannelSettings = ({route}) => {
    const [channelTitle, setChannelTitle] = useState("")
    const [channelLayout, setChannelLayout] = useState("")

    const channels = useFirestore("Channels")
    const uid = uuid()
    const history = useHistory()

    const newChannelTitleHandler = (e) => {
        const channelTitle = e.target.value

        setChannelTitle(channelTitle)
    }

    const saveNewChannel = (e) => {

        db.collection("Channels")
        .doc()
        .set({
            Name: channelTitle,
            Layout: channelLayout,
            ID: uid,
            Link: "Channel",
            Compagny: client
        })
        .then(() => {
            history.push(`/${client}/ChannelSettingsDetail/${uid}`)
        })
    }

    const channelSettings = (e) => {

        const ID = e.target.dataset.id
        
        history.push(`/${client}/ChannelSettingsDetail/${ID}`)

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
                    <h3>Community kanalen</h3>
                    {channels && channels.map(channel =>(
                    <div className="channel-container" data-id={channel.ID}>
                        <h3>{channel.Name}</h3>
                        <div className="icon-container">
                            <img src={settingsIcon} data-id={channel.ID} onClick={channelSettings} />
                        </div>
                    </div>
                    ))}
                </div>
                <div className="divider">
                    <h3>Kanaal toevoegen</h3>
                    <div className="new-channel-container" >
                        <p>Geef je kanaal een naam</p>
                        <input className="input-classic" type="text" placeholder="Schrijf hier de naam van het nieuwe kanaal" onChange={newChannelTitleHandler}/>
                    </div>
                    <div className="button-container">
                        <button className="button-simple" onClick={saveNewChannel}>Toevoegen</button>
                    </div>
                </div>
            </div>
            <RightSideBar/>
        </div>
    )
}

export default ChannelSettings
