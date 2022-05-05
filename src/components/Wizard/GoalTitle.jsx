import LeftSideBar from "../LeftSideBar"
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import MenuStatus from "../../hooks/MenuStatus";
import arrowLeft from '../../images/icons/arrow-left-icon.png'
import arrowRight from '../../images/icons/arrow-right-icon.png'
import capIcon from '../../images/icons/cap-icon.png'
import rocketIcon from '../../images/icons/rocket-icon.png'
import bulbIcon from '../../images/icons/bulb-icon.png'
import feetIcon from '../../images/icons/feet-icon.png'
import { useFirestore } from "../../firebase/useFirestore";
import { useState, useEffect, useContext } from "react";
import spinnerRipple from '../../images/spinner-ripple.svg'
import { bucket } from '../../firebase/config';
import firebase from 'firebase'
import ButtonClicked from "../../hooks/ButtonClicked.jsx";
import { db, timestamp } from "../../firebase/config.js"
import { client } from '../../hooks/Client';
import uuid from 'react-uuid';
import { useHistory } from "react-router-dom";
import { Auth } from '../../StateManagment/Auth';

const GoalTitle = () => {
    const [authO] = useContext(Auth)

    const [color, setColor] = useState('')
    const [title, setTitle] = useState("")
    const [banner, setBanner] = useState("")
    const [loader, setLoader] = useState("")
    const [headerPhoto, setHeaderPhoto] = useState('')

    const colors = useFirestore('Colors')

    const history = useHistory()
    const menuState = MenuStatus() 
    const id = uuid()

    useEffect(() => {
        colors && colors.forEach(color => {
            const background = color.Background 

            setColor(background)
        })

    },[colors])

    const titleHandler = (e) => {
        const title = e.target.value
        setTitle(title)
    }

    const bannerHandler = (e) => {
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

            setBanner(downloadURL)
            setLoader(downloadURL)

                })
            })
        })
    }

    const saveGoal = (e) => {

        ButtonClicked(e, 'Opgeslagen')

        db.collection("Goals")
        .doc()
        .set({
            Title: title,
            Compagny: client,
            Timestamp: timestamp,
            ID: id,
            User: authO.UserName,
            UserPhoto: authO.Photo,
            UserID: authO.ID,
            Banner: banner
        })
        .then(() => {
            db.collection("AllActivity")
            .doc()
            .set({
                Title: title,
                Type: "NewGoal",
                Compagny: client,
                Timestamp: timestamp,
                ID: id,
                Description: "heeft een nieuw doel toegevoegd:",
                ButtonText: "Bekijk doel",
                User: authO.UserName,
                UserPhoto: authO.Photo,
                UserID: authO.ID,
                Banner: headerPhoto,
                Link: `GoalDetail/${id}`
            }) 
        })
        .then(() => {
            db.collection("Search")
            .doc()
            .set({
                Name: title,
                Compagny: client,
                Type: 'Doel',
                Link: `GoalDetail/${id}`
            })
        })
    }


  return (
    <div className="main">
        <LeftSideBar />
        <LeftSideBarFullScreen/>
        <div className="main-container" style={{display: menuState}}>
            <div className="page-header">
                <h1>Impact doelen stellen</h1>
                <div className='wizard-sub-nav'>
                    <div className='step-container'>
                        <img src={arrowLeft} alt="" />
                        <p>Stakeholders</p>
                    </div>
                    <p>3 van de 12</p>
                    <div className='step-container'>
                        <p>Doelen plannen</p>
                        <img src={arrowRight} alt="" />
                    </div>
                </div>
            </div>
            <div className='profile profile-auth-profile'>
                <div>
                    <div className='activity-meta-title-container'>
                        <img src={capIcon} alt="" />
                        <h3>Uitleg</h3>
                    </div> 
                    <div className='text-section' style={{backgroundColor: color}}>
                        <p>Specifiek, meetbaar, acceptabel, realistisch</p>
                        <p>Om je impactdashboard een beetje kleur te geven kun je een plaatje uploaden dat past bij het doel. Onze tip is om dat niet over te slaan. Ook in de communicatie naar stakeholders helpt een mooi plaatje om het belang van jullie doel over te brengen. Een plaatje zegt meer dan 1000 woorden, toch?</p>
                    </div>
                </div>
                <div>
                    <div className='activity-meta-title-container'>
                        <img src={rocketIcon} alt="" />
                        <h3>Aan de slag</h3>
                    </div> 
                    <div className='text-section' style={{backgroundColor: color}}>
                        <div>
                            <p>Voeg een nieuw doel toe of pas een bestaand doel aan</p>
                            <select name="" id=""></select>
                        </div>
                        <p>Geef je doel een titel</p>
                        <input className="input-classic" type="text" placeholder="Schrijf hier de titel" onChange={titleHandler} />
                        <p>Voeg een plaatje toe</p>
                        <input className="input-classic" onChange={bannerHandler} type="file" />
                        <div className="spinner-container">
                            <img src={loader} alt="" />
                        </div> 
                    </div>
                </div>
                <div>
                    <div className='activity-meta-title-container'>
                        <img src={bulbIcon} alt="" />
                        <h3>Tips</h3>
                    </div> 
                    <div className='text-section' style={{backgroundColor: color}}>
                        <p>1. Kom je er niet uit of heb je behoefte aan een second opinion van een impactexpert? Twijfel niet en klik hier.</p>
                        <p>2. Voeg een sprekend plaatje toe om het belang van jullie doel kracht bij te zetten. Hier vind je een heleboel mooie plaatjes die je gratis kunt gebruiken.</p>
                    </div>
                </div>
                <div>
                    <div className='activity-meta-title-container'>
                        <img src={feetIcon} alt="" />
                        <h3>Volgende stap</h3>
                    </div> 
                    <div className='text-section' style={{backgroundColor: color}}>
                        <p>In de volgende stap ga je de impactdoelen plannen in de tijd.</p>
                        <button>Volgende stap</button>
                    </div>
                </div>
            </div> 
        </div>
    </div>
  )
}

export default GoalTitle