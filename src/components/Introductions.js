import LeftSideBar from "./LeftSideBar"
import LeftSideBarFullScreen from "./LeftSideBarFullScreen"
import RightSideBar from "./rightSideBar/RightSideBar"
import { useState, useContext } from "react"
import { db, timestamp } from "../firebase/config.js"
import uuid from 'react-uuid';
import IntroductionsCard from './IntroductionsCard'
import { client } from "../hooks/Client";
import { useFirestore } from '../firebase/useFirestore'
import { Auth } from '../StateManagment/Auth';
import MenuStatus from "../hooks/MenuStatus";

const Introductions = () => {
    const [body, setBody] = useState("")
    const [authO] = useContext(Auth)

    const id = uuid()
    const compagny = useFirestore("CompagnyMeta")
    const menuState = MenuStatus()

    const textBody = (e) => {
        const body = e.target.value

        setBody(body)
    }

    let banner = ""

    compagny && compagny.forEach(comp => {

        banner = comp.ActivityBanner.NewIntroduction
    })

    const saveIntroduction = () => {

        db.collection("Introductions")
        .doc()
        .set({
            Body: body,
            UserName: authO.UserName,
            Photo: authO.Photo,
            ForName: authO.ForName,
            Timestamp: timestamp,
            ID: id,
            Compagny: client,
            AuthID: authO.ID
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
                Banner: banner,
                Description: 'heeft zich voorgesteld aan de community',
                Link: `Introductions`,
                User: `${authO.ForName} ${authO.SurName}`,
                UserPhoto: authO.Photo,
                UserID: authO.ID,
            }) 
        })
    }

    const placeholder = `Schijf iets over jezelf - Wat wil je aan de community bijdragen? - Wat wil je uit de community halen?`

    return (
        <div className="main">
            <LeftSideBar />
            <LeftSideBarFullScreen/>
            <div className="card-overview" style={{display: menuState}}>
                <div id="introduction-input-container">
                    <h3>Hoi {authO.ForName}, stel jezelf voor aan de community</h3>
                    <textarea name="" id="introductions-textarea" cols="30" rows="10" placeholder={placeholder} onChange={textBody}></textarea>
                    <div className="button-container">
                        <button className="button-simple" onClick={saveIntroduction}>Versturen</button>
                    </div>
                </div>
                <IntroductionsCard />
            </div>
            <RightSideBar />
        </div>
    )
}

export default Introductions
