import LeftSideBar from "./LeftSideBar";
import LeftSideBarFullScreen from "./LeftSideBarFullScreen"
import RightSideBar from "./rightSideBar/RightSideBar"
import { client } from '../hooks/Client';
import articleIcon from '../images/icons/article-icon.png'
import { useFirestoreChannelItems, useFirestoreID, useFirestoreChannelName, useFirestore } from "../firebase/useFirestore";
import { useHistory } from "react-router-dom";
import { motion } from "framer-motion";
import Location from "../hooks/Location"
import { useState, useContext, useEffect } from 'react';
import { auth, db, timestamp } from '../firebase/config';
import { Auth } from '../StateManagment/Auth';
import MenuStatus from "../hooks/MenuStatus";
import firebase from 'firebase';

const Channel = () => {
    const [authO] = useContext(Auth)
    const [isMember, setIsMember] = useState('none')
    const [memberStatus, setMemberStatus] = useState('Lid worden')
    const [channelTitle, setChannelTitle] = useState('')

    const route = Location()[3]
    const channels = useFirestoreID("Channels", route)
    const items = useFirestoreChannelItems("ChannelItems", route)
    const channelsName = useFirestoreChannelName(channelTitle)

    const history = useHistory()
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }
    const menuState = MenuStatus()

    useEffect(() => {
        channels && channels.forEach(channel => {
            setChannelTitle(channel.Name)
        })
    }, [channels])

    useEffect(() => {
        channelsName && channelsName.forEach(channel => {
            if(channel.Members.includes(authO.ID)){
                setIsMember('flex')
                setMemberStatus('Je bent lid')
            }
        })
    },[channelsName])

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

        e.target.innerText = 'Lid geworden'

        const channelID = e.target.dataset.id

        db.collection('Channels')
        .doc(channelID)
        .update({
            Members: firebase.firestore.FieldValue.arrayUnion(authO.ID)
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
                    <button className="button-simple" data-id={channel.docid} onClick={becomeMember}>{memberStatus}</button>
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