import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile"
import LeftSideBarAuthProfileFullScreen from "./LeftSideBarAuthProfileFullScreen";
import RightSideBar from "./rightSideBar/RightSideBar";
import { useFirestoreID } from "../firebase/useFirestore";
import Location from "../hooks/Location"
import { db } from "../firebase/config";
import deleteIcon from '../images/icons/delete-icon.png'
import { useHistory } from "react-router-dom"
import { client } from "../hooks/Client";
import { useState } from "react";
import MenuStatus from "../hooks/MenuStatus";

const GroupSettingsDetail = () => {
    const [title, setTitle] = useState("")

    const route = Location()[3]
    const menuState = MenuStatus()

    const groups = useFirestoreID("Groups", route)
    const history = useHistory()

    const deletegroup = (e) => {

        groups && groups.forEach(group => {
            db.collection("Groups")
            .doc(group.docid)
            .delete()
            .then(() => {
                history.push(`/${client}/groupsettings`)
            })
        })
    }

    const titleHandler = (e) => {

        const title = e.target.value

        setTitle(title)

    }

    const saveTitle = (e) => {

        groups && groups.forEach(group => {
            db.collection("Groups")
            .doc(group.docid)
            .update({
                Room: title
            })
        })

        e.target.innerHTML = "Opgeslagen"
    }

    return (
        <div className="main">
            <LeftSideBarAuthProfile />
            <LeftSideBarAuthProfileFullScreen/>
            <div className="profile profile-auth-goal" style={{display: menuState}}>
                {groups && groups.map(group => (
                <div key={group.ID}>
                    <div className="divider card-header">
                        <h2>{group.Room} instellingen</h2>
                        <p>Pas de instellingen van de groep {group.Room} aan</p>
                    </div>
                    <div className="divider">
                        <h3>Titel</h3>
                        <input className="input-classic" type="text" placeholder={group.Room} onChange={titleHandler}/>
                        <div className="button-container">
                            <button className="button-simple" onClick={saveTitle}>Opslaan</button>
                        </div>
                    </div>
                    
                     <div className="divider">
                        <h3>Groep verwijderen</h3>
                        <img className="delete-channel" src={deleteIcon} data-id={group.ID} onClick={deletegroup} />
                    </div>
                 </div>
                ))}        
            </div>
            <RightSideBar />
        </div>
    )
}

export default GroupSettingsDetail
