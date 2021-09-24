import { useState } from 'react'
import { motion } from "framer-motion"
import { db, timestamp } from "../../firebase/config.js"
import { client } from '../../hooks/Client';
import { Link } from "react-router-dom";
import uuid from 'react-uuid';
import LeftSideBar from "../LeftSideBar"
import RightSideBar from "../rightSideBar/RightSideBar"
import { useFirestore } from '../../firebase/useFirestore.js';
import spinnerRipple from '../../images/spinner-ripple.svg'
import firebase from 'firebase'
import { bucket } from '../../firebase/config';
import { useContext } from 'react';
import { Auth } from '../../StateManagment/Auth';

const AddGoal = () => {
    const [authO] = useContext(Auth)

    const id = uuid()
    const compagny = useFirestore("CompagnyMeta")

    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [type, setType] = useState("")
    const [banner, setBanner] = useState("")
    const [loader, setLoader] = useState("")
    const [toggleGoal, setToggleGoal] = useState("none")
    const [SDG, setSDG] = useState("")

    const variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }

    const titleHandler = (e) => {
        const title = e.target.value
        setTitle(title)
    }

    const bodyHandler = (e) => {
        const body = e.target.value
        setBody(body)
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

    let activityBanner = ""
    let compagnyId = ""

    compagny && compagny.forEach(comp => {
        activityBanner = comp.ActivityBanner[0].NewArticle
        compagnyId = comp.docid
    })

    const saveGoal = () => {
        db.collection("Goals")
        .doc()
        .set({
            Title: title,
            Body: body,
            Type: type,
            Compagny: client,
            Timestamp: timestamp,
            ID: id,
            User: authO.UserName,
            UserPhoto: authO.Photo,
            UserID: authO.ID,
            Banner: banner,
            SDG: SDG
        })
        .then(() => {
            db.collection("AllActivity")
            .doc()
            .set({
                Title: title,
                Type: "NewGoal",
                Compagny: client,
                Timestamp: timestamp,
                ID: id,
                Description: "heeft een nieuw doel toegevoegd:",
                ButtonText: "Bekijk doel",
                User: authO.UserName,
                UserPhoto: authO.Photo,
                Banner: activityBanner,
                Link: `GoalDetail`
            }) 
        })
    }

    const internalGoal = (e) => {
        setToggleGoal("none")
        const type = e.target.value
        setType(type)
    }

    const SDGGoal = (e) => {
        setToggleGoal("block")
        const type = e.target.value
        setType(type)
    }

    const selectSDG = (e) => {

        const SDG = e.target.options[e.target.selectedIndex].value

        setSDG(SDG)

    }

    const SDGInformation = () => {

    }

    return (
        <div className="main">
            <LeftSideBar />
            <motion.div className="profile"
            initial="hidden"
            animate="visible"
            variants={variants}>
                <div className="card-header">
                    <h2>Voeg een doel toe</h2>
                    <p>Voeg een nieuw doel toe om samen aan te werken</p>
                </div>
                <form id="add-goal-form">
                    <div className="divider">
                        <h4>Geef het doel een titel</h4>
                        <input className="input-classic" type="text" placeholder="Schrijf hier de titel" onChange={titleHandler} />
                    </div >
                    <div className="divider">
                        <h4>Omschrijf het doel</h4>
                        <textarea className="textarea-classic"
                        name="body" 
                        id="body" 
                        cols="30" 
                        rows="10" 
                        placeholder="Schrijf hier de omschrijving"
                        onChange={bodyHandler}>
                        </textarea>
                    </div>
                    <div className="divider">
                        <p>Voeg een bannerfoto toe</p>
                        <input className="input-classic" onChange={bannerHandler} type="file" />
                        <div className="spinner-container">
                            <img src={loader} alt="" />
                        </div> 
                    </div>
                    <div>
                        <h4>Is het een intern of een sociaal maatschappelijk doel?</h4>
                        <input 
                        type="radio" 
                        className="input-radio" 
                        id="SDG" 
                        value="SDG" 
                        name="goal-type"
                        onChange={SDGGoal}
                        />
                        <label htmlFor="SDG">Sociaal maatschappelijk</label>
                        <input 
                        type="radio" 
                        className="input-radio" 
                        id="internal" 
                        value="internal" 
                        name="goal-type"
                        onChange={internalGoal}/>
                        <label htmlFor="internal">Intern</label>
                    </div>
                    <div className="divider " style={{display: toggleGoal}}>
                        <h2>Selecteer een SDG</h2>
                        <div>
                            <select className="SDG-select"name="" id="" onChange={selectSDG}>
                                <option value="">--- Selecteer een SDG ---</option>
                                <option value="Geen armoede">Geen armoede</option>
                                <option value="Geen honger">Geen honger</option>
                                <option value="Goede gezondheid en welzijn">Goede gezondheid en welzijn</option>
                                <option value="Kwaliteitsonderwijs">Kwaliteitsonderwijs</option>
                                <option value="Gendergelijkheid">Gendergelijkheid</option>
                                <option value="Schoon water en sanitair">Schoon water en sanitair</option>
                                <option value="Betaalbare en duurzame energie">Betaalbare en duurzame energie</option>
                                <option value="Waardig werk en economische groei">Waardig werk en economische groei</option>
                                <option value="Industrie, innovatie en infrastructuur">Industrie, innovatie en infrastructuur</option>
                                <option value="Ongelijkheid verminderen">Ongelijkheid verminderen</option>
                                <option value="Duurzame steden en gemeenschappen">Duurzame steden en gemeenschappen</option>
                                <option value="Verantwoorde consumptie en productie">Verantwoorde consumptie en productie</option>
                                <option value="Klimaatactie">Klimaatactie</option>
                                <option value="Leven in het water">Leven in het water</option>
                                <option value="Leven op het land">Leven op het land</option>
                                <option value="Vrede, justitie en sterker publieke diensten">Vrede, justitie en sterker publieke diensten</option>
                                <option value="Partnerschap om doelstellingen te bereiken">Partnerschap om doelstellingen te bereiken</option>
                            </select>
                            <p className="more-sdg" onClick={SDGInformation}><u>Meer over de SDG's</u></p>
                        </div>

                    </div>
                </form>
                <div id="button-add-goal">
                    <Link to={`/${client}/Goals`}><button onClick={saveGoal}>Opslaan</button></Link>
                </div>
            </motion.div>
            <RightSideBar />
        </div>
    )
}

export default AddGoal
