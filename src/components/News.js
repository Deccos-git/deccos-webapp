import LeftSideBar from "./LeftSideBar"
import LeftSideBarFullScreen from "./LeftSideBarFullScreen"
import RightSideBar from "./rightSideBar/RightSideBar"
import { client } from '../hooks/Client';
import { Link } from "react-router-dom";
import { useFirestore, useFirestoreChannelName } from "../firebase/useFirestore";
import { useHistory } from "react-router-dom"
import newsIcon from '../images/icons/news-icon.png'
import { useState, useContext, useEffect } from 'react';
import { auth, db, timestamp } from '../firebase/config';
import { motion } from "framer-motion"
import { Auth } from '../StateManagment/Auth';
import MenuStatus from "../hooks/MenuStatus";
import firebase from 'firebase';

const News = () => {
    const [authO] = useContext(Auth)

    const [channelID, setChannelID] = useState('')
    const [isMember, setIsMember] = useState('none')
    const [memberStatus, setMemberStatus] = useState('Lid worden')

    const news = useFirestore("News")
    const history = useHistory()
    const channels = useFirestoreChannelName('Nieuws')

    const menuState = MenuStatus()
    
    const options = {year: 'numeric', month: 'numeric', day: 'numeric' };

    useEffect(() => {
        channels && channels.forEach(channel => {
            setChannelID(channel.docid)

            if(channel.Members.includes(authO.ID)){
                setIsMember('flex')
                setMemberStatus('Je bent lid')
            }
        })
    },[channels])

    const detailRouter = (e) => {

        const id = e.target.dataset.id 
        const docid = e.target.dataset.docid

        db.collection("News")
        .doc(docid)
        .update({
            Clicks: firebase.firestore.FieldValue.arrayUnion(timestamp)
        })
        .then(() => {
            history.push(`/${client}/NewsDetail/${id}`)
        })

    }

    const variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
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
                    <h1>Nieuws</h1>
                    <button className="button-simple" onClick={becomeMember}>{memberStatus}</button>
                </div>
                <div className="card-container" style={{display: isMember}}>
                    {news && news.map(item => (
                        <div className="card">
                            <img className="card-banner" src={item.Banner} alt="" />
                            <div className="article-card-user-container">
                                <img src={item.UserPhoto} alt="" data-id={item.UserID} onClick={profileLink} />
                                <p data-id={item.UserID} onClick={profileLink}>{item.User}</p>
                                <p className="list-card-timestamp">{item.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                            </div>
                            <div className="list-inner-container">
                                <h2>{item.Title}</h2>
                                <button onClick={detailRouter} data-docid={item.docid} data-id={item.ID}>Bekijk</button>
                            </div>
                        </div>
                    ))}
                </div>
                </div>
            <RightSideBar />
        </div>
    )
}

export default News