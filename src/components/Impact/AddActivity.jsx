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
import ArrowRightIcon from '../../images/icons/arrow-right-icon.png'
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

const AddActivity = () => {
    const [authO] = useContext(Auth)

    const [color, setColor] = useState('')
    const [goalTitle, setGoalTitle] = useState('')
    const [goalID, setGoalID] = useState('')
    const [activityTitle, setActivityTitle] = useState('')
    const [impact, setImpact] = useState('')
    const [banner, setBanner] = useState("")
    const [loader, setLoader] = useState("")
    const [modalOpen, setModalOpen] = useState(false);

    const menuState = MenuStatus()
    const history = useHistory()
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
    const colors = useFirestore('Colors')
    const activities = useFirestore('Activities')

    useEffect(() => {
        colors && colors.forEach(color => {
            const background = color.Background 

            setColor(background)
        })

    },[colors])

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

    }

    const saveActivity = (e) => {

        ButtonClicked(e, 'Opgeslagen')

        const id = uuid()
        
        db.collection('Activities')
        .doc()
        .set({
            Activity: activityTitle,
            ID: id,
            Compagny: client,
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
                        <p>11 van de 12</p>
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
                        <div className='text-section' style={{backgroundColor: color}}>
                            <p><b>Welke concrete activiteiten zet jouw sociale organisatie in om jullie impact 
                                doelen te verwezenlijken?
                            </b></p>
                            <p>De activiteiten zijn de diensten of producten die jouw organisatie aanbiedt aan jouw doelgroep. 
                                Dit zijn niet altijd dienst of producten waar je doelgroep voor betaald. Ze kunnen ook 
                                gesubsidieerd worden aangeboden.</p>
                            <p>
                            Om je impact dashboard een beetje kleur te geven kun je een plaatje uploaden dat past bij 
                            de activiteit. Onze tip is om dat niet over te slaan. Ook in de communicatie naar 
                            stakeholders helpt een mooi plaatje om het belang van jullie activiteit over te brengen. 
                             <a href="https://www.pexels.com/nl-nl/" target='_blank'> Hier</a> vind je een heleboel mooie plaatjes die je gratis kunt gebruiken.
                            </p>
                            <p><b>Deadweight</b></p>
                            <p>
                            De deadweight is een geschat percentage van de groei in impact die ook zou zijn ontstaan als 
                            jullie organisatie zijn activiteiten überhaupt niet aangeboden. De deadweight staat standaard 
                            ingesteld op 75%. Dit betekent dat 25% van de verhoogde impact ook was ontstaan als jullie 
                            activiteit niet had bestaan.
                            </p>
                            <p><b>Attributie</b></p>
                            <p>
                            De attributie is het percentage waarvan je inschat dat de impact aan jullie is toe te schrijven. 
                            Deze staat standaard ingesteld op 75%, maar dit percentage kan naar eigen inzicht worden aangepast. 
                            De 75% betekent dat 75% van de positieve impact die wordt bereikt kan worden toegeschreven op jullie 
                            activiteit.
                            </p>
                            <p><b>Tijdshorizon</b></p>
                            <p>
                            De tijdshorizon is het aantal jaren waarop je inschat dat het effect van de activiteit blijft bestaan. 
                            Deze staat standaard ingesteld op 2,5 jaar.
                            </p>
                            <p><b>Bedrag</b></p>
                            <p>
                                Dit is het voor berekende bedrag per output per jaar.
                            </p>
                            <p><b>Totaal</b></p>
                            <p>Dit is accumulatie van het doorberekende bedrag keer de deadweight keer de attributie keer de 
                                tijdshorizon. Uiteindelijk wordt dit bedrag automatisch vermenigvuldigd met de output om de 
                                totale SROI waarde te berekenen. Wanneer deze waarde wordt gedeeld door de kosten die jullie 
                                organisatie maakt voor de betreffende activiteit krijg je de SROI ratio.</p>
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
                            <input type="text" placeholder='Beschrijf hier je activiteit' onChange={activityHandler}/>
                        <h4>Voeg een bannerfoto toe</h4>
                        <input className="input-classic" onChange={bannerHandler} type="file" />
                        <div className="spinner-container">
                            <img src={loader} alt="" />
                        </div> 
                        <button onClick={saveActivity}>Opslaan</button>
                    </div>
                </Modal>
                <div className='text-section' style={{backgroundColor: color}}>
                    <div className='list-container'>
                        <div className='list-top-row-container'>
                                <img src={plusButton} onClick={() => setModalOpen(true)} alt="" />
                        </div>
                        <div className='table-container'>
                            <table>
                                <tr>
                                    <th>BANNER</th>
                                    <th>ACTIVITEIT</th>
                                    <th>ACTIE</th>
                                </tr>
                                {activities && activities.map(activity => (
                                    <tr>
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

export default AddActivity
