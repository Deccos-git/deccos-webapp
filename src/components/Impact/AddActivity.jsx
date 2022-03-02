import RightSideBar from "../rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "../LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "../LeftSideBarAuthProfileFullScreen";
import MenuStatus from "../../hooks/MenuStatus";
import {useFirestore} from "../../firebase/useFirestore"
import { useState, useEffect, useContext } from 'react'
import { Auth } from '../../StateManagment/Auth';
import uuid from 'react-uuid';
import { db, timestamp } from "../../firebase/config.js"
import { client } from "../../hooks/Client"
import deleteIcon from '../../images/icons/delete-icon.png'
import { useHistory } from "react-router-dom";
import ArrowRightIcon from '../../images/icons/arrow-right-icon.png'
import spinnerRipple from '../../images/spinner-ripple.svg'
import firebase from 'firebase'
import { bucket } from '../../firebase/config';
import ButtonClicked from "../../hooks/ButtonClicked";

const AddActivity = () => {
    const [authO] = useContext(Auth)

    const [goalTitle, setGoalTitle] = useState('')
    const [goalID, setGoalID] = useState('')
    const [activityTitle, setActivityTitle] = useState('')
    const [effect, setEffect] = useState('')
    const [ingredients, setIngredients] = useState('')
    const [externalFactors, setExternalfactors] = useState('')
    const [banner, setBanner] = useState("")
    const [loader, setLoader] = useState("")

    const menuState = MenuStatus()
    const history = useHistory()

    const goals = useFirestore("Goals")

    const goalHandler = (e) => {
        const goalTitle = e.target.options[e.target.selectedIndex].dataset.title
        const goalID = e.target.options[e.target.selectedIndex].dataset.id

        setGoalTitle(goalTitle)
        setGoalID(goalID)
    }

    const activityHandler = (e) => {

        const title = e.target.value 

        setActivityTitle(title)

    }

    const effectHandler = (e) => {
        const effect = e.target.value

        setEffect(effect)
    }

    const ingriendentsHandler = (e) => {

        const ingredients = e.target.value

        setIngredients(ingredients)
        
    }

    const externalFactorsHandler = (e) => {
        const externalFactors = e.target.value 

        setExternalfactors(externalFactors)
    }

    const saveActivity = (e) => {

        ButtonClicked(e, 'Opgeslagen')

        const id = uuid()
        
        db.collection('Activities')
        .doc()
        .set({
            Activity: activityTitle,
            ID: id,
            Compagny: client,
            Timestamp: timestamp,
            User: authO.UserName,
            UserPhoto: authO.Photo,
            UserID: authO.ID,
            Effect: effect,
            Ingredients: ingredients,
            Externalfactors: externalFactors,
            Goal: goalTitle,
            GoalID: goalID,
            Progression: 0,
            Banner: banner,
        })
        .then(() => {
            db.collection('Outputs')
            .doc()
            .set({
                Title: effect,
                Description: 'Effect',
                ActivityID: id,
                ID: uuid(),
                Compagny: client,
                Timestamp: timestamp,
                User: authO.UserName,
                UserPhoto: authO.Photo,
                UserID: authO.ID,
                Type: `Effect van activiteit "${activityTitle}"`
            })
        })  
    }

    const deleteActivity = (e) => {
        const docid = e.target.dataset.docid

        db.collection('Activities')
        .doc(docid)
        .delete()
    }

    const nextStep = () => {

        history.push(`/${client}/MilestoneSettings`)

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


    return (
        <div className="main">
        <LeftSideBarAuthProfile />
        <LeftSideBarAuthProfileFullScreen/>
        <div className="profile profile-auth-profile" style={{display: menuState}}>
            <div className="settings-inner-container">
                <div className="divider card-header">
                    <h1>Activiteit toevoegen</h1>
                </div>
                <div className='divider'>
                        <h4>Selecteer een doel</h4>
                        <select name="" id="" onChange={goalHandler}>
                            <option value="">-- Selecteer een doel --</option>
                            {goals && goals.map(goal => (
                                <option value="" key={goal.ID} data-id={goal.ID} data-title={goal.Title}>{goal.Title}</option>
                            ))}
                        </select>
                        <h4>Beschrijf activiteit</h4>
                        <input type="text" placeholder='Beschrijf hier je activiteit' onChange={activityHandler}/>
                        <h4>Wat is het beoogde effect van deze activiteit</h4>
                        <textarea name="" id="" cols="30" rows="10" onChange={effectHandler}></textarea>
                        <h4>Onder welke randvoorwaarden kunnen jullie de effecten waarmaken?</h4>
                        <textarea name="" id="" cols="30" rows="10" onChange={ingriendentsHandler}></textarea>
                        <h4>Welke externe factoren (positief en negatief) hebben invloed het waarmaken van het effect?</h4>
                        <textarea name="" id="" cols="30" rows="10" onChange={externalFactorsHandler}></textarea>
                </div>
                <div className="divider">
                    <h4>Voeg een bannerfoto toe</h4>
                    <input className="input-classic" onChange={bannerHandler} type="file" />
                    <div className="spinner-container">
                        <img src={loader} alt="" />
                    </div> 
                </div>
                <button onClick={saveActivity}>Opslaan</button>
            </div>
            <div className='next-step-impact'>
                <img src={ArrowRightIcon} alt="" onClick={nextStep}/>
                <h3 onClick={nextStep}>Volgende stap: mijlpalen toevoegen</h3>
            </div>
        </div>
        <RightSideBar />
        </div>
    )
}

export default AddActivity
