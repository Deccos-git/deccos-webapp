import LeftSideBar from "../LeftSideBar";
import LeftSideBarFullScreen from "../LeftSideBarFullScreen";
import MenuStatus from "../../hooks/MenuStatus";
import {useFirestore} from "../../firebase/useFirestore"
import { useState, useEffect, useContext } from 'react'
import { Auth } from '../../StateManagment/Auth';
import uuid from 'react-uuid';
import { db, timestamp } from "../../firebase/config.js"
import { client } from "../../hooks/Client"
import deleteIcon from '../../images/icons/delete-icon.png'
import { useHistory } from "react-router-dom";
import {ReactComponent as QuestionIcon}  from '../../images/icons/question-icon.svg'
import spinnerRipple from '../../images/spinner-ripple.svg'
import firebase from 'firebase'
import { bucket } from '../../firebase/config';
import ButtonClicked from "../../hooks/ButtonClicked";
import arrowLeft from '../../images/icons/arrow-left-icon.png'
import arrowRight from '../../images/icons/arrow-right-icon.png'
import capIcon from '../../images/icons/cap-icon.png'
import rocketIcon from '../../images/icons/rocket-icon.png'
import bulbIcon from '../../images/icons/bulb-icon.png'
import feetIcon from '../../images/icons/feet-icon.png'
import { NavLink, Link } from "react-router-dom";
import Modal from 'react-modal';
import plusButton from '../../images/icons/plus-icon.png'
import cancelIcon from '../../images/icons/cancel-icon.png'
import imageIcon from '../../images/icons/image-icon.png'
import ImpactGuideMenu from "../../hooks/ImpactGuideMenu";
import eyeIcon from '../../images/icons/eye-icon.png'
import dashboardIcon from '../../images/icons/dashboard-icon.png'
import activityIcon from '../../images/icons/activity-icon.png'
import ScrollToTop from "../../hooks/ScrollToTop";
import { SavedIcon } from "../../StateManagment/SavedIcon";

