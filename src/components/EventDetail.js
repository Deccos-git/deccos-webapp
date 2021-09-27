import { useFirestoreID, useFirestoreMessages } from "../firebase/useFirestore"
import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./rightSideBar/RightSideBar"
import LikeBar from "./LikeBar"
import ReactionBar from "./ReactionBar"
import { useHistory } from "react-router-dom"
import { client } from "../hooks/Client"
import MessageBar from "./MessageBar"
import { db } from "../firebase/config"
import { useContext, useState } from "react"
import { Auth } from '../StateManagment/Auth';
import Location from "../hooks/Location"
import HouseIcon from "../images/icons/house-icon.png"
import InformationIcon from "../images/icons/information-icon.png"

const EventDetail = () => {
    const [psysicalDisplay, setPsysicalDisplay] = useState("")
    const [onlineDisplay, setOnlineDisplay] = useState("")

    const [authO] = useContext(Auth)
    const route = Location()[3]

    const events = useFirestoreID("Events", route)
    const messages  = useFirestoreMessages("Messages", route)
    const history = useHistory()

    let numberOfReactions = ""

    messages && messages.forEach(message => {
        if(message.Thread.length === 0){
            numberOfReactions = `Bekijk bericht`
        } else if (message.Thread.length === 1){
            numberOfReactions = `Bekijk ${message.Thread.length} reactie`
        } else {
            numberOfReactions = `Bekijk ${message.Thread.length} reacties`
        }
    })

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    const updateRoute = () => {

        messages && messages.forEach(message => {
            history.push(`/${client}/MessageDetail/${message.ID}`) 
        })
    }

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

    return (
        <div className="main">
            <LeftSideBar />
            <div className="article-container">
                {events && events.map(doc => (
                    <div className="article">
                        <h1>{doc.Title}</h1>
                        <img className="article-detail-banner" src={doc.Banner} alt="" />
                        <div className="list-inner-container">
                            <div className="article-card-user-container">
                                <img src={doc.UserPhoto} alt="" />
                                <p>{doc.User}</p>
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
                    <div className="reaction-inner-container">
                        <div className="auth-message-container">
                            <img src={message.UserPhoto} alt="" />
                        </div>
                        <div>
                            <div className="user-meta-container">
                                <p className="auth-name">{message.User}</p>
                                <p className="message-card-timestamp">{message.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                            </div>
                            <div className="message-container">
                                <p className="massage">{message.Message}</p>
                            </div>
                            <div className="like-container">
                                {/* <img src={heartIcon} alt="" onClick={LikeHandler} /> */}
                                < LikeBar message={message} />
                            </div>
                            <div className="button-container">
                                <button onClick={updateRoute}>{numberOfReactions}</button>
                            </div>
                            < ReactionBar message={message} />
                        </div>
                    </div>
                ))}
                </div>
            </div>
                
            <RightSideBar />
        </div>
    )
}

export default EventDetail
