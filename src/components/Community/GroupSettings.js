import RightSideBar from "../rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "../LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "../LeftSideBarAuthProfileFullScreen";
import { useState, useContext, useEffect } from "react";
import uuid from 'react-uuid';
import { db, timestamp } from "../../firebase/config";
import settingsIcon from '../../images/icons/settings-icon.png'
import { useFirestore } from "../../firebase/useFirestore";
import { client } from '../../hooks/Client';
import { Auth } from '../../StateManagment/Auth';
import { useHistory } from "react-router-dom";
import MenuStatus from "../../hooks/MenuStatus";
import plusIcon from '../../images/icons/plus-icon.png'

const GroupSettings = () => {
    const [authO] = useContext(Auth)

    const [groupTitle, setGroupTitle] = useState("")
    const [headerPhoto, setHeaderPhoto] = useState('')
    const [admin, setAdmin] = useState(false)
    const [author, setAuthor] = useState(false)

    const groups = useFirestore("Groups")
    const banners = useFirestore('Banners')
    const admins = useFirestore('Admins')
    const authors = useFirestore('Authors')
    
    const history = useHistory();
    const menuState = MenuStatus()
   
    const id = uuid()

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

    useEffect(() => {
        banners && banners.forEach(banner => {
            const header = banner.NewGroup
            setHeaderPhoto(header)
        })
    }, [banners])

    const newGroupTitleHandler = (e) => {
        const groupTitle = e.target.value

        setGroupTitle(groupTitle)
    }

    const newMember = {
        ID: authO.ID,
        Photo: authO.Photo,
        UserName: authO.UserName
    }

    const saveNewGroup = () => {
        db.collection("Groups")
        .doc()
        .set({
            ID: id,
            Admin: authO.ID,
            Room: groupTitle,
            MemberList: [
                authO.ID
            ],
            Members: [
                newMember
            ],
            Timestamp: timestamp,
            Compagny: client,
            Messages: 0,
            Banner: "https://firebasestorage.googleapis.com/v0/b/deccos-app.appspot.com/o/GroupBanners%2FHero-III.jpg?alt=media&token=6464f58e-6aa7-4522-9bb6-3b8c723496d7"
        })
        .then(() => {
            db.collection('GroupChannels')
            .doc()
            .set({
                Name: groupTitle,
                Timestamp: timestamp,
                ID: id,
                Compagny: client,
            })
        })
        .then(() => {
            db.collection("AllActivity")
            .doc()
            .set({
                Title: groupTitle,
                Type: "NewGroup",
                Compagny: client,
                Timestamp: timestamp,
                ID: id,
                Description: "heeft een nieuwe groep toegevoegd:",
                ButtonText: "Bekijk groep",
                User: authO.UserName,
                UserPhoto: authO.Photo,
                UserID: authO.ID,
                Banner: headerPhoto,
                Link: `${client}/GroupLanding/${id}`
            }) 
        })
        .then(() => {
            db.collection("Search")
            .doc()
            .set({
                Name: groupTitle,
                Compagny: client,
                Type: 'Groep',
                Link: `Group/${id}`
            })
        })
    }

    const channelSettings = (e) => {
        const id = e.target.dataset.id

        history.push(`/${client}/GroupSettingsDetail/${id}`)
    }

    const ShowAddItemIcon = ({group}) => {
        if(author || admin){
            return (
                <img src={plusIcon} data-id={group.ID} onClick={addItem} />
            )

        }
    }

    const addItem = (e) => {

        const ID = e.target.dataset.id
        
        history.push(`/${client}/AddGroupChannelItem/${ID}`)

    }


    return (
        <div className="main">
            <LeftSideBarAuthProfile />
            <LeftSideBarAuthProfileFullScreen/>
            <div className='profile profile-auth-profile' style={{display: menuState}}>
                <div className="settings-inner-container">
                    <div className="divider card-header">
                        <h1>Groepen</h1>
                        <p>Pas de instellingen van je groepen aan</p>
                    </div>
                    <h2>Groepen</h2>
                    <div className="divider">
                        {groups && groups.map(group => (
                        <div className="channel-container" key={group.ID}>
                            <h3>{group.Room}</h3>
                            <div className="icon-container">
                                <ShowAddItemIcon group={group}/>
                                <img src={settingsIcon} data-id={group.ID} onClick={channelSettings} />
                            </div>
                        </div>
                        ))}
                    </div>
                    <div className="divider">
                        <h2>Groep toevoegen</h2>
                        <div className="new-group-container">
                            <p>Geef je groep een naam</p>
                            <input className="input-classic" type="text" placeholder="Schrijf hier de naam van het nieuwe kanaal" onChange={newGroupTitleHandler}/>
                        </div>
                        <div className="button-container">
                            <button className="button-simple" onClick={saveNewGroup}>Toevoegen</button>
                        </div>
                    </div>
                </div>
            </div>
            <RightSideBar/>
        </div>
    )
}

export default GroupSettings
