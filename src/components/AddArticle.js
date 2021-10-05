import LeftSideBar from "./LeftSideBar"
import LeftSideBarFullScreen from "./LeftSideBarFullScreen"
import RightSideBar from "./rightSideBar/RightSideBar"
import { useState } from 'react'
import { motion } from "framer-motion"
import { db, timestamp } from "../firebase/config.js"
import { client } from '../hooks/Client';
import { Link } from "react-router-dom";
import uuid from 'react-uuid';
import { useFirestore } from '../firebase/useFirestore.js';
import { Editor } from '@tinymce/tinymce-react';
import { useRef, useContext } from 'react';
import firebase from 'firebase'
import { bucket } from '../firebase/config';
import spinnerRipple from '../images/spinner-ripple.svg'
import { Auth } from '../StateManagment/Auth';
import MenuStatus from "../hooks/MenuStatus";

const AddArticle = () => {
    const [authO] = useContext(Auth)

    const id = uuid()
    const compagny = useFirestore("CompagnyMeta")
    const editorRef = useRef(null);
    const menuState = MenuStatus()

    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [categorie, setCategorie] = useState("")
    const [newCategorie, setNewCategorie] = useState("")
    const [bannerPhoto, setBannerPhoto] = useState("")
    const [loader, setLoader] = useState("")

    console.log(title, body, categorie)

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

    const categoryHandler = (e) => {
        const option = e.target.options

        const categorie = option[option.selectedIndex].innerHTML

        setCategorie(categorie)
    }

    const newCategorieHandler = (e) => {
        const newCategorie = e.target.value

        setNewCategorie(newCategorie)
    }

    let banner = ""
    let compagnyId = ""

    compagny && compagny.forEach(comp => {
        banner = comp.ActivityBanner.NewArticle
        compagnyId = comp.docid
    })

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

    const saveNewcategorie = (e) => {

        e.preventDefault()

        compagnyId && 
        db.collection("CompagnyMeta")
        .doc(compagnyId)
        .update({
            Categories: firebase.firestore.FieldValue.arrayUnion(newCategorie)
        })
    }
    

    const saveArticle = (e) => {

        db.collection("KnowledgeCentre")
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
            Categorie: categorie,
            Banner: bannerPhoto
        })
        .then(() => {
            db.collection("AllActivity")
            .doc()
            .set({
                Title: title,
                Type: "NewArticle",
                Compagny: client,
                Timestamp: timestamp,
                ID: id,
                Description: "heeft een nieuw artikel toegevoegd:",
                ButtonText: "Bekijk artikel",
                User: authO.UserName,
                UserPhoto: authO.Photo,
                UserID: authO.ID,
                Banner: banner,
                Link: `ChannelDetail`
            }) 
        })
    }

    return (
        <div className="main">
            <LeftSideBar />
            <LeftSideBarFullScreen/>
            <motion.div className="article"
            initial="hidden"
            animate="visible"
            variants={variants}
            style={{display: menuState}}>
                <div className="card-header">
                        <h2>Voeg een artikel toe</h2>
                        <p>Voeg een nieuw artikel voor de leden van de community</p>
                </div>
                <form id="add-goal-form">
                    <div className="divider">
                        <h4>Geef het artikel een titel</h4>
                        <input type="text" placeholder="Schrijf hier de titel" onChange={titleHandler} />
                    </div >
                    <div className="divider">
                        <h4>Schrijf je artikel</h4>
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
                        <h4>Voeg een categorie toe</h4>
                        {compagny && compagny.map(comp => (
                                <select name="" id="" onChange={categoryHandler} key={uuid()}>
                                     {comp.Categories.map(cat => (
                                        <option value="" key={uuid()}>{cat}</option>
                                    ))}
                                </select>
                        ))}
                        <p>Voeg een nieuwe categorie toe aan de categorielijst</p>
                        <input type="text" placeholder="Schrijf hier je catgeorie" onChange={newCategorieHandler} />
                        <p className="button-minimal" onClick={saveNewcategorie}>Voeg toe</p>
                    </div>
                    <div>
                        <p>Voeg een bannerfoto toe</p>
                        <input onChange={photoHandler} type="file" />
                        <div className="spinner-container">
                            <img src={loader} alt="" />
                        </div> 
                    </div>
                </form>
                <div id="button-add-goal">
                    <Link to={`/${client}/KnowledgeCentre`}><button onClick={saveArticle}>Opslaan</button></Link>
                </div>
            </motion.div>
            <RightSideBar />
        </div>
    )
}

export default AddArticle
