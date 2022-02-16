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

const AddActivity = () => {
    const [authO] = useContext(Auth)

    const [goalTitle, setGoalTitle] = useState('')
    const [goalID, setGoalID] = useState('')
    const [activityTitle, setActivityTitle] = useState('')
    const [effectShort, setEffectShort] = useState('')
    const [effectMiddle, setEffectMiddle] = useState('')
    const [effectLong, setEffectLong] = useState('')
    const [ingredients, setIngredients] = useState('')

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

    const effectShortHandler = (e) => {
        const effect = e.target.value

        setEffectShort(effect)
    }

    const effectMiddleHandler = (e) => {
        const effect = e.target.value

        setEffectMiddle(effect)
    }

    const effectLongHandler = (e) => {
        const effect = e.target.value

        setEffectLong(effect)
    }

    const ingriendentsHandler = (e) => {

        const ingredients = e.target.value

        setIngredients(ingredients)
        
    }

    const saveActivity = (e) => {

        e.target.innerText = 'Opgeslagen'
        
        db.collection('Activities')
        .doc()
        .set({
            Activity: activityTitle,
            ID: uuid(),
            Compagny: client,
            Timestamp: timestamp,
            User: authO.UserName,
            UserPhoto: authO.Photo,
            UserID: authO.ID,
            EffectShort: effectShort,
            EffectMiddle: effectMiddle,
            EffectLong: effectLong,
            Ingredients: ingredients,
            Goal: goalTitle,
            GoalID: goalID,
            Progression: 0
        })
    }

    const deleteActivity = (e) => {
        const docid = e.target.dataset.docid

        db.collection('Activities')
        .doc(docid)
        .delete()
    }

    const nextStep = () => {

        history.push(`/${client}/Output`)

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
                        <h4>Wat is het effect van deze activiteit op de korte termijn (0 - 1,5 jaar)</h4>
                        <textarea name="" id="" cols="30" rows="10" onChange={effectShortHandler}></textarea>
                        <h4>Wat is het effect van deze activiteit op de lange termijn (vanaf 1,5 jaar)</h4>
                        <textarea name="" id="" cols="30" rows="10" onChange={effectLongHandler}></textarea>
                        <h4>Onder welke randvoorwaarden kunnen jullie de effecten waarmaken?</h4>
                        <textarea name="" id="" cols="30" rows="10" onChange={ingriendentsHandler}></textarea>
                        <button className='button-simple' onClick={saveActivity}>Opslaan</button>
                </div>
            </div>
            <div className='next-step-impact'>
                <img src={ArrowRightIcon} alt="" onClick={nextStep}/>
                <h3 onClick={nextStep}>Volgende stap: output toevoegen</h3>
            </div>
        </div>
        <RightSideBar />
        </div>
    )
}

export default AddActivity
