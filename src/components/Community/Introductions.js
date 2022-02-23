import LeftSideBar from "../LeftSideBar"
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import RightSideBar from "../rightSideBar/RightSideBar"
import { useState, useContext, useEffect } from "react"
import { db, timestamp } from "../../firebase/config.js"
import uuid from 'react-uuid';
import IntroductionsCard from './IntroductionsCard'
import { client } from "../../hooks/Client";
import { useFirestore, useFirestoreMessages } from '../../firebase/useFirestore'
import { Auth } from '../../StateManagment/Auth';
import MenuStatus from "../../hooks/MenuStatus";
import { useLocation } from "react-router-dom"
import Location from "../../hooks/Location"
import Reaction from "./Reaction"
import ButtonClicked from "../../hooks/ButtonClicked"

const Introductions = () => {
    const [authO] = useContext(Auth)

    const [body, setBody] = useState("")
    const [headerPhoto, setHeaderPhoto] = useState('')

    const id = uuid()
    const menuState = MenuStatus()
    const location = useLocation()
    const route = Location()[2]

    const banners = useFirestore('Banners')
    const messages  = useFirestoreMessages("Messages", route)

    console.log(messages)

    useEffect(() => {
        banners && banners.forEach(banner => {
            const header = banner.NewIntroduction
            setHeaderPhoto(header)
        })
    }, [banners])

    const textBody = (e) => {
        const body = e.target.value

        setBody(body)
    }

    const saveIntroduction = (e) => {

        ButtonClicked(e, 'Verstuurd')

        db.collection("Messages")
        .doc()
        .set({
            Type: "Introduction",
            Message: body,
            Timestamp: timestamp,
            ID: id,
            Tagged: [],
            ParentID: route,
            Compagny: client,
            User: authO.UserName,
            UserPhoto: authO.Photo,
            Email: authO.Email,
            Read: [authO.ID],
            UserID: authO.ID,
            Contributions: [],
            Public: true,
            Likes: 0
        })
        .then(() => {
            db.collection("AllActivity")
            .doc()
            .set({
                Title: `Goed bezig ${authO.ForName}!`,
                Type: "NewIntroduction",
                Compagny: client,
                ButtonText: "Bekijk",
                Timestamp: timestamp,
                ID: id,
                Banner: headerPhoto,
                Description: 'heeft zich voorgesteld aan de community',
                Link: `Introductions`,
                User: `${authO.ForName} ${authO.SurName}`,
                UserPhoto: authO.Photo,
                UserID: authO.ID,
            }) 
        })
        .then(() => {
            db.collection("Search")
            .doc()
            .set({
                Name: body,
                Compagny: client,
                Type: 'Introductie',
                Link: `Introductions`
            })
        })
    }

    const placeholder = `Schijf iets over jezelf - Wat wil je aan de community bijdragen? - Wat wil je uit de community halen?`

    return (
        <div className="main">
            <LeftSideBar />
            <LeftSideBarFullScreen/>
            <div className="card-overview" style={{display: menuState}}>
                <div className="page-header">
                    <h1>Stel je voor</h1>
                </div>
                <div id="introduction-input-container">
                    <h3>Hoi {authO.ForName}, stel jezelf voor aan de community</h3>
                    <textarea name="" id="introductions-textarea" cols="30" rows="10" placeholder={placeholder} onChange={textBody}></textarea>
                    <div className="button-container">
                        <button className="button-simple" onClick={saveIntroduction}>Versturen</button>
                    </div>
                </div>
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

export default Introductions
