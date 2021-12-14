import { useFirestoreID, useFirestoreMessages, useFirestoreMyEvents, useFirestore, useFirestoreAdmins } from "../firebase/useFirestore"
import LeftSideBar from "./LeftSideBar"
import LeftSideBarFullScreen from "./LeftSideBarFullScreen"
import RightSideBar from "./rightSideBar/RightSideBar"
import MessageBar from "./MessageBar"
import { db, timestamp } from "../firebase/config"
import { useState, useContext, useEffect } from "react"
import Location from "../hooks/Location"
import HouseIcon from "../images/icons/house-icon.png"
import CalendarIcon from "../images/icons/calendar-icon.png"
import InformationIcon from "../images/icons/information-icon.png"
import Reaction from "./Reaction"
import MenuStatus from "../hooks/MenuStatus";
import { useHistory } from "react-router-dom"
import { client } from "../hooks/Client"
import uuid from 'react-uuid';
import { Auth } from '../StateManagment/Auth';


const EventDetail = () => {
    const [authO] = useContext(Auth)
    const [authID, setAuthID] = useState(null)
    const [psysicalDisplay, setPsysicalDisplay] = useState("")
    const [onlineDisplay, setOnlineDisplay] = useState("")
    const [eventButtonClass, setEventButtonClass] = useState('event-detail-button')
    const [showCalendarButton, setShowCalendarButton] = useState('show-calendar-button-hidden')
    const [adminEmail, setAdminEmail] = useState('')
    const [communityNameDB, setCommunityNameDB] = useState("")

    const route = Location()[3]
    const menuState = MenuStatus()
    const history = useHistory()

    const events = useFirestoreID("Events", route)
    const messages  = useFirestoreMessages("Messages", route)
    const authEvents = useFirestoreMyEvents(authID)
    const admins = useFirestoreAdmins('Admins')
    const compagny = useFirestore("CompagnyMeta")

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    // Store auth id in state if auth id is not undefinded

    useEffect(() => {
        if(authO.ID != undefined){

            setAuthID(authO.ID)
        }
    },[authO])

    // Check id auth has signed up for event

    useEffect(() => {
        authEvents && authEvents.forEach(vnt => {
            if(vnt.ID === route){
                setEventButtonClass('event-detail-button-signedup')
                setShowCalendarButton('show-calendar-button')
            }
        })
    },[authEvents])

    // Find emailadresses of community admins

    useEffect(() => {
        const adminArray = []
        admins && admins.forEach(admin => {
            adminArray.push(admin.Email)
        })
        setAdminEmail(adminArray)
    }, [admins])

    // Client communityname

    useEffect(() => {
        compagny && compagny.forEach(comp => {
            setCommunityNameDB(comp.CommunityName)
        })
    }, [compagny])

    const locationDisplay = () => {

        db.collection("Events")
        .where("ID", "==", route)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const location = doc.data().Location

                console.log(location)

                if(location === "online"){
                    setOnlineDisplay("block")
                    setPsysicalDisplay("none")
                } else if(location === "physical-location"){
                    setOnlineDisplay("none")
                    setPsysicalDisplay("block")
                }
            })
        })

    }

    locationDisplay()

    const profileLink = (e) => {
        const id = e.target.dataset.id

        history.push(`/${client}/PublicProfile/${id}`)
    }

    const eventSignup = (e) => {

        e.target.innerText = 'Aangemeld'
        e.target.style.backgroundColor = 'white'
        e.target.style.borderColor = 'lightgray'
        e.target.style.color = 'lightgray'

        const date = e.target.dataset.date 
        const title = e.target.dataset.title 
        const id = e.target.dataset.id 

        db.collection('EventSignups') 
        .doc()
        .set({
            ID: id,
            Title: title,
            Date: date,
            UserName: authO.UserName,
            UserID: authO.ID,
            UserPhoto: authO.Photo,
            Timestamp: timestamp,
            Compagny: client
        })
        .then(() => {
            db.collection("Email").doc().set({
                to: adminEmail,
                cc: "info@Deccos.nl",
                message: {
                subject: `Iemand heeft zich aangemeld voor het event ${title} op ${communityNameDB}`,
                html: `
                    Iemand heeft zich aangemeld voor het event '${title}' op ${communityNameDB}. <br><br>
    
                    Naam: ${authO.UserName}. <br><br>
    
                    <a href='https://deccos.co/${client}/EventSignups'>Klik hier</a> om de alle aanmeldingen te beheren.<br><br>
                    
                    `,
                Gebruikersnaam: `${authO.UserName}`,
                Emailadres: adminEmail,
                Type: "Event signup"
                  }     
              });
        })
        .then(() => {
            db.collection("Email").doc().set({
                to: adminEmail,
                cc: "info@Deccos.nl",
                message: {
                subject: `Bevestiging aanmelding voor het event ${title} op ${communityNameDB}`,
                html: `
                    Dag ${authO.UserName}, <br><br>
                    
                    Bij deze bevestigen wij jouw aanmelding voor het event '${title}' op ${communityNameDB}. <br><br>
    
                    <a href='https://deccos.co/${client}/MyEvents/${authO.ID}'>Klik hier</a> om je persoonlijke evenementenagenda te bekijken.<br><br>

                    Met vriendelijke groet, <br><br>

                    ${communityNameDB}
                    
                    `,
                Gebruikersnaam: `${authO.UserName}`,
                Emailadres: adminEmail,
                Type: "Event signup"
                  }     
              });
        })

    }

    const showMyCalendar = () => {

        history.push(`/${client}/MyEvents/${authID}`)
        
    }

    return (
        <div className="main">
            <LeftSideBar />
            <LeftSideBarFullScreen/>
            <div className="article-container" style={{display: menuState}}>
                {events && events.map(doc => (
                    <div className="article">
                        <h1>{doc.Title}</h1>
                        <img className="article-detail-banner" src={doc.Banner} alt="" />
                        <div className="article-meta-container">
                            <div className="article-card-user-container">
                                <img src={doc.UserPhoto} alt="" data-id={doc.UserID} onClick={profileLink} />
                                <p data-id={doc.UserID} onClick={profileLink}>{doc.User}</p>
                            </div>
                            <h3 id='event-detail-timestamp'>{doc.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</h3>
                            <div className="article-body-container divider">
                                <div dangerouslySetInnerHTML={{ __html: doc.Body }}></div>
                            </div>
                            <div className="divider location-container" style={{Display: locationDisplay}}>
                                <div>
                                    <img src={HouseIcon} alt="" />
                                </div>
                                <div style={{display: psysicalDisplay}}>
                                    <ul>
                                        <li>{doc.LocationName}</li>
                                        <li>{doc.LocationAdres}</li>
                                        <li>{doc.LocationCity}</li>
                                    </ul>
                                </div>
                                <div style={{display: onlineDisplay}}>
                                    <ul>
                                        <li>Online</li>
                                    </ul>
                                </div> 
                            </div>
                            <div className="location-container">
                                <div>
                                    <img src={InformationIcon} alt="" />
                                </div>
                                <ul className="event-meta-container">
                                    <li>Datum: {doc.Date}</li>
                                    <li>Prijs: €{doc.Price}</li>
                                    <li>Max. deelnemers: {doc.Capacity}</li>
                                </ul>
                            </div>
                            <div id='register-event-button-container'>
                                <button className={eventButtonClass} data-date={doc.Date} data-title={doc.Title} data-id={doc.ID} onClick={eventSignup}>Aanmelden</button>
                            </div>
                            <div id={showCalendarButton} onClick={showMyCalendar}>
                                <img src={CalendarIcon} alt="" />
                                <p>Bekijk mijn agenda</p>
                            </div>
                        </div>
                    </div>
                ))}
                <h2>Berichten</h2>
                <MessageBar />
                <div className="reaction-area">
                {messages && messages.map(message => ( 
                    <Reaction message={message}/>
                ))}
                </div>
            </div>
                
            <RightSideBar />
        </div>
    )
}

export default EventDetail
