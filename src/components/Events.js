import LeftSideBar from "./LeftSideBar"
import LeftSideBarFullScreen from "./LeftSideBarFullScreen"
import RightSideBar from "./rightSideBar/RightSideBar"
import { client } from '../hooks/Client';
import { useFirestoreTimestamp, useFirestore, useFirestoreChannelName, useFirestoreSubscriptions } from "../firebase/useFirestore";
import { useHistory } from "react-router-dom"
import { motion } from "framer-motion"
import { useState, useContext, useEffect } from 'react';
import { auth, db, timestamp } from '../firebase/config';
import { Auth } from '../StateManagment/Auth';
import articleIcon from '../images/icons/article-icon.png'
import { Link } from "react-router-dom";
import MenuStatus from "../hooks/MenuStatus";
import firebase from 'firebase';
import Location from "../hooks/Location"
import uuid from 'react-uuid';

const Events = () => {
    const [authO] = useContext(Auth)

    const [channelID, setChannelID] = useState('')
    const [isMember, setIsMember] = useState('none')
    const [memberStatus, setMemberStatus] = useState('Lid worden')

    const events = useFirestoreTimestamp("Events")
    const channels = useFirestoreChannelName('Events')
    const subscriptions = useFirestoreSubscriptions(authO.ID)

    const menuState = MenuStatus()
    const history = useHistory()
    const route = Location()[3]
    const id = uuid()

    const variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }

      useEffect(() => {
        subscriptions && subscriptions.forEach(sub => {

            if(sub.SubID === route){

                setIsMember('flex')
                setMemberStatus('Je bent lid')
            }
        })
    },[subscriptions])

    useEffect(() => {
        channels && channels.forEach(channel => {
            setChannelID(channel.ID)
        })
    },[channels])

    const detailRouter = (e) => {

        const id = e.target.dataset.id 
        const docid = e.target.dataset.docid

        db.collection("Events")
        .doc(docid)
        .update({
            Clicks: firebase.firestore.FieldValue.arrayUnion(timestamp)
        })
        .then(() => {
            history.push(`/${client}/EventDetail/${id}`)
        })

    }

    const profileLink = (e) => {
        const id = e.target.dataset.id

        history.push(`/${client}/PublicProfile/${id}`)
    }

    const becomeMember = (e) => {

        e.target.innerText = 'Lid geworden'

        db.collection('Subscriptions')
        .doc()
        .set({
            UserName: authO.UserName,
            UserID: authO.ID,
            SubID: channelID,
            SubName: 'Events',
            Timestamp: timestamp,
            Compagny: client,
            ID: id,
            Type: 'Channel'
        })
    }

    return (
        <div className="main">
            <LeftSideBar />
            <LeftSideBarFullScreen/>
            <div className="main-container" style={{display: menuState}}>
                <div className="page-header">
                    <h1>Events</h1>
                    <button className="button-simple" onClick={becomeMember}>{memberStatus}</button>
                </div>
                <div className="card-container" style={{display: isMember}}>
                    {events && events.map(even => (
                        <div className="card">
                            <img className="card-banner" src={even.Banner} alt="" />
                            <div className="list-inner-container">
                                <div className="article-card-user-container">
                                    <img src={even.UserPhoto} alt="" data-id={even.UserID} onClick={profileLink} />
                                    <p data-id={even.UserID} onClick={profileLink}>{even.User}</p>
                                </div>
                                <h2>{even.Title}</h2>
                                <p>{even.Date}</p>
                            </div>
                            <div className="button-container">
                                <button onClick={detailRouter} data-docid={even.docid} data-id={even.ID}>Bekijk</button>
                            </div>
                        </div>
                    ))}
                 </div>
            </div>
            <RightSideBar />
        </div>
    )
}

export default Events