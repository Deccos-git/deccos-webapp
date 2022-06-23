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
import {ReactComponent as QuestionIcon}  from '../../images/icons/question-icon.svg'
import ImpactGuideMenu from "../../hooks/ImpactGuideMenu";
import eyeIcon from '../../images/icons/eye-icon.png'
import dashboardIcon from '../../images/icons/dashboard-icon.png'
import goalIcon from '../../images/icons/goal-icon.png'
import ScrollToTop from "../../hooks/ScrollToTop";
import { SavedIcon } from "../../StateManagment/SavedIcon";

const GoalTitle = () => {
    const [authO] = useContext(Auth)
    const [saved, setSaved] = useContext(SavedIcon)

    const [title, setTitle] = useState("")
    const [banner, setBanner] = useState("https://firebasestorage.googleapis.com/v0/b/deccos-app.appspot.com/o/ImpactHeaderDefault.png?alt=media&token=5d11c139-431d-4c66-84d1-23878e3ad460")
    const [loader, setLoader] = useState("")
    const [headerPhoto, setHeaderPhoto] = useState('')
    const [modalOpen, setModalOpen] = useState(false);

    const goals = useFirestore('Goals')
    ScrollToTop()
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

    const titleHandler = (e) => {

        const title = e.target.value
        const docid = e.target.dataset.docid
        
        db.collection("Goals")
        .doc(docid)
        .update({
            Title: title
        })
        .then(() => {
            setSaved('flex')
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
        .then(() => {
            setSaved('flex')
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
            CompagnyID: client,
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
                    {ImpactGuideMenu(4)}
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
                    <div className='text-section'>
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
                            <li>Is het doel realistisch en haalbaar?</li>
                        </ul>
                        <p>Om je impact dashboard een beetje kleur te geven kun je een plaatje uploaden dat past bij het doel. 
                            Onze tip is om dat niet over te slaan. Ook in de communicatie naar stakeholders 
                            helpt een mooi plaatje om het belang van jullie doel over te brengen. 
                            Een plaatje zegt meer dan 1000 woorden, toch? 
                            <a href="https://www.pexels.com/nl-nl/" target='_blank'> Hier</a> vind je een heleboel mooie plaatjes die je gratis kunt gebruiken.</p>
                    </div>
                </div>
                <div>
                    <div className='activity-meta-title-container'>
                        <img src={rocketIcon} alt="" />
                        <h3>Aan de slag</h3>
                    </div> 
                    <div className='text-section'>
                        <div className='list-container'>
                            <div className='list-top-row-container'>
                                    <img src={plusButton} onClick={addGoal} alt="" />
                            </div>
                            <div className='table-container'>
                                <table>
                                    <tr>
                                        <th>BANNER</th>
                                        <th>DOEL</th>
                                        <th>VERWIJDER</th>
                                    </tr>
                                    {goals && goals.map(goal => (
                                        <tr key={goal.ID}>
                                            <td>
                                                <div className='list-banner-container'>
                                                    <img className='cancel-icon' data-docid={goal.docid} src={cancelIcon} alt="" onClick={deleteBanner} style={{display: goal.Banner ? 'block' : 'none'}} />
                                                    <img className='goal-banner-list default-goal-image' src={imageIcon} alt="" onClick={() => setModalOpen(true)} style={{display: goal.Banner ? 'none' : 'block'}}/>
                                                    <img className='goal-banner-list' src={goal.Banner} alt="" />
                                                </div>
                                            </td>
                                            <td>
                                                <textarea contentEditable type="text" data-docid={goal.docid} defaultValue={goal.Title} placeholder='Titel' onChange={titleHandler} />
                                            </td>
                                            <td>
                                                <img className='table-delete-icon' data-docid={goal.docid} onClick={deleteGoal} src={deleteIcon} alt="" />
                                            </td>
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
                                        </tr>  
                                    ))}
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className='activity-meta-title-container'>
                        <img src={eyeIcon} alt="" />
                        <h3>Bekijk</h3>
                    </div> 
                    <div className='text-section'>
                        <p><b>Je kunt je doelen hier terug vinden:</b></p>
                        <div className="channel-inner-div">
                            <div className='activity-meta-title-container'>
                                <img src={goalIcon} alt="" />
                                <NavLink activeClassName='active' to={`/${client}/Goals`}>Impactdoelen</NavLink>
                            </div>
                        </div>
                        <div className="channel-inner-div">
                            <div className='activity-meta-title-container'>
                                <img src={dashboardIcon} alt="" />
                                <NavLink activeClassName='active' to={`/${client}/ImpactProgress`}>Dashboard</NavLink>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className='activity-meta-title-container'>
                        <img src={bulbIcon} alt="" />
                        <h3>Tips</h3>
                    </div> 
                    <div className='text-section'>
                        <li>
                            Zorg ervoor dat het doel zo concreet mogelijk is en zoveel mogelijk binnen de beïnvloedingssfeer van jullie organisatie ligt.
                        </li>
                        <li>
                            Voeg een sprekend plaatje toe om het belang van jullie doel kracht bij te zetten. <a href="https://www.pexels.com/nl-nl/">Hier</a> vind je een heleboel mooie plaatjes die je gratis kunt gebruiken.
                        </li>
                        <li>
                            Kom je er niet uit of heb je behoefte aan ondersteuning van een impactexpert? 
                            Klik op het 
                            <NavLink to={`/${client}/Support`} >
                                <QuestionIcon style={{width: '19px', height: '19px'}}/> 
                            </NavLink>
                            icon in de 
                            bovenbalk (onderbalk op mobiel) voor alle ondersteuningsmogelijkheden.
                        </li>
                        <li>
                            Benieuwd naar de impact van andere sociale MKB'ers? Neem eens een kijkje in de <a href="https://deccos.nl/Milestones">Deccos Impactclub</a>.
                        </li>
                    </div>
                </div>
                <div>
                    <div className='activity-meta-title-container'>
                        <img src={feetIcon} alt="" />
                        <h3>Volgende stap</h3>
                    </div> 
                    <div className='text-section'>
                        <p>In de volgende stap ga je de doelgroepen bepalen.</p>
                        <NavLink to={`/${client}/Targetgroup`} ><button>Volgende stap</button></NavLink>
                    </div>
                </div>
            </div> 
        </div>
    </div>
  )
}

export default GoalTitle