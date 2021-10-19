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
    const [displayAddNew, setDisplayAddNew] = useState("none")
    const [authO] = useContext(Auth)
    const [channelID, setChannelID] = useState('')
    const [isMember, setIsMember] = useState('none')
    const [memberStatus, setMemberStatus] = useState('Lid worden')

    let channelTitle = null

    const route = Location()[3]
    const channels = useFirestoreID("Channels", route)
    const items = useFirestoreChannelItems("ChannelItems", route)
    const channelsName = useFirestoreChannelName(channelTitle)
    const admins = useFirestore('Admins')

    const history = useHistory()

    const menuState = MenuStatus()

    channels && channels.forEach(channel => {
        channelTitle = channel.Name
    })

    useEffect(() => {
        channelsName && channelsName.forEach(channel => {
            setChannelID(channel.docid)

            if(channel.Members.includes(authO.ID)){
                setIsMember('flex')
                setMemberStatus('Je bent lid')
            }
        })
    },[channels])

        useEffect(() => {
            admins && admins.forEach(admin => {
                if(admin.UserID === authO.ID){
                    setDisplayAddNew("flex")
                }
            })
        }, [admins])

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

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    const variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }

    const addItem = (e) => {
        const id = e.target.dataset.id

        history.push(`/${client}/AddChannelItem/${id}`)

    }

    const profileLink = (e) => {
        const id = e.target.dataset.id

        history.push(`/${client}/PublicProfile/${id}`)
    }

    const becomeMember = (e) => {

        e.target.innerText = 'Lid geworden'

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
                <div className="page-header">
                    <h1>{channelTitle}</h1>
                    <button className="button-simple" onClick={becomeMember}>{memberStatus}</button>
                </div>
                {channels && channels.map(channel => (
                <div className="card-container" style={{display: isMember}}>
                    <motion.div 
                    className="card"
                    style={{display: displayAddNew}}
                    initial="hidden"
                    animate="visible"
                    variants={variants}>
                        <img className="card-banner" src={articleIcon} alt="" />
                        <div className="list-inner-container">
                            <div className="article-card-user-container">
                                <img src={authO.Photo} alt="" />
                                <p>{authO.UserName}</p>
                            </div>
                            <h2>Voeg een item toe</h2>
                            <button onClick={addItem} data-id={channel.ID}>Voeg toe</button>
                        </div>
                    </motion.div>
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
                ))}
            </div>
            <RightSideBar />
        </div>
    )
}

export default Channel