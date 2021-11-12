import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile"
import LeftSideBarAuthProfileFullScreen from "./LeftSideBarAuthProfileFullScreen";
import RightSideBar from "./rightSideBar/RightSideBar";
import { useFirestoreID, useFirestoreSubscriptionsChannelGroup, useFirestoreUsers } from "../firebase/useFirestore";
import Location from "../hooks/Location"
import { db } from "../firebase/config";
import deleteIcon from '../images/icons/delete-icon.png'
import { useHistory } from "react-router-dom"
import { client } from "../hooks/Client";
import { useState, useEffect } from "react";
import MenuStatus from "../hooks/MenuStatus";

const GroupSettingsDetail = () => {
    const [title, setTitle] = useState("")
    const [newUser, setNewuser] = useState('')

    const route = Location()[3]
    const menuState = MenuStatus()

    const groups = useFirestoreID("Groups", route)
    const users = useFirestoreUsers(false)
    const members = useFirestoreSubscriptionsChannelGroup(route)
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

    const saveNewMember = (e) => {

        db.collection('Subscriptions')
        .doc()
        .set({
            UserName: newUser.UserName,
            UserID: newUser.ID,
            UserPhoto: newUser.Photo,
            UserEmail: newUser.Email,
            SubID: groupID,
            SubDocid: groupDocID,
            SubName: groupName,
            Timestamp: timestamp,
            Compagny: client,
            Approved: true,
            ID: id,
            Type: 'Group'
        })
        .then(() => {

            db.collection("Email").doc().set({
                to: userEmail,
                cc: "info@Deccos.nl",
                message: {
                subject: `Je bent toegevoegd de groep ${groupName} op ${communityNameDB}`,
                html: `
                    Je bent toegevoegd de groep ${groupName} op ${communityNameDB} door een beheerder. <br><br>
    
    
                    Bekijk de groep <a href='https://deccos.co/${client}/Registrations'>hier</a>.<br><br>
                    
                    `,
                Gebruikersnaam: `${userName}`,
                Emailadres: userEmail,
                Type: "Add to group"
                  }     
              });
        })

    }

    const newUserHandler = (e) => {
        const userData = e.target.dataset.userdata

        setNewuser(userData)
    }

    console.log(newUser)

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
                    <div className='divider'>
                        <h3>Groepsleden</h3>
                        {members && members.map(member => (
                            <div className='groupsettings-detail-member-container'>
                                <img src={member.UserPhoto} alt=""/>
                                <p>{member.UserName}</p>
                                <button className='userrole-users-delete-button button-simple'>Verwijderen</button>
                            </div>
                        ))}
                    </div>
                    <div className='divider'>
                        <h3>Leden toevoegen aan groep</h3>
                        <select name="" id="" onChange={newUserHandler}>
                            <option value="">-- Selecteer een lid --</option>
                            {users && users.map(user => (
                                <option 
                                value=""
                                data-userdata={user}>
                                    {user.UserName}
                                </option>
                            ))}
                        </select>
                        <div className="button-container">
                            <button 
                            className="button-simple" onClick={saveNewMember}>Toevoegen</button>
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
