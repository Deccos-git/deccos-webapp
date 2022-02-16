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
import ButtonClicked from "../../hooks/ButtonClicked";

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
    const [description, setDescription] = useState('')

    const route = Location()[3]
    const menuState = MenuStatus()
    const history = useHistory()
    const id = uuid()

    const groups = useFirestoreID("Groups", route)
    const users = useFirestoreUsers(false)
    const members = useFirestoreSubscriptionsChannelGroup(route)
    const compagnies = useFirestore("CompagnyMeta")
    const groupChannels = useFirestoreID('GroupChannels', route)

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
            setDescription(group.Description)
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

        ButtonClicked(e, "Opgeslagen")

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

        ButtonClicked(e, "Toegevoegd")

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

    const descriptionHandler = (e) => {
        const description = e.target.value
        
        setDescription(description)

    }

    const saveDescription = (e) => {

        ButtonClicked(e, "Opgeslagen")

        const docid = e.target.dataset.docid 

        db.collection('Groups')
        .doc(docid)
        .update({
            Description: description
        })
    }

    const deleteMember = (e) => {

        const docid = e.target.dataset.docid

        db.collection('Subscriptions')
        .doc(docid)
        .delete()
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
                        <input className="input-classic" type="text" defaultValue={group.Room} onChange={titleHandler}/>
                        <div className="button-container">
                            <button className="button-simple" onClick={saveTitle}>Opslaan</button>
                        </div>
                    </div>
                    <div className="divider">
                        <h3>Omschrijving</h3>
                        <p>Geef een omschrijving van je groep zodat mensen weten wat ze van deze groep kunnen verwachten.</p>
                        <textarea name="" id="" cols="30" rows="10" defaultValue={description} onChange={descriptionHandler}></textarea>
                        <div className="button-container">
                            <button className="button-simple" data-docid={group.docid} onClick={saveDescription}>Opslaan</button>
                        </div>
                    </div>
                    <div className='divider'>
                        <h3>Groepsleden</h3>
                        {members && members.map(member => (
                            <div className='groupsettings-detail-member-container' key={member.ID}>
                                <img src={member.UserPhoto} alt=""/>
                                <p>{member.UserName}</p>
                                <img className='userrole-users-delete-button' data-docid={member.docid} src={deleteIcon} alt="" onClick={deleteMember} />
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
