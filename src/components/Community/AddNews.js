import LeftSideBarAuthProfile from "../LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "../LeftSideBarAuthProfileFullScreen";
import RightSideBar from "../rightSideBar/RightSideBar"
import { useState } from 'react'
import { motion } from "framer-motion"
import { db, timestamp } from "../../firebase/config.js"
import { client } from '../../hooks/Client';
import { Link } from "react-router-dom";
import uuid from 'react-uuid';
import { useFirestore, useFirestoreChannelName } from '../../firebase/useFirestore.js';
import { useRef, useContext, useEffect } from 'react';
import firebase from 'firebase'
import { bucket } from '../../firebase/config';
import spinnerRipple from '../../images/spinner-ripple.svg'
import { Auth } from '../../StateManagment/Auth';
import MenuStatus from "../../hooks/MenuStatus";
import Modal from 'react-modal';
import TinyMCE from './TinyMCE'

const AddNews = () => {
    const [authO] = useContext(Auth)

    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [bannerPhoto, setBannerPhoto] = useState("")
    const [loader, setLoader] = useState("")
    const [headerPhoto, setHeaderPhoto] = useState('')
    const [channelID, setChannelID] = useState('')

    const banners = useFirestore('Banners')
    const channels = useFirestoreChannelName('News')

    const menuState = MenuStatus()
    const id = uuid()

    // Set channel ID to state

    useEffect(() => {
        channels && channels.forEach(channel => {
            if(channel.Name === 'News'){
                setChannelID(channel.ID)
            }
        })
    }, [channels])

    const variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }

    useEffect(() => {
        banners && banners.forEach(banner => {
            const header = banner.NewNews
            console.log(header)
            setHeaderPhoto(header)
        })
    }, [banners])

    const titleHandler = (e) => {
        const title = e.target.value
        setTitle(title)
    }

    const photoHandler = (e) => {
        setLoader(spinnerRipple)

        const photo = e.target.files[0]

        const storageRef = bucket.ref("/ProfilePhotos/" + photo.name);
        const uploadTask = storageRef.put(photo)

        uploadTask.then(() => {
          
            uploadTask.on('state_changed', snapshot => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED:
                console.log('Upload is paused');
                break;
            case firebase.storage.TaskState.RUNNING:
                console.log('Upload is running');
                break;
            }
            }, (err) => {
                alert(err)
            }, () => {
            uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            console.log('File available at', downloadURL);

            setBannerPhoto(downloadURL)
            setLoader(downloadURL)

                })
            })
        })
    }

    
    const saveEvent = (e) => {

        db.collection("News")
        .doc()
        .set({
            Title: title,
            Body: body,
            Compagny: client,
            Timestamp: timestamp,
            ID: id,
            User: authO.UserName,
            UserPhoto: authO.Photo,
            UserID: authO.ID,
            Banner: bannerPhoto,
            ChannelID: channelID,
            Type: 'News'
        })
        .then(() => {
            db.collection("AllActivity")
            .doc()
            .set({
                Title: title,
                Type: "NewNews",
                Compagny: client,
                Timestamp: timestamp,
                ID: id,
                Description: "heeft een nieuws item toegevoegd:",
                ButtonText: "Bekijk bericht",
                User: authO.UserName,
                UserPhoto: authO.Photo,
                UserID: authO.ID,
                Banner: headerPhoto,
                Link: `NewsDetail/${id}`
            }) 
        })
        .then(() => {
            db.collection("Search")
            .doc()
            .set({
                Name: title,
                Compagny: client,
                Type: 'Nieuws item',
                Link: `NewsDetail/${id}`
            })
        })
    }

    return (
        <div className="main">
             <LeftSideBarAuthProfile />
            <LeftSideBarAuthProfileFullScreen/>
            <motion.div className="article"
            initial="hidden"
            animate="visible"
            variants={variants}
            style={{display: menuState}}>
                <div className="card-header">
                        <h1>Voeg een nieuws item toe</h1>
                        <p>Voeg een nieuws item toe om de leden van de community op de hoogte te houden van de laatste ontwikkelingen</p>
                </div>
                <form id="add-goal-form">
                    <div className="divider">
                        <h2>Geef het nieuws item een titel</h2>
                        <input type="text" placeholder="Schrijf hier de titel" onChange={titleHandler} />
                    </div>
                    <TinyMCE setBody={setBody}/>
                    <div className="divider">
                        <h2>Voeg een bannerfoto toe</h2>
                        <input onChange={photoHandler} type="file" />
                        <div className="spinner-container">
                            <img src={loader} alt="" />
                        </div> 
                    </div>
                </form>
                <div id="button-add-event">
                    <Link to={`/${client}/News`}><button onClick={saveEvent}>Opslaan</button></Link>
                </div>
            </motion.div>
            <RightSideBar />
        </div>
    )
}

export default AddNews
