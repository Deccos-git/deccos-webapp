import { motion } from "framer-motion"
import { db, timestamp } from "../../firebase/config.js"
import { client } from '../../hooks/Client';
import { Link } from "react-router-dom";
import uuid from 'react-uuid';
import LeftSideBarAuthProfile from "../LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "../LeftSideBarAuthProfileFullScreen";
import RightSideBar from "../rightSideBar/RightSideBar"
import { useFirestore } from '../../firebase/useFirestore.js';
import spinnerRipple from '../../images/spinner-ripple.svg'
import firebase from 'firebase'
import { bucket } from '../../firebase/config';
import { useContext, useState, useEffect } from 'react';
import { Auth } from '../../StateManagment/Auth';
import MenuStatus from "../../hooks/MenuStatus";

const AddGoal = () => {
    const [authO] = useContext(Auth)

    const [title, setTitle] = useState("")
    const [impactTargetgroup, setImpactTargetgroup] = useState("")
    const [impactSociety, setImpactSociety] = useState("")
    const [banner, setBanner] = useState("")
    const [loader, setLoader] = useState("")
    const [SDG, setSDG] = useState("")
    const [headerPhoto, setHeaderPhoto] = useState('')
    const [targetGroup, setTargetGroup] = useState('')

    const id = uuid()
    const menuState = MenuStatus()
    
    const compagny = useFirestore("CompagnyMeta")
    const banners = useFirestore('Banners')

    useEffect(() => {
        banners && banners.forEach(banner => {
            const header = banner.NewGoal
            setHeaderPhoto(header)
        })
    }, [banners])

    const variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }

    const titleHandler = (e) => {
        const title = e.target.value
        setTitle(title)
    }

    const impactTargetgroupHandler = (e) => {
        const body = e.target.value
        setImpactTargetgroup(body)
    }

    const impactSocietyHandler = (e) => {
        const body = e.target.value
        setImpactSociety(body)
    }

    const targetGroupHandler = (e) => {
        const target = e.target.value

        setTargetGroup(target)
        
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

    const saveGoal = () => {
        db.collection("Goals")
        .doc()
        .set({
            Title: title,
            ImpactSociety: impactSociety,
            ImpactTargetgroup: impactTargetgroup,
            TargetGroup: targetGroup,
            Type: 'SDG',
            Compagny: client,
            Timestamp: timestamp,
            ID: id,
            User: authO.UserName,
            UserPhoto: authO.Photo,
            UserID: authO.ID,
            Banner: banner,
            SDG: SDG,
            Contributions: []
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
                UserID: authO.ID,
                Banner: headerPhoto,
                Link: `GoalDetail/${id}`
            }) 
        })
        .then(() => {
            db.collection("Search")
            .doc()
            .set({
                Name: title,
                Compagny: client,
                Type: 'Doel',
                Link: `GoalDetail/${id}`
            })
        })
    }

    const selectSDG = (e) => {

        const SDG = e.target.options[e.target.selectedIndex].value

        setSDG(SDG)

    }

    const SDGInformation = () => {

    }

    return (
        <div className="main">
            <LeftSideBarAuthProfile />
            <LeftSideBarAuthProfileFullScreen/>
            <motion.div className="profile profile-auth-profile"
            initial="hidden"
            animate="visible"
            variants={variants}
            style={{display: menuState}}>
                <div className="card-header">
                    <h2>Voeg een doel toe</h2>
                    <p>Voeg een nieuw doel toe om samen aan te werken</p>
                </div>
                <form id="add-goal-form">
                    <div className="divider">
                        <h4>Geef het doel een titel</h4>
                        <input className="input-classic" type="text" placeholder="Schrijf hier de titel" onChange={titleHandler} />
                    </div>
                    <div className="divider">
                        <h4>Doelgroep</h4>
                        <p>Welke groep mensen wil je helpen met dit doel?</p>
                        <input type="text" onChange={targetGroupHandler}/>
                    </div>
                    <div className="divider ">
                        <h4>Selecteer een SDG</h4>
                        <p>Kies welke van de 17 Social Development Goals (SDG's) van de Verenigde Naties (VN) past bij dit doel:</p>
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
                                <option value="Vrede, justitie en sterker publieke diensten">Vrede, justitie en sterke publieke diensten</option>
                                <option value="Partnerschap om doelstellingen te bereiken">Partnerschap om doelstellingen te bereiken</option>
                            </select>
                            <p className="more-sdg" onClick={SDGInformation}><u>Meer over de SDG's</u></p>
                        </div>
                    </div>
                    <div className="divider">
                        <h4>Impact op doelgroep</h4>
                        <p>Welke is de lange termijn impact die wil bereiken voor je doelgroep?</p>
                        <textarea className="textarea-classic"
                        name="body" 
                        id="body" 
                        cols="30" 
                        rows="10" 
                        placeholder="Omschrijf hier de impact voor de doelgroep"
                        onChange={impactTargetgroupHandler}>
                        </textarea>
                    </div>
                    <div className="divider">
                        <h4>Impact op maatschappij</h4>
                        <p>Welke is de lange termijn impact die wil bereiken voor de maatschappij?</p>
                        <textarea className="textarea-classic"
                        name="body" 
                        id="body" 
                        cols="30" 
                        rows="10" 
                        placeholder="Omschrijf hier de maatschappelijke impact"
                        onChange={impactSocietyHandler}>
                        </textarea>
                    </div>
                    <div className="divider">
                        <h4>Voeg een bannerfoto toe</h4>
                        <input className="input-classic" onChange={bannerHandler} type="file" />
                        <div className="spinner-container">
                            <img src={loader} alt="" />
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