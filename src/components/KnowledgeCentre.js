import { client } from '../hooks/Client';
import articleIcon from '../images/icons/article-icon.png'
import { Link } from "react-router-dom";
import LeftSideBar from "./LeftSideBar"
import LeftSideBarFullScreen from "./LeftSideBarFullScreen"
import RightSideBar from "./rightSideBar/RightSideBar"
import ArticleCard from './ArticleCard';
import { useFirestore, useFirestoreChannelName } from '../firebase/useFirestore.js';
import { motion } from "framer-motion"
import { useState, useContext, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { Auth } from '../StateManagment/Auth';
import MenuStatus from "../hooks/MenuStatus";
import firebase from 'firebase';

const KnowledgeCentre = () => {
    const [authO] = useContext(Auth)
    
    const [displayAddNew, setDisplayAddNew] = useState("none")
    const [channelID, setChannelID] = useState('')
    const [isMember, setIsMember] = useState('none')
    const [memberStatus, setMemberStatus] = useState('Lid worden')

    const docs = useFirestore("KnowledgeCentre")
    const channels = useFirestoreChannelName('Kenniscentrum')
    const authors = useFirestore('Authors')

    const menuState = MenuStatus()

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

    console.log(displayAddNew)

    useEffect(() => {
        authors && authors.forEach(author => {
            if(author.UserID === authO.ID){
                setDisplayAddNew("flex")
            }
        })
    }, [authors])

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
                    <h1>Kenniscentrum</h1>
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
                            <h2>Voeg een artikel toe</h2>
                            <Link to={`/${client}/AddArticle`}><button>Voeg toe</button></Link>
                        </div>
                    </motion.div>
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
