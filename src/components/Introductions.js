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
                Link: `/${client}/Introductions`,
                User: `${auth.ForName} ${auth.SurName}`,
                UserPhoto: auth.Photo,
            }) 
        })

    }

    return (
        <div className="main">
            <LeftSideBar />
            <div className="card-overview">
                <div className="list">
                    <h2>Hoi {auth.ForName},</h2>
                    <h3>Stel jezelf voor aan de community</h3>
                    <textarea name="" id="" cols="30" rows="10" placeholder="Schrijf iets over jezelf" onChange={textBody}></textarea>
                    <div className="button-container">
                        <button onClick={saveIntroduction}>Versturen</button>
                    </div>
                </div>
                <IntroductionsCard />
            </div>
            <RightSideBar />
        </div>
    )
}

export default Introductions
