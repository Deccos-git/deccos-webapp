import { useFirestoreID, useFirestoreMessages } from "../firebase/useFirestore"
import LeftSideBar from "./LeftSideBar"
import LeftSideBarFullScreen from "./LeftSideBarFullScreen"
import RightSideBar from "./rightSideBar/RightSideBar"
import MessageBar from "./MessageBar"
import { db } from "../firebase/config"
import { useState } from "react"
import Location from "../hooks/Location"
import HouseIcon from "../images/icons/house-icon.png"
import InformationIcon from "../images/icons/information-icon.png"
import Reaction from "./Reaction"
import MenuStatus from "../hooks/MenuStatus";
import { useHistory } from "react-router-dom"
import { client } from "../hooks/Client"


const EventDetail = () => {
    const [psysicalDisplay, setPsysicalDisplay] = useState("")
    const [onlineDisplay, setOnlineDisplay] = useState("")

    const route = Location()[3]
    const menuState = MenuStatus()
    const history = useHistory()

    const events = useFirestoreID("Events", route)
    const messages  = useFirestoreMessages("Messages", route)

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

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

    return (
        <div className="main">
            <LeftSideBar />
            <LeftSideBarFullScreen/>
            <div className="article-container" style={{display: menuState}}>
                {events && events.map(doc => (
                    <div className="article">
                        <h1>{doc.Title}</h1>
                        <img className="article-detail-banner" src={doc.Banner} alt="" />
                        <div className="list-inner-container">
                            <div className="article-card-user-container">
                                <img src={doc.UserPhoto} alt="" data-id={doc.UserID} onClick={profileLink} />
                                <p data-id={doc.UserID} onClick={profileLink}>{doc.User}</p>
                            </div>
                            <p>{doc.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
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
                                    <li>Prijs: {doc.Price}</li>
                                    <li>Max. deelnemers: {doc.Capacity}</li>
                                </ul>
                            </div>
                            <div>
                                <button className="event-detail-button">Aanmelden</button>
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
