import RightSideBar from "./rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import deleteIcon from '../images/icons/delete-icon.png'
import { useState, useContext } from "react";
import uuid from 'react-uuid';
import { db, timestamp } from "../firebase/config";
import settingsIcon from '../images/icons/settings-icon.png'
import { useFirestore } from "../firebase/useFirestore";
import { client } from '../hooks/Client';
import { Auth } from '../StateManagment/Auth';

const GroupSettings = () => {
    const [groupTitle, setGroupTitle] = useState("")
    const [authO] = useContext(Auth)

    const groups = useFirestore("Groups")
   
    const id = uuid()

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
    }

    const deleteGroup = (e) => {
        const deleteID = e.target.name

        groups && groups.forEach(group => {
            if(deleteID === group.ID){
                db.collection("Groups")
                .doc(group.docid)
                .delete()
            }
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
                    <h2>Groep instellingen</h2>
                    <p>Pas de instellingen van je groepen aan</p>
                </div>
                {groups && groups.map(group => (
                <div className="divider">
                    <h3>Community groepen</h3>
                    <div className="channel-container" key={group.ID}>
                        <h3>{group.Room}</h3>
                        <div className="icon-container">
                            <img src={deleteIcon} name={group.ID} onClick={deleteGroup} />
                            <img src={settingsIcon} name={group.ID} onClick={channelSettings} />
                        </div>
                    </div>
                </div>
                ))}
                <div className="divider">
                    <h3>Groep toevoegen</h3>
                    <div className="new-group-container">
                        <p>Geef je groep een naam</p>
                        <input className="input-classic" type="text" placeholder="Schrijf hier de naam van het nieuwe kanaal" onChange={newGroupTitleHandler}/>
                    </div>
                    <div className="button-container">
                        <button className="button-simple" onClick={saveNewGroup}>Toevoegen</button>
                    </div>
                </div>
            </div>
            <RightSideBar/>
        </div>
    )
}

export default GroupSettings
