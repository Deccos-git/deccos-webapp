import LeftSideBar from "../LeftSideBar"
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import RightSideBar from "../rightSideBar/RightSideBar"
import { client } from '../../hooks/Client';
import { useFirestoreTimestamp, useFirestore, useFirestoreChannelName, useFirestoreSubscriptions } from "../../firebase/useFirestore";
import { useHistory } from "react-router-dom"
import { motion } from "framer-motion"
import { useState, useContext, useEffect } from 'react';
import { auth, db, timestamp } from '../../firebase/config';
import { Auth } from '../../StateManagment/Auth';
import MenuStatus from "../../hooks/MenuStatus";
import firebase from 'firebase';
import Location from "../../hooks/Location"
import uuid from 'react-uuid';
import Calendar from "../Calender";

const Events = () => {
    const [authO] = useContext(Auth)
    const [authID, setAuthID] = useState(null)
    const [listViewTab, setListViewTab] = useState('active-tab')
    const [calenderViewTab, setCalenderViewTab] = useState('not-active-tab')
    const [listDisplay, setListDisplay] = useState('flex')
    const [calenderDisplay, setCalenderDisplay] = useState('none')

    const [channelID, setChannelID] = useState('')
    const [isMember, setIsMember] = useState('none')
    const [memberStatus, setMemberStatus] = useState('Abonneren')

    const events = useFirestoreTimestamp("Events")
    const channels = useFirestoreChannelName('Events')
    const subscriptions = useFirestoreSubscriptions(authID)

    const menuState = MenuStatus()
    const history = useHistory()
    const route = Location()[3]
    const id = uuid()

    const variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }

    useEffect(() => {
        if(authO.ID != undefined){

            setAuthID(authO.ID)
        }
    },[authO])

      useEffect(() => {
        subscriptions && subscriptions.forEach(sub => {

            if(sub.SubID === route){

                setIsMember('flex')
                setMemberStatus('Geabonneerd')
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

        e.target.innerText = 'Geabonneerd'

        db.collection('Subscriptions')
        .doc()
        .set({
            UserName: authO.UserName,
            UserID: authO.ID,
            UserEmail: authO.Email,
            SubID: channelID,
            SubName: 'Events',
            Timestamp: timestamp,
            Compagny: client,
            ID: id,
            Type: 'Channel'
        })
    }

    const showListView = () => {
        setListDisplay('flex')
        setCalenderDisplay('none')
        setListViewTab('active-tab')
        setCalenderViewTab('not-active-tab')
    }

    const showCalenderView = () => {
        setListDisplay('none')
        setCalenderDisplay('flex')
        setListViewTab('not-active-tab')
        setCalenderViewTab('active-tab')
    }

    const CalenderView = () => {
        return (

            <div className="card-container" style={{display: isMember}} style={{display: calenderDisplay}}>
                <Calendar events={events}/>
            </div>

        )
    }

    return (
        <div className="main">
            <LeftSideBar />
            <LeftSideBarFullScreen/>
            <div className="main-container" style={{display: menuState}}>
                <div className="page-header">
                    <h1>Events</h1>
                    <button className="subscribe-channel-button" onClick={becomeMember}>{memberStatus}</button>
                    <div className='group-navigation-container'>
                        <p className={listViewTab} onClick={showListView}>Lijst</p>
                        <p className={calenderViewTab} onClick={showCalenderView}>Kalender</p>
                    </div>
                </div>
                <div className="card-container" style={{display: isMember}} style={{display: listDisplay}}>
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
                 <CalenderView/>
            </div>
            <RightSideBar />
        </div>
    )
}

export default Events