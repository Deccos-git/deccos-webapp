import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./rightSideBar/RightSideBar"
import Auth from "../firebase/Auth"
import { useState } from "react"
import { db, timestamp } from "../firebase/config.js"
import uuid from 'react-uuid';
import IntroductionsCard from './IntroductionsCard'
import { client } from "../hooks/Client";
import { useFirestore } from '../firebase/useFirestore'

const Introductions = () => {
    const [body, setBody] = useState("")

    const auth = Auth()
    const id = uuid()
    const compagny = useFirestore("CompagnyMeta")

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
            UserName: auth.UserName,
            Photo: auth.Photo,
            ForName: auth.ForName,
            Timestamp: timestamp,
            ID: id,
            Compagny: client
        })
        .then(() => {
            db.collection("AllActivity")
            .doc()
            .set({
                Title: `Goed bezig ${auth.ForName}!`,
                Type: "NewIntroduction",
                Compagny: client,
                ButtonText: "Bekijk",
                Timestamp: timestamp,
                ID: id,
                Banner: banner,
                Description: 'heeft zich voorgesteld aan de community',
                Link: `/Introductions`,
                User: `${auth.ForName} ${auth.SurName}`,
                UserPhoto: auth.Photo,
            }) 
        })
    }

    const placeholder = `Schijf iets over jezelf - Wat wil je aan de community bijdragen? - Wat wil je uit de community halen?`

    return (
        <div className="main">
            <LeftSideBar />
            <div className="card-overview">
                <div id="introduction-input-container">
                    <h3>Hoi {auth.ForName}, stel jezelf voor aan de community</h3>
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
