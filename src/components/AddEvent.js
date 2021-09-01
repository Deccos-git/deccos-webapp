import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./rightSideBar/RightSideBar"
import { useState } from 'react'
import { motion } from "framer-motion"
import { db, timestamp } from "../firebase/config.js"
import { client } from '../hooks/Client';
import { Link } from "react-router-dom";
import uuid from 'react-uuid';
import Auth from '../firebase/Auth.js';
import { useFirestore } from '../firebase/useFirestore.js';
import { Editor } from '@tinymce/tinymce-react';
import { useRef } from 'react';
import firebase from 'firebase'
import { bucket } from '../firebase/config';
import spinnerRipple from '../images/spinner-ripple.svg'

const AddEvent = () => {

    const auth = Auth()
    const id = uuid()
    const compagny = useFirestore("CompagnyMeta")
    const editorRef = useRef(null);

    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [bannerPhoto, setBannerPhoto] = useState("")
    const [loader, setLoader] = useState("")
    const [capacity, setCapacity] = useState("")
    const [price, setPrice] = useState("")
    const [date, setDate] = useState("")

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

    const dateHandler = (e) => {
        const date = e.target.value
        setDate(date)
    }

    const priceHandler = (e) => {
        const price = e.target.value
        setPrice(price)
    }

    const capacityHandler = (e) => {
        const capacity = e.target.value
        setCapacity(capacity)
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
    
    const saveEvent = (e) => {

        db.collection("Events")
        .doc()
        .set({
            Title: title,
            Body: body,
            Compagny: client,
            Timestamp: timestamp,
            ID: id,
            User: auth.UserName,
            UserPhoto: auth.Photo,
            UserID: auth.ID,
            Price: price,
            Capacity: capacity,
            Date: date,
            Banner: bannerPhoto
        })
        .then(() => {
            db.collection("AllActivity")
            .doc()
            .set({
                Title: title,
                Type: "NewEvent",
                Compagny: client,
                Timestamp: timestamp,
                ID: id,
                Description: "heeft een nieuw event toegevoegd:",
                ButtonText: "Bekijk event",
                User: auth.UserName,
                UserPhoto: auth.Photo,
                Banner: banner,
                Link: `ChannelDetail`
            }) 
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
                        <h2>Voeg een event toe</h2>
                        <p>Voeg een nieuw event waar de leden van de community zich voor aan kunnen melden</p>
                </div>
                <form id="add-goal-form">
                    <div className="divider">
                        <h4>Geef het event een titel</h4>
                        <input type="text" placeholder="Schrijf hier de titel" onChange={titleHandler} />
                    </div >
                    <div className="divider">
                        <h4>Geef het event een omschrijving</h4>
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
                    <div className="divider">
                        <h4>Is het event online of heeft een fysieke locatie?</h4>
                        <select name="" id="">
                            <option value="online">Online</option>
                            <option value="fysical-location">Fysieke locatie</option>
                        </select>
                    </div>
                    <div className="divider">
                        <h4>Wanneer vindt het event plaats?</h4>
                        <input type="date" onChange={dateHandler} />
                    </div>
                    <div className="divider">
                        <h4>Hoeveel kost het event?</h4>
                        <input type="number" onChange={priceHandler} />
                    </div>
                    <div className="divider">
                        <h4>Wat is het maximaal aantal deelnemers?</h4>
                        <input type="number" onChange={capacityHandler}/>
                    </div>
                </form>
                <div className="button-container" id="button-add-event">
                    <Link to={`/${client}/Events`}><button onClick={saveEvent}>Opslaan</button></Link>
                </div>
            </motion.div>
            <RightSideBar />
        </div>
    )
}

export default AddEvent
