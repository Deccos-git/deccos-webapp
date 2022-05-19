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
import { NavLink, Link } from "react-router-dom";
import deleteIcon from '../../images/icons/delete-icon.png'
import plusButton from '../../images/icons/plus-icon.png'
import cancelIcon from '../../images/icons/cancel-icon.png'
import imageIcon from '../../images/icons/image-icon.png'
import Modal from 'react-modal';

const GoalTitle = () => {
    const [authO] = useContext(Auth)

    const [color, setColor] = useState('')
    const [title, setTitle] = useState("")
    const [banner, setBanner] = useState("")
    const [loader, setLoader] = useState("")
    const [headerPhoto, setHeaderPhoto] = useState('')
    const [modalOpen, setModalOpen] = useState(false);

    const colors = useFirestore('Colors')
    const goals = useFirestore('Goals')
    Modal.setAppElement('#root');

    const modalStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
        },
      };

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
        const docid = e.target.dataset.docid
        
        db.collection("Goals")
        .doc(docid)
        .update({
            Title: title
        })
    }

    const bannerHandler = (e) => {
        setLoader(spinnerRipple)

        const photo = e.target.files[0]
        const docid = e.target.dataset.docid

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

            saveBanner(docid, downloadURL)

                })
            })
        })
        .then(() => {
            closeModal()
        })
    }

    const saveBanner = (docid, downloadURL) => {
        db.collection("Goals")
        .doc(docid)
        .update({
            Banner: downloadURL
        })
    }

    const closeModal = () => {
        setModalOpen(false);
      }

    const addGoal = () => {

        db.collection("Goals")
        .doc()
        .set({
            Title: '',
            Compagny: client,
            Timestamp: timestamp,
            ID: id,
            User: authO.UserName,
            UserPhoto: authO.Photo,
            UserID: authO.ID,
            Banner: '',
            Targetgroup: '',
        })
    }

    const deleteGoal = (e) => {
        const docid = e.target.dataset.docid 

        db.collection("Goals")
        .doc(docid)
        .delete()

    }

    const deleteBanner = (e) => {

        const docid = e.target.dataset.docid 

        db.collection("Goals")
        .doc(docid)
        .update({
            Banner: ''
        })
    }


  return (
    <div className="main">
        <LeftSideBar />
        <LeftSideBarFullScreen/>
        <div className="main-container" style={{display: menuState}}>
            <div className="page-header">
                <h1>Impactdoelen</h1>
                <div className='wizard-sub-nav'>
                    <NavLink to={`/${client}/StakeholderAnalysis`} >
                        <div className='step-container'>
                            <img src={arrowLeft} alt="" />
                            <p>Stakeholders</p>
                        </div>
                    </NavLink>  
                    <p>4 van de 12</p>
                    <NavLink to={`/${client}/Targetgroup`} >
                        <div className='step-container'>
                            <p>Doelgroep bepalen</p>
                            <img src={arrowRight} alt="" />
                        </div>
                    </NavLink>
                </div>
            </div>
            <div className='profile profile-auth-profile'>
                <div>
                    <div className='activity-meta-title-container'>
                        <img src={capIcon} alt="" />
                        <h3>Uitleg</h3>
                    </div> 
                    <div className='text-section' style={{backgroundColor: color}}>
                        <p><b>De impact doelen zijn de reden waarvoor jij en je team ‘s 
                            ochtends uit bed komen om aan je sociale onderneming te werken.
                        </b></p>
                        <p>
                            Alhoewel het vaak over grote maatschappelijke onderwerpen gaat is het belangrijk om 
                            concreet te blijven en de doelen zo dicht mogelijk binnen jullie eigen invloedssfeer te houden.
                        </p>
                        <ul>
                            <li>Is het doel concreet?</li>
                            <li>Is het doel meetbaar en hebben jullie hier een directe invloed op?</li>
                            <li>Is het doel realistische en haalbaar?</li>
                        </ul>
                        <p>Om je impact dashboard een beetje kleur te geven kun je een plaatje uploaden dat past bij het doel. 
                            Onze tip is om dat niet over te slaan. Ook in de communicatie naar stakeholders 
                            helpt een mooi plaatje om het belang van jullie doel over te brengen. 
                            Een plaatje zegt meer dan 1000 woorden, toch? 
                            <a href="https://www.pexels.com/nl-nl/"> Hier</a> vind je een heleboel mooie plaatjes die je gratis kunt gebruiken.</p>
                    </div>
                </div>
                <div>
                    <div className='activity-meta-title-container'>
                        <img src={rocketIcon} alt="" />
                        <h3>Aan de slag</h3>
                    </div> 
                    <div className='text-section' style={{backgroundColor: color}}>
                        <div className='list-container'>
                            <div className='list-top-row-container'>
                                    <img src={plusButton} onClick={addGoal} alt="" />
                            </div>
                            <div className='list-top-row-container'>
                                <p>BANNER</p>
                                <p>TITEL</p>
                                <p>ACTIE</p>
                            </div>
                            {goals && goals.map(goal => (
                                <>
                                    <Modal
                                    isOpen={modalOpen}
                                    onRequestClose={closeModal}
                                    style={modalStyles}
                                    contentLabel="Upload banner"
                                    >
                                    <div className='add-image-container'>
                                        <img src={imageIcon} alt="" />
                                        <p>Upload een plaatje</p>
                                        <input data-docid={goal.docid} onChange={bannerHandler} type="file" />
                                    </div>
                                    </Modal>
                                    <div className='list-row-container'>
                                        <div className='list-banner-container'>
                                            <img className='cancel-icon' data-docid={goal.docid} src={cancelIcon} alt="" onClick={deleteBanner} />
                                            <img src={imageIcon} alt="" onClick={() => setModalOpen(true)} />
                                            <img className='goal-banner-list' src={goal.Banner} alt="" />
                                        </div>
                                        <textarea contentEditable type="text" data-docid={goal.docid} defaultValue={goal.Title} placeholder='Titel' onChange={titleHandler} />
                                        <img data-docid={goal.docid} onClick={deleteGoal} src={deleteIcon} alt="" />
                                    </div>  
                                </>  
                            ))}
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
                        <p>2. Voeg een sprekend plaatje toe om het belang van jullie doel kracht bij te zetten. <a href="https://www.pexels.com/nl-nl/">Hier</a> vind je een heleboel mooie plaatjes die je gratis kunt gebruiken.</p>
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