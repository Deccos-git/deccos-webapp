import LeftSideBarAuthProfile from "../LeftSideBarAuthProfile"
import LeftSideBarAuthProfileFullScreen from "../LeftSideBarAuthProfileFullScreen";
import RightSideBar from "../rightSideBar/RightSideBar";
import { useFirestore, useFirestoreID, useFirestoreSubscriptionsChannelGroup, useFirestoreUsers } from "../../firebase/useFirestore";
import Location from "../../hooks/Location"
import deleteIcon from '../../images/icons/delete-icon.png'
import { useHistory } from "react-router-dom"
import { client } from "../../hooks/Client";
import { useState, useEffect } from "react";
import MenuStatus from "../../hooks/MenuStatus";
import { db, timestamp } from "../../firebase/config.js"
import uuid from 'react-uuid';

const GroupSettingsDetail = () => {
    const [title, setTitle] = useState("")
    const [userName, setUserName] = useState('')
    const [userPhoto, setUserPhoto] = useState('')
    const [userID, setUserID] = useState('')
    const [userEmail, setUserEmail] = useState('')
    const [communityNameDB, setCommunityNameDB] = useState('')
    const [groupID, setGroupID] = useState('')
    const [groupDocID, setGroupDocID] = useState('')
    const [groupName, setGroupName] = useState('')

    const route = Location()[3]
    const menuState = MenuStatus()
    const history = useHistory()
    const id = uuid()

    const groups = useFirestoreID("Groups", route)
    const users = useFirestoreUsers(false)
    const members = useFirestoreSubscriptionsChannelGroup(route)
    const compagnies = useFirestore("CompagnyMeta")
    const groupChannels = useFirestoreID('GroupChannels', route)

    console.log(groupChannels)

    useEffect(() => {
        compagnies && compagnies.forEach(comp => {
            setCommunityNameDB(comp.CommunityName)
        })
    },[compagnies])

    useEffect(() => {
        groups && groups.forEach(group => {
            setGroupID(group.ID)
            setGroupDocID(group.docid)
            setGroupName(group.Room)
        })
    },[groups])
   
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
            .then(() => {
                changeGroupChannelName()
            })
        })

        e.target.innerHTML = "Opgeslagen"
    }

    const changeGroupChannelName = () => {
        groupChannels && groupChannels.forEach(channel => {
            db.collection('GroupChannels')
            .doc(channel.docid)
            .update({
                Name: title
            })
        })
    }

    const saveNewMember = (e) => {

        db.collection('Subscriptions')
        .doc()
        .set({
            UserName: userName,
            UserID: userID,
            UserPhoto: userPhoto,
            UserEmail: userEmail,
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
    
    
                    Bekijk de groep <a href='https://deccos.co/${client}/Group/${groupID}'>hier</a>.<br><br>
                    
                    `,
                Gebruikersnaam: `${userName}`,
                Emailadres: userEmail,
                Type: "Add to group"
                  }     
              });
        })

    }

    const newUserHandler = (e) => {
        const userName = e.target.options[e.target.selectedIndex].dataset.username
        const userPhoto = e.target.options[e.target.selectedIndex].dataset.userphoto
        const userID = e.target.options[e.target.selectedIndex].dataset.userid
        const userEmail = e.target.options[e.target.selectedIndex].dataset.useremail

        setUserName(userName)
        setUserPhoto(userPhoto)
        setUserID(userID)
        setUserEmail(userEmail)
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
                    <div className='divider'>
                        <h3>Groepsleden</h3>
                        {members && members.map(member => (
                            <div className='groupsettings-detail-member-container' key={member.ID}>
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
                                key={user.ID}
                                data-username={user.UserName}
                                data-userphoto={user.Photo}
                                data-userid={user.ID}
                                data-useremail={user.Email}>
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
