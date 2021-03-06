import LeftSideBarAuthProfile from "../LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "../LeftSideBarAuthProfileFullScreen";
import RightSideBar from "../rightSideBar/RightSideBar"
import { motion } from "framer-motion"
import { db, timestamp } from "../../firebase/config.js"
import { client } from '../../hooks/Client';
import { useHistory } from "react-router-dom";
import uuid from 'react-uuid';
import { Auth } from '../../StateManagment/Auth';
import { useFirestore, useFirestoreID } from '../../firebase/useFirestore.js';
import { Editor } from '@tinymce/tinymce-react';
import { useRef, useContext, useState, useEffect } from 'react';
import firebase from 'firebase'
import { bucket } from '../../firebase/config';
import spinnerRipple from '../../images/spinner-ripple.svg'
import Location from "../../hooks/Location"
import MenuStatus from "../../hooks/MenuStatus";
import TinyMCE from './TinyMCE'
import ScrollToTop from "../../hooks/ScrollToTop";

const AddChannelItem = () => {
    const [authO] = useContext(Auth)
    const [channelName, setChannelName] = useState("")
    const [headerPhoto, setHeaderPhoto] = useState('')
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [bannerPhoto, setBannerPhoto] = useState("")
    const [loader, setLoader] = useState("")

    const route = Location()[3]

    const channels = useFirestoreID("Channels", route)
    const banners = useFirestore('Banners')

    const id = uuid()
    const history = useHistory()
    const menuState = MenuStatus()
    ScrollToTop()

    const variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }

    useEffect(() => {
        banners && banners.forEach(banner => {
            const header = banner.NewChannelItem
            console.log(header)
            setHeaderPhoto(header)
        })
    }, [banners])

    useEffect(() => {
        channels && channels.forEach(channel => {
            setChannelName(channel.Name)
        })
    }, [channels])

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
    
    const saveItem = () => {

        db.collection("ChannelItems")
        .doc()
        .set({
            Title: title,
            Body: body,
            Compagny: client,
            Timestamp: timestamp,
            ID: id,
            ChannelID: route,
            User: authO.UserName,
            UserPhoto: authO.Photo,
            UserID: authO.ID,
            Banner: bannerPhoto,
            Type: 'ChannelItems'
        })
        .then(() => {
            db.collection("AllActivity")
            .doc()
            .set({
                Title: title,
                Type: `New Item`,
                Compagny: client,
                Timestamp: timestamp,
                ID: id,
                Description: `heeft een nieuw item aan ${channelName} toegevoegd:`,
                ButtonText: "Bekijk bericht",
                User: authO.UserName,
                UserPhoto: authO.Photo,
                UserID: authO.ID,
                Banner: headerPhoto,
                Link: `ChannelDetail/${id}`
            }) 
        })
        .then(() => {
            db.collection("Search")
            .doc()
            .set({
                Name: title,
                Compagny: client,
                Type: 'KanaalItem',
                Link: `ChannelDetail/${id}`
            })
        })
        .then(() => {
    
            history.push(`/${client}/Channel/${route}`)
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
                        <h1>Voeg een item toe aan {channelName} </h1>
                </div>
                <form id="add-goal-form">
                    <div className="divider">
                        <h2>Geef het item een titel</h2>
                        <input type="text" placeholder="Schrijf hier de titel" onChange={titleHandler} />
                    </div >
                    <TinyMCE setBody={setBody}/>
                    <div className="divider">
                        <h2>Voeg een bannerfoto toe</h2>
                        <input onChange={photoHandler} type="file" />
                        <div className="spinner-container">
                            <img src={loader} alt="" />
                        </div> 
                    </div>
                </form>
                <div className="button-container" id="button-add-event">
                    <button onClick={saveItem}>Opslaan</button>
                </div>
            </motion.div>
            <RightSideBar />
        </div>
    )
}

export default AddChannelItem
