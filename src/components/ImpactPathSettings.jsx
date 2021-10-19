import RightSideBar from "./rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "./LeftSideBarAuthProfileFullScreen";
import MenuStatus from "../hooks/MenuStatus";
import { Editor } from '@tinymce/tinymce-react';
import { useRef, useState, useContext, useEffect } from 'react';
import {useFirestore, useFirestoreActivities} from "../firebase/useFirestore"
import { useHistory } from "react-router-dom"
import { client } from "../hooks/Client"
import { Auth } from '../StateManagment/Auth';
import uuid from 'react-uuid';
import { db, timestamp } from "../firebase/config.js"

const ImpactPathSettings = () => {
    const [authO] = useContext(Auth)
    const [societalProblem, setSocietalProblem] = useState('')
    const [targetGroup, setTargetGroup] = useState('')
    const [goalID, setGoalID] = useState('')

    const goals = useFirestore("Goals")
    const impactPaths = useFirestore("ImpactPaths")
    const activities = useFirestoreActivities(societalProblem)
    
    const menuState = MenuStatus()
    const editorRef = useRef(null);
    const history = useHistory()
    const id = uuid()
    const ref = useRef();

    useEffect(() => {
        impactPaths && impactPaths.forEach(impactPath => {
            const target = impactPath.TargetGroup
            const goal = impactPath.Goal
            const id = impactPath.ID

            setTargetGroup(target)
            setSocietalProblem(goal)
            setGoalID(id)

        })
    }, [impactPaths])

    const societalProblemHandler = (e) => {
        const goal = e.target.options[e.target.selectedIndex].value

        setSocietalProblem(goal)
    }

    const targetGroupHandler = (e) => {
        const target = e.target.value

        setTargetGroup(target)
        
    }

    const activityHandler = (e) => {

        const activity = e.target.value
        const id = e.target.dataset.id 

        db.collection('Activities')
        .doc(id)
        .update({
            Activity: activity
        })
    }

    const deleteActivty = (e) => {

        const id = e.target.dataset.id 

        db.collection('Activities')
        .doc(id)
        .delete()
    }

    const createGoal = () => {
        history.push(`/${client}/AddGoal`)
    }

    const addActivity = (e) => {

        const goal = e.target.dataset.goal

        db.collection('Activities')
        .doc()
        .set({
            Activity: '',
            ID: uuid(),
            Compagny: client,
            Timestamp: timestamp,
            User: authO.UserName,
            UserPhoto: authO.Photo,
            UserID: authO.ID,
            EffectShort: '',
            EffectMiddle: '',
            EffectLong: '',
            Ingredients: '',
            Goal: goal,
            GoalID: goalID
        })
    }

    const saveGoal = () => {

        impactPaths && impactPaths.forEach(impactPath => {
            db.collection("ImpactPaths")
            .doc(impactPath.docid)
            .update({
                Goal: societalProblem,
                TargetGroup: targetGroup,
                LastUpdated: timestamp
            })
        })
    }

    const saveTargetGroup = () => {

        impactPaths && impactPaths.forEach(impactPath => {
            db.collection("ImpactPaths")
            .doc(impactPath.docid)
            .update({
                TargetGroup: targetGroup,
                LastUpdated: timestamp
            })
        })
    }

    const effectShortHandler = (e) => {
        const effect = e.target.value
        const id = e.target.dataset.id 

        db.collection('Activities')
        .doc(id)
        .update({
            EffectShort: effect
        })
    }

    const effectMiddleHandler = (e) => {
        const effect = e.target.value
        const id = e.target.dataset.id 

        db.collection('Activities')
        .doc(id)
        .update({
            EffectMiddle: effect
        })
    }

    const effectLongHandler = (e) => {
        const effect = e.target.value
        const id = e.target.dataset.id 

        db.collection('Activities')
        .doc(id)
        .update({
            EffectLong: effect
        })
    }

    const ingriendentsHandler = (e) => {

        const ingredients = e.target.value
        const id = e.target.dataset.id 

        db.collection('Activities')
        .doc(id)
        .update({
            Ingredients: ingredients
        })
        
    }

    const impactTargetGroupHandler = (e) => {
        const impact = e.target.value
        const id = e.target.dataset.id 

        db.collection("ImpactPaths")
        .doc(id)
        .update({
            ImpactTargetGroup: impact
        })

    }

    const impactSocietyHandler = (e) => {
        const impact= e.target.value
        const id = e.target.dataset.id 

        db.collection("ImpactPaths")
        .doc(id)
        .update({
            ImpactSociety: impact
        })
        
    }

    const linkImpactPad = () => {
        history.push(`/${client}/ImpactPath`)
    }

    return (
        <div className="main">
            <LeftSideBarAuthProfile />
            <LeftSideBarAuthProfileFullScreen/>
            <div className='profile profile-auth-profile' style={{display: menuState}}>
                <div className="settings-inner-container">
                    <div className="divider card-header">
                        <h1>Impactpad</h1>
                        <p>Pas je impactpad aan</p>
                    </div>
                    <div className="divider">
                        <h4>Maatschappelijk doel</h4>
                        <p>Wat is het maatschappelijke doel van jullie organisatie?</p>
                        {impactPaths && impactPaths.map(impactPath => (
                            <select key={impactPath.ID} value={impactPath.Goal} onChange={societalProblemHandler}>
                                <option>-- Selecteer een doel --</option>
                                {goals && goals.map(goal => (
                                    <option ref={ref} key={goal.ID} data-goal={goal.Title}>
                                        {goal.Title}
                                    </option>
                                ))}
                            </select>
                        ))}
                        <button className='button-simple' onClick={createGoal}>Creeer een nieuw doel</button>
                        <div className='button-input-container'>
                            <button className='button-simple' onClick={saveGoal}>Opslaan</button>
                        </div>
                    </div>
                    <div className="divider">
                        <h4>Doelgroep</h4>
                        <p>Voor welke groep mensen wil je helpen met jullie maatschappelijke impact?</p>
                        <input type="text" value={targetGroup} onChange={targetGroupHandler}/>
                        <div className='button-input-container'>
                            <button className='button-simple' onClick={saveTargetGroup}>Opslaan</button>
                        </div>
                    </div>
                    <div className="divider">
                        <h4>Activiteiten</h4>
                        <p>Welke activiteiten gaan jullie inzetten om jullie maatschappelijke doel te bereiken?</p>
                            {activities && activities.map(activity => (
                                <div key={activity.ID}> 
                                    <input type="text" data-id={activity.docid} value={activity.Activity} onChange={activityHandler}/>
                                    <div className='button-input-container'>
                                        <button className='button-simple' >Opslaan</button>
                                        <button className='delete-button-simple' data-id={activity.docid} onClick={deleteActivty}>Verwijderen</button>
                                    </div>
                                </div>
                            ))}
                        <div>
                            {impactPaths && impactPaths.map(impactPath => (
                            <button className='button-simple' data-goal={impactPath.Goal} onClick={addActivity}>Activiteit toevoegen</button>
                            ))}
                        </div>
                    </div>
                    <div className="divider">
                        <h4>Resultaten</h4>
                        <p>Welke effecten willen jullie bereiken met jullie activiteiten (voor de doelgroep)?</p>
                        {activities && activities.map(activity => (
                            <div key={activity.ID}>
                                <h5>{activity.Activity}</h5>
                                <p>Korte termijn effecten (0-12 maanden)</p>
                                <textarea name="" id="" cols="30" rows="10" value={activity.EffectShort} data-id={activity.docid} onChange={effectShortHandler}></textarea>
                                <div className='button-input-container'>
                                    <button className='button-simple'>Opslaan</button>
                                </div>
                                <p>Middellange termijn effecten (1 - 2 jaar)</p>
                                <textarea name="" id="" cols="30" rows="10" value={activity.EffectMiddle} data-id={activity.docid} onChange={effectMiddleHandler}></textarea>
                                <div className='button-input-container'>
                                    <button className='button-simple'>Opslaan</button>
                                </div>
                                <p>Lange termijn effecten (vanaf 2 jaar)</p>
                                <textarea name="" id="" cols="30" rows="10" value={activity.EffectLong} data-id={activity.docid} onChange={effectLongHandler}></textarea>
                                <div className='button-input-container'>
                                    <button className='button-simple'>Opslaan</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="divider">
                        <h4>Werkzame bestanddelen</h4>
                        <p>Onder welke randvoorwaarden kunnen jullie de effecten waarmaken?</p>
                        {activities && activities.map(activity => (
                            <div key={activity.ID}>
                                <h5>{activity.Activity}</h5>
                                <p>Beschrijf welke aan welke randvoorwaarden moet worden voldaan om de effecten van <b>{activity.Activity}</b> waar te maken</p>
                                <textarea data-id={activity.docid} cols="30" rows="10" value={activity.Ingredients} onChange={ingriendentsHandler}></textarea>
                                <div className='button-input-container'>
                                    <button className='button-simple' onClick={saveTargetGroup}>Opslaan</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="divider">
                        <h4>Impact op doelgroep</h4>
                        <p>Welke is de lange termijn impact die wil bereiken voor je doelgroep?</p>
                        {impactPaths && impactPaths.map(impactPath => (
                            <div key={impactPath.ID}>
                                <textarea data-id={impactPath.docid} value={impactPath.ImpactTargetGroup} cols="30" rows="10" onChange={impactTargetGroupHandler}></textarea>
                            </div>
                        ))}
                    </div>
                    <div className="divider">
                        <h4>Impact op maatschappij</h4>
                        <p>Welke is de lange termijn impact die wil bereiken voor de maatschappij?</p>
                        {impactPaths && impactPaths.map(impactPath => (
                            <div key={impactPath.ID}>
                                <textarea data-id={impactPath.docid} value={impactPath.ImpactSociety} cols="30" rows="10" onChange={impactSocietyHandler}></textarea>
                            </div>
                        ))}
                    </div>
                    <div className='button-input-container'>
                        <button onClick={linkImpactPad}>Bekijk impactpad</button>
                    </div>
                </div>
            </div>
            <RightSideBar/>
        </div>
    )
}

export default ImpactPathSettings
