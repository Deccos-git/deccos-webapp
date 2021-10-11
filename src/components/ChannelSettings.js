import RightSideBar from "./rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "./LeftSideBarAuthProfileFullScreen";
import uuid from 'react-uuid';
import { db } from "../firebase/config";
import settingsIcon from '../images/icons/settings-icon.png'
import { useFirestore } from "../firebase/useFirestore";
import { client } from '../hooks/Client';
import { useHistory } from "react-router-dom"
import plusIcon from '../images/icons/plus-icon.png'
import MenuStatus from "../hooks/MenuStatus";

const ChannelSettings = () => {

    const channels = useFirestore("Channels")

    const uid = uuid()
    const history = useHistory()
    const menuState = MenuStatus()

    const channelSettings = (e) => {

        const ID = e.target.dataset.id
        
        history.push(`/${client}/ChannelSettingsDetail/${ID}`)

    }

    const newChannel = (e) => {

        db.collection("Channels")
        .doc()
        .set({
            ID: uid,
            Compagny: client,
            Link: `Channel`
        }).then(() => {
            history.push(`/${client}/ChannelSettingsDetail/${uid}`)
        })
    }

    return (
        <div className="main">
            <LeftSideBarAuthProfile />
            <LeftSideBarAuthProfileFullScreen/>
            <div className='profile profile-auth-profile' style={{display: menuState}}>
                <div className="settings-inner-container">
                    <div className="divider card-header">
                        <h1>Kanalen</h1>
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
                        <div className="button-container">
                            <img className="add-channel-icon" src={plusIcon} onClick={newChannel}/>
                        </div>
                    </div>
                </div>
            </div>
            <RightSideBar/>
        </div>
    )
}

export default ChannelSettings
