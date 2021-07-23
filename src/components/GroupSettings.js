import RightSideBar from "./rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import deleteIcon from '../images/icons/delete-icon.png'
import { useState } from "react";
import uuid from 'react-uuid';
import { db, timestamp } from "../firebase/config";
import settingsIcon from '../images/icons/settings-icon.png'
import { useFirestore } from "../firebase/useFirestore";
import { client } from '../hooks/Client';

const GroupSettings = ({compagny, auth}) => {
    const [groupTitle, setGroupTitle] = useState("")

    const groups = useFirestore("Groups")
   
    const id = uuid()

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
                        <input type="text" placeholder="Schrijf hier de naam van het nieuwe kanaal" onChange={newGroupTitleHandler}/>
                    </div>
                    <div className="button-container">
                        <button onClick={saveNewGroup}>Toevoegen</button>
                    </div>
                </div>
            </div>
            <RightSideBar/>
        </div>
    )
}

export default GroupSettings
