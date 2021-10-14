import LeftSideBar from "./LeftSideBar";
import LeftSideBarFullScreen from "./LeftSideBarFullScreen"
import RightSideBar from "./rightSideBar/RightSideBar"
import { client } from '../hooks/Client';
import articleIcon from '../images/icons/article-icon.png'
import { useFirestoreChannelItems, useFirestoreID } from "../firebase/useFirestore";
import { useHistory } from "react-router-dom";
import { motion } from "framer-motion";
import Location from "../hooks/Location"
import { useState, useContext } from 'react';
import { auth, db, timestamp } from '../firebase/config';
import { Auth } from '../StateManagment/Auth';
import MenuStatus from "../hooks/MenuStatus";
import firebase from 'firebase';

const Channel = () => {
    const [displayAddNew, setDisplayAddNew] = useState("none")
    const [authO] = useContext(Auth)

    const route = Location()[3]
    const channels = useFirestoreID("Channels", route)
    const items = useFirestoreChannelItems("ChannelItems", route)
    const history = useHistory()

    const menuState = MenuStatus()

    let channelTitle = null

    channels && channels.forEach(channel => {
        channelTitle = channel.Name
    })

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

    return (
        <div className="main">
            <LeftSideBar />
            <LeftSideBarFullScreen/>
            <div className="main-container" style={{display: menuState}}>
                <div className="page-header">
                    <h1>{channelTitle}</h1>
                    <button className="button-simple">Lid worden</button>
                </div>
                {channels && channels.map(channel => (
                <div className="card-container">
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