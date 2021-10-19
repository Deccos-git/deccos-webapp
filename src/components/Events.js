import LeftSideBar from "./LeftSideBar"
import LeftSideBarFullScreen from "./LeftSideBarFullScreen"
import RightSideBar from "./rightSideBar/RightSideBar"
import { client } from '../hooks/Client';
import { useFirestoreTimestamp, useFirestore, useFirestoreChannelName } from "../firebase/useFirestore";
import { useHistory } from "react-router-dom"
import { motion } from "framer-motion"
import { useState, useContext, useEffect } from 'react';
import { auth, db, timestamp } from '../firebase/config';
import { Auth } from '../StateManagment/Auth';
import articleIcon from '../images/icons/article-icon.png'
import { Link } from "react-router-dom";
import MenuStatus from "../hooks/MenuStatus";
import firebase from 'firebase';

const Events = () => {
    const [authO] = useContext(Auth)

    const [displayAddNew, setDisplayAddNew] = useState("none")
    const [channelID, setChannelID] = useState('')
    const [isMember, setIsMember] = useState('none')
    const [memberStatus, setMemberStatus] = useState('Lid worden')

    const events = useFirestoreTimestamp("Events")
    const channels = useFirestoreChannelName('Events')

    const menuState = MenuStatus()
    const history = useHistory()

    const variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }

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

        db.collection("Events")
        .doc(docid)
        .update({
            Clicks: firebase.firestore.FieldValue.arrayUnion(timestamp)
        })
        .then(() => {
            history.push(`/${client}/EventDetail/${id}`)
        })

    }

    const showAddNew = () => {

        auth.onAuthStateChanged(User =>{
            if(User){
                db.collection("Users")
                .doc(User.uid)
                .get()
                .then(doc => {
                    const author = doc.data().Author

                    if(author === true){
                        setDisplayAddNew("flex")
                    } else if (author === false){
                        setDisplayAddNew("none")
                    }
                })
            }
        })
    }

    showAddNew()

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
                    <h1>Events</h1>
                    <button className="button-simple" onClick={becomeMember}>{memberStatus}</button>
                </div>
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
                            <h2>Voeg een event toe</h2>
                            <Link to={`/${client}/AddEvent`}><button>Voeg toe</button></Link>
                        </div>
                    </motion.div>
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