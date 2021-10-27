import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./rightSideBar/RightSideBar"
import { useFirestoreID, useFirestoreSubscriptions, useFirestoreSubscriptionsChannelGroup } from "../firebase/useFirestore"
import { db, timestamp } from "../firebase/config"
import firebase from "firebase"
import { useHistory } from "react-router"
import { client } from '../hooks/Client';
import { useContext, useState, useEffect } from 'react';
import { Auth } from '../StateManagment/Auth';
import Location from "../hooks/Location"
import uuid from 'react-uuid';

const GroupLanding = () => {
    const [authO] = useContext(Auth)
    const [groupID, setGroupID] = useState('')
    const [groupName, setGroupName] = useState('')
    const [showButton, setShowButton] = useState('block')
    const [showNotice, setShowNotice] = useState('none')
    const [memberCount, setMemberCount] = useState('')
    const [creationDate, setCreationDate] = useState('')

    const route = Location()[3]

    const groups = useFirestoreID("Groups", route)
    const subscriptions = useFirestoreSubscriptions(authO.ID)
    const members = useFirestoreSubscriptionsChannelGroup(route)

    const history = useHistory()
    const id = uuid()
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    useEffect(() => {
        groups && groups.forEach(group => {
            setGroupID(group.ID)
            setGroupName(group.Room)
            setCreationDate(group.Timestamp.toDate().toLocaleDateString("nl-NL", options))
        })
    }, [groups])

    useEffect(() => {
        subscriptions && subscriptions.forEach(sub => {

            if(sub.UserID === authO.ID && sub.SubID === groupID && sub.Approved === true){

                history.push(`/${client}/Group/${groupID}`)
            } else if(sub.UserID === authO.ID && sub.SubID === groupID && sub.Approved === false) {
                setShowButton('none')
                setShowNotice('block')
            }
        })
    },[subscriptions])

    useEffect(() => {
        members && members.forEach(member => {
            setMemberCount(members.length)
        })
        
    }, [members])

    const subscribeToGroup = () => {
        db.collection('Subscriptions')
        .doc()
        .set({
            UserName: authO.UserName,
            UserID: authO.ID,
            SubID: groupID,
            SubName: groupName,
            Timestamp: timestamp,
            Compagny: client,
            Approved: false,
            ID: id,
            Type: 'Group'
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
