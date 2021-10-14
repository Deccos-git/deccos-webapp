import RightSideBar from "./rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "./LeftSideBarAuthProfileFullScreen";
import deleteIcon from '../images/icons/delete-icon.png'
import { useState } from "react";
import uuid from 'react-uuid';
import { db } from "../firebase/config";
import { useFirestoreID } from "../firebase/useFirestore";
import { client } from '../hooks/Client';
import { useHistory } from "react-router-dom"
import Location from "../hooks/Location"
import ListLayout from '../images/Design/list-mockup.png'
import CardLayout from '../images/Design/card-mockup.png'
import MenuStatus from "../hooks/MenuStatus";

const ChannelSettingsDetail = () => {
    const [channelName, setChannelName] = useState("")
    const [channelLayout, setChannelLayout] = useState("")
    const [channelBannerLayout, setChannelBannerLayout] = useState("")

    const route = Location()[3]
    const menuState = MenuStatus()

    const channels = useFirestoreID("Channels", route)
    const history = useHistory()

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

    const selectListLayout = () => {
        setChannelLayout("list")
        setChannelBannerLayout("list-banner")
    }

    const selectCardLayout = () => {
        setChannelLayout("card")
        setChannelBannerLayout("card-banner")
    }

    const saveLayout = () => {
        channels && channels.forEach(channel => {

            db.collection("Channels")
            .doc(channel.docid)
            .update({
                Layout: channelLayout,
                BannerLayout: channelBannerLayout
            })

        })
    }

    return (
        <div className="main">
            <LeftSideBarAuthProfile />
            <LeftSideBarAuthProfileFullScreen/>
            {channels && channels.map(channel => (
                <div className='profile profile-auth-profile' style={{display: menuState}}>
                    <div className="divider card-header">
                        <h2>{channel.Name} instellingen</h2>
                        <p>Pas de instellingen van het kanaal {channel.Name} aan</p>
                    </div>
                    <div className="divider">
                        <h3>Naam</h3>
                        <input className="input-classic" type="text" placeholder={channel.Name} onChange={nameHandler}/>
                        <div className="button-container">
                            <button className="button-simple" onClick={saveName}>Opslaan</button>
                        </div>
                    </div>
                    {/* <div className="divider">
                        <h3>Layout</h3>
                        <div className="layout-container">
                            <div className="layout-inner-div" onClick={selectListLayout}>
                                <h5>Lijst</h5>
                                <img src={ListLayout} alt="" />
                            </div>
                            <div className="layout-inner-div" onClick={selectCardLayout}>
                                <h5>Kaart</h5>
                                <img src={CardLayout} alt="" />
                            </div>
                        </div>
                        <div className="button-container">
                            <button className="button-simple" onClick={saveLayout}>Opslaan</button>
                        </div>
                    </div> */}
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