const AddActivity = () => {
    const [authO] = useContext(Auth)
    const [saved, setSaved] = useContext(SavedIcon)

    const [goalTitle, setGoalTitle] = useState('')
    const [goalID, setGoalID] = useState('')
    const [banner, setBanner] = useState("https://firebasestorage.googleapis.com/v0/b/deccos-app.appspot.com/o/defaultBannerActivity.png?alt=media&token=bb8383b8-a788-4210-a433-f51a2175b9f1")
    const [loader, setLoader] = useState("")
    const [modalOpen, setModalOpen] = useState(false);
    const [title, setTitle] = useState('')

    const menuState = MenuStatus()
    const history = useHistory()
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

    const goals = useFirestore("Goals")
    const activities = useFirestore('Activities')

    const goalHandler = (e) => {
        const goalTitle = e.target.options[e.target.selectedIndex].dataset.title
        const goalID = e.target.options[e.target.selectedIndex].dataset.id

        setGoalTitle(goalTitle)
        setGoalID(goalID)
    }

    const activityHandler = (e) => {

        const title = e.target.value 
        const docid = e.target.dataset.docid

        db.collection('Activities')
        .doc(docid)
        .update({
            Activity: title
        })
        .then(() => {
            setSaved('flex')
         })

    }

    const activityModalHandler = (e) => {
        const title = e.target.value 

        setTitle(title)
    }

    const saveActivity = (e) => {

        ButtonClicked(e, 'Opgeslagen')

        const id = uuid()
        
        db.collection('Activities')
        .doc()
        .set({
            Activity: title,
            ID: id,
            Compagny: client,
            CompagnyID: client,
            Timestamp: timestamp,
            User: authO.UserName,
            UserPhoto: authO.Photo,
            UserID: authO.ID,
            Impact: '',
            Goal: goalTitle,
            GoalID: goalID,
            Progression: 0,
            Banner: banner,
        })
        .then(() => {
            closeModal()
        })
    }

    const deleteActivity = (e) => {
        const docid = e.target.dataset.docid

        db.collection('Activities')
        .doc(docid)
        .delete()
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

    const deleteBanner = (e) => {

        const docid = e.target.dataset.docid 

        db.collection("Activities")
        .doc(docid)
        .update({
            Banner: ''
        })
    }

    const closeModal = () => {
        setModalOpen(false);
      }

    return (
        <div className="main">
            <LeftSideBar />
            <LeftSideBarFullScreen/>
            <div className="main-container" style={{display: menuState}}>
                <div className="page-header">
                    <h1>Activiteiten</h1>
                    <div className='wizard-sub-nav'>
                        <NavLink to={`/${client}/Conditions`} >
                            <div className='step-container'>
                                <img src={arrowLeft} alt="" />
                                <p>Externe factoren</p>
                            </div>
                        </NavLink>  
                        {ImpactGuideMenu(11)}
                        <NavLink to={`/${client}/ImpactActivity`} >
                            <div className='step-container'>
                                <p>Impact van activiteit</p>
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
                            <p><b>Welke concrete activiteiten zet jouw sociale organisatie in om jullie impact 
                                doelen te verwezenlijken?
                            </b></p>
                            <p>De activiteiten zijn de diensten of producten die jouw organisatie aanbiedt aan jouw doelgroep. 
                                Dit zijn niet altijd diensten of producten waar je doelgroep voor betaalt. Ze kunnen ook 
                                gesubsidieerd worden aangeboden.</p>
                            <p>
                            Om je impact dashboard een beetje kleur te geven kun je een plaatje uploaden dat past bij 
                            de activiteit. Onze tip is om dat niet over te slaan. Ook in de communicatie naar 
                            stakeholders helpt een mooi plaatje om het belang van jullie activiteit over te brengen. 
                             <a href="https://www.pexels.com/nl-nl/" target='_blank'> Hier</a> vind je een heleboel mooie plaatjes die je gratis kunt gebruiken.
                            </p>
                        </div>
                    </div>
                <div>
                <div className='activity-meta-title-container'>
                    <img src={rocketIcon} alt="" />
                    <h3>Aan de slag</h3>
                </div> 
                <Modal
                    isOpen={modalOpen}
                    onRequestClose={closeModal}
                    style={modalStyles}
                    contentLabel="Upload banner"
                    >
                    <div className='add-image-container'>
                        <h4>Selecteer een doel</h4>
                        <select name="" id="" onChange={goalHandler}>
                            <option value="">-- Selecteer een doel --</option>
                            {goals && goals.map(goal => (
                                <option value="" key={goal.ID} data-id={goal.ID} data-title={goal.Title}>{goal.Title}</option>
                            ))}
                        </select>
                        <h4>Beschrijf activiteit</h4>
                        <input type="text" placeholder='Beschrijf hier je activiteit' onChange={activityModalHandler}/>
                        <h4>Voeg een bannerfoto toe</h4>
                        <input className="input-classic" onChange={bannerHandler} type="file" />
                        <div className="spinner-container">
                            <img src={loader} alt="" />
                        </div> 
                        <button onClick={saveActivity}>Opslaan</button>
                    </div>
                </Modal>
                <div className='text-section'>
                    <div className='list-container'>
                        <div className='list-top-row-container'>
                                <img src={plusButton} onClick={() => setModalOpen(true)} alt="" />
                        </div>
                        <div className='table-container'>
                            <table>
                                <tr>
                                    <th>BANNER</th>
                                    <th>ACTIVITEIT</th>
                                    <th>DOEL</th>
                                    <th>VERWIJDER</th>
                                </tr>
                                {activities && activities.map(activity => (
                                    <tr key={activity.ID}>
                                        <td>
                                            <div className='list-banner-container'>
                                                <img className='cancel-icon' data-docid={activity.docid} src={cancelIcon} alt="" onClick={deleteBanner} style={{display: activity.Banner ? 'block' : 'none'}} />
                                                <img className='goal-banner-list default-goal-image' src={imageIcon} alt="" onClick={() => setModalOpen(true)} style={{display: activity.Banner ? 'none' : 'block'}}/>
                                                <img className='goal-banner-list' src={activity.Banner} alt="" />
                                            </div>
                                        </td>
                                        <td>
                                            <textarea contentEditable type="text" data-docid={activity.docid} defaultValue={activity.Activity} placeholder='Titel' onChange={activityHandler} />
                                        </td>
                                        <td>
                                            <p>{activity.Goal}</p>
                                        </td>
                                        <td>
                                            <img className='table-delete-icon' data-docid={activity.docid} onClick={deleteActivity} src={deleteIcon} alt="" />
                                        </td>
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
                    <p><b>Je kunt je activiteiten hier terug vinden:</b></p>
                    <div className="channel-inner-div">
                        <div className='activity-meta-title-container'>
                            <img src={activityIcon} alt="" />
                            <NavLink activeClassName='active' to={`/${client}/Activities`}>Activiteiten</NavLink>
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
                    <ol>
                        <li>
                            Voeg een sprekend plaatje toe om het belang van jullie activiteit kracht bij te zetten. <a href="https://www.pexels.com/nl-nl/">Hier</a> vind je een heleboel mooie plaatjes die je gratis kunt gebruiken.
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
                        <li>Benieuwd naar de impact van andere sociale MKB'ers? Neem eens een kijkje in de <a href="https://deccos.nl/Milestones">Deccos Impactclub</a>.</li>
                    </ol>
                </div>
            </div>
            <div>
                <div className='activity-meta-title-container'>
                    <img src={feetIcon} alt="" />
                    <h3>Volgende stap</h3>
                </div> 
                <div className='text-section'>
                    <p>In de volgende stap ga je de impact van de activiteiten omschrijven.</p>
                    <NavLink to={`/${client}/ImpactActivity`} ><button>Volgende stap</button></NavLink>
                </div>
            </div>
            </div>
            </div>
        </div>
    )
}

export default AddActivity
