import LeftSideBar from "./LeftSideBar";
import LeftSideBarFullScreen from "./LeftSideBarFullScreen"
import RightSideBar from "./rightSideBar/RightSideBar"
import { client } from '../hooks/Client';
import articleIcon from '../images/icons/article-icon.png'
import { useFirestoreChannelItems, useFirestoreID, useFirestoreChannelName, useFirestoreSubscriptions } from "../firebase/useFirestore";
import { useHistory } from "react-router-dom";
import { motion } from "framer-motion";
import Location from "../hooks/Location"
import { useState, useContext, useEffect } from 'react';
import { auth, db, timestamp } from '../firebase/config';
import { Auth } from '../StateManagment/Auth';
import MenuStatus from "../hooks/MenuStatus";
import firebase from 'firebase';
import uuid from 'react-uuid';

const Channel = () => {
    const [authO] = useContext(Auth)
    const [isMember, setIsMember] = useState('none')
    const [memberStatus, setMemberStatus] = useState('Abonneren')
    const [channelTitle, setChannelTitle] = useState('')

    const route = Location()[3]
    const menuState = MenuStatus()
    const channels = useFirestoreID("Channels", route)
    const items = useFirestoreChannelItems("ChannelItems", route)
    const channelsName = useFirestoreChannelName(channelTitle)
    const subscriptions = useFirestoreSubscriptions(authO.ID)
    const id = uuid()

    const history = useHistory()
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }
    

    useEffect(() => {
        channels && channels.forEach(channel => {
            setChannelTitle(channel.Name)
        })
    }, [channels])

    useEffect(() => {
        subscriptions && subscriptions.forEach(sub => {
            if(sub.SubID === route){
                setIsMember('flex')
                setMemberStatus('Geabonneerd')
            }
        })
    },[subscriptions])

    const updateRoute = (e) => {

        const channelID = e.target.dataset.id
        const docid = e.target.dataset.docid

        db.collection("ChannelItems")
        .doc(docid)
        .update({
            Clicks: firebase.firestore.FieldValue.arrayUnion(timestamp)
        })
        .then(() => {
            history.push(`/${client}/ChannelDetail/${channelID}`)
        })

    }

    const profileLink = (e) => {
        const id = e.target.dataset.id

        history.push(`/${client}/PublicProfile/${id}`)
    }

    const becomeMember = (e) => {

        e.target.innerText = 'Geabonneerd'

        const channelID = e.target.dataset.id
        const name = e.target.dataset.name

        db.collection('Subscriptions')
        .doc()
        .set({
            UserName: authO.UserName,
            UserID: authO.ID,
            SubID: channelID,
            UserEmail: authO.Email,
            SubName: name,
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
            {channels && channels.map(channel => (
                <>
                <div className="page-header">
                    <h1>{channelTitle}</h1>
                    <button className="subscribe-channel-button" data-name={channel.Name} data-id={channel.ID} onClick={becomeMember}>{memberStatus}</button>
                </div>
                <div className="card-container" style={{display: isMember}}>
                    {items && items.map(item => (
                        <motion.div  initial="hidden"
                        animate="visible"
                        variants={variants} 
                        className="card">
                            <div key={item.ID}>
                                <img className="card-banner" src={item.Banner} alt="" />
                                <div className="list-inner-container">
                                    <div className="article-card-user-container">
                                        <img src={item.UserPhoto} alt="" data-id={item.UserID} onClick={profileLink} />
                                        <p data-id={item.UserID}>{item.User}</p>
                                    </div>
                                    <h2>{item.Title}</h2>
                                    <p>{item.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                                </div>
                                <div className="button-container">
                                    <button onClick={updateRoute} data-docid={item.docid} data-id={item.ID}>Bekijk</button>
                                </div>
                            </div>
                        </motion.div>
                    )) }
                </div>
            </>
            ))}
            </div>
            <RightSideBar />
        </div>
    )
}

export default Channel