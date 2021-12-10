import { client } from '../hooks/Client';
import articleIcon from '../images/icons/article-icon.png'
import { Link } from "react-router-dom";
import LeftSideBar from "./LeftSideBar"
import LeftSideBarFullScreen from "./LeftSideBarFullScreen"
import RightSideBar from "./rightSideBar/RightSideBar"
import ArticleCard from './ArticleCard';
import { useFirestore, useFirestoreChannelName, useFirestoreSubscriptions } from '../firebase/useFirestore.js';
import { motion } from "framer-motion"
import { useState, useContext, useEffect } from 'react';
import { auth, db, timestamp } from '../firebase/config';
import { Auth } from '../StateManagment/Auth';
import MenuStatus from "../hooks/MenuStatus";
import Location from "../hooks/Location"
import uuid from 'react-uuid';

const KnowledgeCentre = () => {
    const [authO] = useContext(Auth)
    const [authID, setAuthID] = useState(null)

    const [channelID, setChannelID] = useState('')
    const [isMember, setIsMember] = useState('none')
    const [memberStatus, setMemberStatus] = useState('Abonneren')

    const docs = useFirestore("KnowledgeCentre")
    const channels = useFirestoreChannelName('Kenniscentrum')
    const subscriptions = useFirestoreSubscriptions(authID)

    const menuState = MenuStatus()
    const route = Location()[3]
    const id = uuid()

    useEffect(() => {
        if(authO.ID != undefined){

            setAuthID(authO.ID)
        }
    },[authO])

    const variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }

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

    const becomeMember = (e) => {

        e.target.innerText = 'Geabonneerd'

        db.collection('Subscriptions')
        .doc()
        .set({
            UserName: authO.UserName,
            UserID: authO.ID,
            UserEmail: authO.Email,
            SubID: channelID,
            SubName: 'Kenniscentrum',
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
                    <h1>Kenniscentrum</h1>
                    <button className="subscribe-channel-button" onClick={becomeMember}>{memberStatus}</button>
                </div>
                <div className="card-container" style={{display: isMember}}>
                    {docs && docs.map(doc => (
                        <ArticleCard doc={doc} key={doc.ID} />
                    ))}
                </div>
            </div>
            <RightSideBar />
        </div>
    )
}

export default KnowledgeCentre
