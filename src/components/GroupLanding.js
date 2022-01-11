import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./rightSideBar/RightSideBar"
import { useFirestoreID, useFirestoreSubscriptions, useFirestoreSubscriptionsChannelGroup, useFirestoreAdmins, useFirestore } from "../firebase/useFirestore"
import { db, timestamp } from "../firebase/config"
import { useHistory } from "react-router"
import { client } from '../hooks/Client';
import { useContext, useState, useEffect } from 'react';
import { Auth } from '../StateManagment/Auth';
import Location from "../hooks/Location"
import uuid from 'react-uuid';

const GroupLanding = () => {
    const [authO] = useContext(Auth)
    const [authID, setAuthID] = useState(null)
    const [groupID, setGroupID] = useState('')
    const [groupDocID, setGroupDocID] = useState('')
    const [groupName, setGroupName] = useState('')
    const [showButton, setShowButton] = useState('block')
    const [showNotice, setShowNotice] = useState('none')
    const [memberCount, setMemberCount] = useState('')
    const [creationDate, setCreationDate] = useState('')
    const [adminEmail, setAdminEmail] = useState('')
    const [communityNameDB, setCommunityNameDB] = useState("")

    const route = Location()[3]

    const groups = useFirestoreID("Groups", route)
    const subscriptions = useFirestoreSubscriptions(authID)
    const members = useFirestoreSubscriptionsChannelGroup(route)
    const admins = useFirestoreAdmins('Admins')
    const compagny = useFirestore("CompagnyMeta")

    const history = useHistory()
    const id = uuid()
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    // No undefined auth

    useEffect(() => {
        if(authO.ID != undefined){

            setAuthID(authO.ID)
        }
    },[authO])

    // Client communityname

    useEffect(() => {
        compagny && compagny.forEach(comp => {
            setCommunityNameDB(comp.CommunityName)
        })
    }, [compagny])

    // Find emailadresses of community admins

    useEffect(() => {
        const adminArray = []
        admins && admins.forEach(admin => {
            adminArray.push(admin.Email)
        })
        setAdminEmail(adminArray)
    }, [admins])

    // Set groups information in state

    useEffect(() => {
        groups && groups.forEach(group => {
            setGroupID(group.ID)
            setGroupDocID(group.docid)
            setGroupName(group.Room)
            setCreationDate(group.Timestamp.toDate().toLocaleDateString("nl-NL", options))
        })
    }, [groups])

    // Check if auth is member

    useEffect(() => {
        members && members.forEach(member => {

            if(member.UserID === authO.ID && member.Approved === true){

                history.push(`/${client}/Group/${groupID}`)
            } else if(member.UserID === authO.ID && member.Approved === false) {
                setShowButton('none')
                setShowNotice('block')
            }
        })
    },[members])

    // Set number of members in state

    useEffect(() => {
        setMemberCount(members.length)
        
    }, [members])

    // Subscribe to group

    const subscribeToGroup = () => {
        db.collection('Subscriptions')
        .doc()
        .set({
            UserName: authO.UserName,
            UserID: authO.ID,
            UserPhoto: authO.Photo,
            UserEmail: authO.Email,
            SubID: groupID,
            SubDocid: groupDocID,
            SubName: groupName,
            Timestamp: timestamp,
            Compagny: client,
            Approved: false,
            ID: id,
            Type: 'Group'
        })
        .then(() => {

            db.collection("Email").doc().set({
                to: adminEmail,
                cc: "info@Deccos.nl",
                message: {
                subject: `Iemand heeft zich aangemeld voor de groep ${groupName} op ${communityNameDB}`,
                html: `
                Iemand heeft zich aangemeld voor de groep ${groupName} op ${communityNameDB}. <br><br>
    
                    Naam: ${authO.UserName}. <br><br>
    
                    Dit lidmaatschap moet door een beheerder worden goedgekeurd.<br><br>
    
                    <a href='https://deccos.co/${client}/Registrations'>Klik hier</a> om de alle openstaande aanvragen te beheren.<br><br>
                    
                    `,
                Gebruikersnaam: `${authO.UserName}`,
                Emailadres: adminEmail,
                Type: "Verification group"
                  }     
              });
        })
    }

    return (
        <div className="main"> 
            <LeftSideBar />
            {groups && groups.map(group => (
                <>
                <div className="profile">
                    <div className="group-landing-container">
                        <h2>{group.Room}</h2>
                        <img src={group.Banner} alt="" />
                    </div>
                    <div id="group-meta-div">
                        <p><b>Aantal leden:</b> {memberCount}</p>
                        <p><b>Gecreerd op:</b> {creationDate}</p>
                    </div>
                    <div id='group-notice' style={{display: showNotice}}>
                        <h3>In de wacht</h3>
                        <p>Je aanmelding wordt door een beheerder van de groep gecontroleerd. Zodra je aanmelding is goedgekeurd ontvang je een email en kun je direct deelnemen aan de groep.</p>
                    </div>
                    <div className="button-container" style={{display: showButton}}>
                        <button onClick={subscribeToGroup}>Aanmelden</button>
                    </div>
                </div>
            <RightSideBar /> 
            </> 
            ))}
        </div>
    )
}

export default GroupLanding
