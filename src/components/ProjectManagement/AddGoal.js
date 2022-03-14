import { motion } from "framer-motion"
import { db, timestamp } from "../../firebase/config.js"
import { client } from '../../hooks/Client';
import { Link } from "react-router-dom";
import uuid from 'react-uuid';
import LeftSideBarAuthProfile from "../LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "../LeftSideBarAuthProfileFullScreen";
import RightSideBar from "../rightSideBar/RightSideBar"
import { useFirestore, useFirestoreSDGs } from '../../firebase/useFirestore.js';
import spinnerRipple from '../../images/spinner-ripple.svg'
import firebase from 'firebase'
import { bucket } from '../../firebase/config';
import { useContext, useState, useEffect } from 'react';
import { Auth } from '../../StateManagment/Auth';
import MenuStatus from "../../hooks/MenuStatus";
import { useHistory } from "react-router-dom";
import ArrowRightIcon from '../../images/icons/arrow-right-icon.png'
import ButtonClicked from "../../hooks/ButtonClicked.jsx";

const AddGoal = () => {
    const [authO] = useContext(Auth)

    const [title, setTitle] = useState("")
    const [impactTargetgroup, setImpactTargetgroup] = useState("")
    const [impactSociety, setImpactSociety] = useState("")
    const [preconditions, setPreconditions] = useState('')
    const [externalFactors, setExternalFactors] = useState('')
    const [banner, setBanner] = useState("")
    const [loader, setLoader] = useState("")
    const [SDG, setSDG] = useState("")
    const [headerPhoto, setHeaderPhoto] = useState('')
    const [targetGroup, setTargetGroup] = useState('')

    const id = uuid()
    const menuState = MenuStatus()
    const history = useHistory()
    
    const banners = useFirestore('Banners')
    const sdgs = useFirestoreSDGs('SDGs')

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

    const saveGoal = (e) => {

        ButtonClicked(e, 'Opgeslagen')

        db.collection("Goals")
        .doc()
        .set({
            Title: title,
            ImpactSociety: impactSociety,
            ImpactTargetgroup: impactTargetgroup,
            TargetGroup: targetGroup,
            Preconditions: preconditions,
            ExternalFactors: externalFactors,
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

    const SDGhandler = (e) => {

        const sdg = e.target.value

        setSDG([...SDG, sdg])

    }

    const preconditionsHandler = (e) => {
        const precondition = e.target.value 

        setPreconditions(precondition)

    }

    const externalFactorsHandler = (e) => {

        const factors = e.target.value 

       setExternalFactors(factors)

    }

    const SDGInformation = () => {

    }

    const nextStep = () => {

        history.push(`/${client}/ActivitySettings`)

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
                        <p>Kies welke van de 17 Social Development Goals (SDG's) van de Verenigde Naties (VN) passen bij dit doel:</p>
                        <div>
                            {sdgs && sdgs.map(sdg => (
                                <div id='add-goal-sdg-container'>
                                    <input type="radio" id={sdg.ID} value={sdg.SDG} onChange={SDGhandler} />
                                    <label htmlFor={sdg.SDG}>{sdg.SDG}</label>
                                </div>
                            ))}
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
                        <h4>Onder welke randvoorwaarden kunnen jullie de impact waarmaken?</h4>
                        <textarea className="textarea-classic"
                        name="body" 
                        id="body" 
                        cols="30" 
                        rows="10" 
                        placeholder="Omschrijf hier de randvoorwaarden"
                        onChange={preconditionsHandler}>
                        </textarea>
                    </div>
                    <div className="divider">
                        <h4>Welke externe factoren (positief en negatief) hebben invloed het waarmaken van het impact?</h4>
                        <textarea className="textarea-classic"
                        name="body" 
                        id="body" 
                        cols="30" 
                        rows="10" 
                        placeholder="Omschrijf hier de externe factoren"
                        onChange={externalFactorsHandler}>
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
                    <Link to={`/${client}/GoalSettings`}><button onClick={saveGoal}>Opslaan</button></Link>
                </div>
                <div className='next-step-impact'>
                    <img src={ArrowRightIcon} alt="" onClick={nextStep}/>
                    <h3 onClick={nextStep}>Volgende stap: activiteiten toevoegen</h3>
                </div>
            </motion.div>
            <RightSideBar />
        </div>
    )
}

export default AddGoal
