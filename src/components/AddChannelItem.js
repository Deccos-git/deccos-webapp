import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./rightSideBar/RightSideBar"
import { useState } from 'react'
import { motion } from "framer-motion"
import { db, timestamp } from "../firebase/config.js"
import { client } from '../hooks/Client';
import { useHistory } from "react-router-dom";
import uuid from 'react-uuid';
import { Auth } from '../StateManagment/Auth';
import { useFirestore } from '../firebase/useFirestore.js';
import { Editor } from '@tinymce/tinymce-react';
import { useRef, useContext } from 'react';
import firebase from 'firebase'
import { bucket } from '../firebase/config';
import spinnerRipple from '../images/spinner-ripple.svg'
import Location from "../hooks/Location"

const AddChannelItem = () => {
    const [authO] = useContext(Auth)
    const route = Location()[3]

    const id = uuid()
    const compagny = useFirestore("CompagnyMeta")
    const editorRef = useRef(null);
    const history = useHistory()

    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [bannerPhoto, setBannerPhoto] = useState("")
    const [loader, setLoader] = useState("")

    const variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }

    const titleHandler = (e) => {
        const title = e.target.value
        setTitle(title)
    }

    const bodyHandler = (e) => {
        if (editorRef.current) {
            setBody(editorRef.current.getContent());
            }
    }

    let banner = ""

    compagny && compagny.forEach(comp => {
        banner = comp.ActivityBanner.NewEvent
    })

    const photoHandler = (e) => {
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
            Banner: bannerPhoto
        })
        .then(() => {
            db.collection("AllActivity")
            .doc()
            .set({
                Title: title,
                Type: `New${route.Channel}`,
                Compagny: client,
                Timestamp: timestamp,
                ID: id,
                Description: `heeft een nieuw ${route.Channel} toegevoegd:`,
                ButtonText: "Bekijk bericht",
                User: authO.UserName,
                UserPhoto: authO.Photo,
                Banner: banner,
                Link: `ChannelDetail`
            }) 
        })
        .then(() => {
    
            history.push(`/${client}/Channel${route}`)
        })
    }

    return (
        <div className="main">
            <LeftSideBar />
            <motion.div className="article"
            initial="hidden"
            animate="visible"
            variants={variants}>
                <div className="card-header">
                        <h2>Voeg een item toe</h2>
                </div>
                <form id="add-goal-form">
                    <div className="divider">
                        <h4>Geef het item een titel</h4>
                        <input type="text" placeholder="Schrijf hier de titel" onChange={titleHandler} />
                    </div >
                    <div className="divider">
                        <h4>Geef het item een omschrijving</h4>
                        <Editor onChange={bodyHandler}
                        apiKey="dz1gl9k5tz59z7k2rlwj9603jg6xi0bdbce371hyw3k0auqm"
                        onInit={(evt, editor) => editorRef.current = editor}
                        init={{
                        height: 500,
                        menubar: false,
                        plugins: [
                            'advlist autolink lists link image charmap print preview anchor',
                            'searchreplace visualblocks code fullscreen',
                            'insertdatetime media table paste code help'
                        ],
                        toolbar: 'undo redo | formatselect | ' +
                        'bold italic backcolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                        content_style: 'body { font-family: Raleway, sans-serif; font-size:14px; color: gray }'
                        }}
                        />
                    </div>
                    <div className="divider">
                        <h4>Voeg een bannerfoto toe</h4>
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
