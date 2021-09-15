import RightSideBar from "./rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import deleteIcon from '../images/icons/delete-icon.png'
import { useState } from "react";
import uuid from 'react-uuid';
import { db } from "../firebase/config";
import { useFirestoreID } from "../firebase/useFirestore";
import { client } from '../hooks/Client';
import { useHistory } from "react-router-dom"

const ChannelSettingsDetail = ({route}) => {
    const [channelSingleName, setChannelSingleName] = useState("")
    const [channelName, setChannelName] = useState("")
    const [channelLayout, setChannelLayout] = useState("")

    const channels = useFirestoreID("Channels", route.Route)
    const uid = uuid()
    const history = useHistory()

    const nameSingleHandler = (e) => {
        const singleName = e.target.value

        setChannelSingleName(singleName)
    }

    const nameHandler = (e) => {
        const name = e.target.value

        setChannelName(name)
    }

    const saveName = () => {

        channels && channels.forEach(channel => {

            db.collection("Channels")
            .doc(channel.docid)
            .update({
                Name: channelName,
            })

        })
    }

    const saveSingleName = () => {

        channels && channels.forEach(channel => {

            db.collection("Channels")
            .doc(channel.docid)
            .update({
                SingleName: channelSingleName
            })

        })
    }



    const layoutHandler = (e) => {
        const channelLayout = e.target.id
        
        setChannelLayout(channelLayout)
    }

    const deleteChannel = (e) => {
        const ID = e.target.dataset.id

        db.collection("Channels")
        .where("ID", "==", ID)
        .onSnapshot(querySnapshot => {
            querySnapshot.forEach(doc => {

                console.log(doc.id)
                db.collection("Channels")
                .doc(doc.id)
                .delete()
            })
        })  
        
        history.push(`/${client}/ChannelSettings`)
    }

    return (
        <div className="main">
            <LeftSideBarAuthProfile />
            {channels && channels.map(channel => (
                <div className='profile'>
                    <div className="divider card-header">
                        <h2>{channel.Name} instellingen</h2>
                        <p>Pas de instellingen van het kanaal {channel.Name} aan</p>
                    </div>
                    <div className="divider">
                        <h3>Naam</h3>
                        <h5>Naam meervoud</h5>
                        <input className="input-classic" type="text" placeholder={channel.Name} onChange={nameHandler}/>
                        <div className="button-container">
                            <button className="button-simple" onClick={saveSingleName}>Opslaan</button>
                        </div>
                        <h5>Naam enkelvoud</h5>
                        <input className="input-classic" type="text" placeholder={channel.SingleName} onChange={nameSingleHandler}/>
                        <div className="button-container">
                            <button className="button-simple" onClick={saveName}>Opslaan</button>
                        </div>
                    </div>
                    <div className="divider">
                        <h3>Layout</h3>
                    </div>
                    <div className="divider">
                        <h3>Kanaal verwijderen</h3>
                        <img className="delete-channel" src={deleteIcon} data-id={channel.ID} onClick={deleteChannel} />
                    </div>
                </div>
            ))}
            <RightSideBar/>
        </div>
    )
}

export default ChannelSettingsDetail
