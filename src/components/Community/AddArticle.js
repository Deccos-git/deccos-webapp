import LeftSideBarAuthProfile from "../LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "../LeftSideBarAuthProfileFullScreen";
import RightSideBar from "../rightSideBar/RightSideBar"
import { useState } from 'react'
import { motion } from "framer-motion"
import { db, timestamp } from "../../firebase/config.js"
import { client } from '../../hooks/Client';
import { Link } from "react-router-dom";
import uuid from 'react-uuid';
import { useFirestore } from '../../firebase/useFirestore.js';
import { useContext, useEffect } from 'react';
import firebase from 'firebase'
import { bucket } from '../../firebase/config';
import spinnerRipple from '../../images/spinner-ripple.svg'
import { Auth } from '../../StateManagment/Auth';
import MenuStatus from "../../hooks/MenuStatus";
import TinyMCE from './TinyMCE'

const AddArticle = () => {
    const [authO] = useContext(Auth)

    const [title, setTitle] = useState("")
    const [categorie, setCategorie] = useState("")
    const [newCategorie, setNewCategorie] = useState("")
    const [bannerPhoto, setBannerPhoto] = useState("")
    const [loader, setLoader] = useState("")
    const [headerPhoto, setHeaderPhoto] = useState('')
    const [compagnyId, setCompagnyID] = useState('')
    const [channelID, setChannelID] = useState('')
    const [body, setBody] = useState("")

    const id = uuid()
    const compagny = useFirestore("CompagnyMeta")
    const banners = useFirestore('Banners')
    const channels = useFirestore("Channels")

    const menuState = MenuStatus()


    // Set banner image in state
    
    useEffect(() => {
        banners && banners.forEach(banner => {
            const header = banner.NewArticle
            setHeaderPhoto(header)
        })
    }, [banners])

    // Set compagny id in state

    useEffect(() => {
        compagny && compagny.forEach(comp => {
            setCompagnyID(comp.docid)
        })
    }, [compagny])

    // Set channel ID to state

    useEffect(() => {
        channels && channels.forEach(channel => {
            if(channel.Name === 'Kenniscentrum'){
                setChannelID(channel.ID)
            }
        })

    }, [channels])

    const variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }

    const titleHandler = (e) => {
        const title = e.target.value
        setTitle(title)
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

    // Upload banner image

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
            Type: 'KnowledgeCentre',
            User: authO.UserName,
            UserPhoto: authO.Photo,
            UserID: authO.ID,
            Categorie: categorie,
            Banner: bannerPhoto,
            ChannelID: channelID
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
                Banner: headerPhoto,
                Link: `ArticleDetail/${id}`
            }) 
        })
        .then(() => {
            db.collection("Search")
            .doc()
            .set({
                Name: title,
                Compagny: client,
                Type: 'Artikel',
                Link: `ArticleDetail/${id}`
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
                    <h1>Voeg een artikel toe</h1>
                    <p>Voeg een nieuw artikel voor de leden van de community</p>
                </div>
                <form id="add-goal-form">
                    <div className="divider">
                        <h2>Geef het artikel een titel</h2>
                        <input type="text" placeholder="Schrijf hier de titel" onChange={titleHandler} />
                    </div >
                    <TinyMCE setBody={setBody}/>
                    <div className="divider">
                        <h2>Voeg een categorie toe</h2>
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
                        <h2>Voeg een bannerfoto toe</h2>
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
