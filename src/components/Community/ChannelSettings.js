import RightSideBar from "../rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "../LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "../LeftSideBarAuthProfileFullScreen";
import uuid from 'react-uuid';
import { db } from "../../firebase/config";
import settingsIcon from '../../images/icons/settings-icon.png'
import { useFirestore } from "../../firebase/useFirestore";
import { client } from '../../hooks/Client';
import { useHistory } from "react-router-dom"
import plusIcon from '../../images/icons/plus-icon.png'
import MenuStatus from "../../hooks/MenuStatus";
import { useState, useEffect, useContext } from "react";
import ButtonClicked from "../../hooks/ButtonClicked";
import { Auth } from '../../StateManagment/Auth';

const ChannelSettings = () => {
    const [authO] = useContext(Auth)
    const [channelName, setChannelName] = useState('')
    const [admin, setAdmin] = useState(false)
    const [author, setAuthor] = useState(false)

    const channels = useFirestore("Channels")
    const admins = useFirestore('Admins')
    const authors = useFirestore('Authors')

    const uid = uuid()
    const history = useHistory()
    const menuState = MenuStatus()

    const channelSettings = (e) => {

        const ID = e.target.dataset.id
        
        history.push(`/${client}/ChannelSettingsDetail/${ID}`)

    }

    const channelNameHandler = (e) => {
        const name = e.target.value

        setChannelName(name)
    }

    useEffect(() => {
        admins && admins.forEach(admin => {
            if(admin.UserID === authO.ID){
                setAdmin(true)
            }
        })
    }, [admins])

    useEffect(() => {
        authors && authors.forEach(author => {
            if(author.UserID === authO.ID){
                setAuthor(true)
            }
        })
    }, [authors])

    const newChannel = (e) => {

        ButtonClicked(e, 'Toegevoegd')

        db.collection("Channels")
        .doc()
        .set({
            ID: uid,
            Compagny: client,
            Link: `Channel`,
            Name: channelName
        })
    }

    const ShowAddItemIcon = ({channel}) => {
        if(author || admin){
            return (
                <img src={plusIcon} data-id={channel.ID} data-name={channel.Name} onClick={addItem} />
            )

        }
    }

    const addItem = (e) => {

        const name = e.target.dataset.name 
        const channelID = e.target.dataset.id

        console.log(name)

        if(name === 'Kenniscentrum'){
            history.push(`/${client}/AddArticle`)
        } else if(name === 'Nieuws'){
            history.push(`/${client}/AddNews`)
        } else if(name === 'Events'){
            history.push(`/${client}/AddEvent`)
        } else {
            history.push(`/${client}/AddChannelItem/${channelID}`)
        }

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
                        <h2>Kanalen</h2>
                        {channels && channels.map(channel =>(
                        <div className="channel-container" data-id={channel.ID}>
                            <h3>{channel.Name}</h3>
                            <div className="icon-container">
                                <ShowAddItemIcon channel={channel}/>
                                <img src={settingsIcon} data-id={channel.ID} onClick={channelSettings} />
                            </div>
                        </div>
                        ))}
                    </div>
                    <div className="divider">
                        <h2>Kanaal toevoegen</h2>
                        <div id="add-channel-container">
                            <p>Kanaal naam</p>
                            <input type="text" placeholder='Geef het kanaal een naam' onChange={channelNameHandler}/>
                            <div>
                                <button className='button-simple' onClick={newChannel}>Toevoegen</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <RightSideBar/>
        </div>
    )
}

export default ChannelSettings
