import RightSideBar from "./rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "./LeftSideBarAuthProfileFullScreen";
import MenuStatus from "../hooks/MenuStatus";
import { useState, useEffect } from 'react';
import {useFirestoreID } from "../firebase/useFirestore"
import { useHistory } from "react-router-dom"
import { db, timestamp } from "../firebase/config.js"
import Location from "../hooks/Location"
import deleteIcon from '../images/icons/delete-icon.png'

const ImpactPathSettings = () => {
    const [targetGroup, setTargetGroup] = useState('')

    const route = Location()[3]
     
    const menuState = MenuStatus()
    const history = useHistory()

    const impactPaths = useFirestoreID("ImpactPaths", route)

    useEffect(() => {
        impactPaths && impactPaths.forEach(impactPath => {
            const target = impactPath.TargetGroup
            const goal = impactPath.Goal
            const id = impactPath.ID

            setTargetGroup(target)

        })
    }, [impactPaths])

    const targetGroupHandler = (e) => {
        const target = e.target.value

        setTargetGroup(target)
        
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

    const deleteImpactpath = (e) => {
        const docid = e.target.dataset.docid

        db.collection('ImpactPaths')
        .doc(docid)
        .delete()
    }

    return (
        <div className="main">
            <LeftSideBarAuthProfile />
            <LeftSideBarAuthProfileFullScreen/>
            <div className='profile profile-auth-profile' style={{display: menuState}}>
                <div className="settings-inner-container">
                {impactPaths && impactPaths.map(impactPath => (
                    <div>
                        <div className="divider card-header">
                            <h1>Impactpad</h1>
                            <h3>{impactPath.Goal}</h3>
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
                            <h4>Impact op doelgroep</h4>
                            <p>Welke is de lange termijn impact die wil bereiken voor je doelgroep?</p>
                            <div key={impactPath.ID}>
                                <textarea data-id={impactPath.docid} value={impactPath.ImpactTargetGroup} cols="30" rows="10" onChange={impactTargetGroupHandler}></textarea>
                            </div>
                            <div className='button-input-container'>
                                <button className='button-simple' >Opslaan</button>
                            </div>
                        </div>
                        <div className="divider">
                            <h4>Impact op maatschappij</h4>
                            <p>Welke is de lange termijn impact die wil bereiken voor de maatschappij?</p>
                            <div key={impactPath.ID}>
                                <textarea data-id={impactPath.docid} value={impactPath.ImpactSociety} cols="30" rows="10" onChange={impactSocietyHandler}></textarea>
                            </div>
                            <div className='button-input-container'>
                                <button className='button-simple' >Opslaan</button>
                            </div>
                        </div>
                        <div className="divider">
                            <h3>Impactpad verwijderen</h3>
                            <img className="delete-channel" src={deleteIcon} data-id={impactPath.docid} onClick={deleteImpactpath} />
                        </div>
                    </div>
                     ))}
                </div>
            </div>
            <RightSideBar/>
        </div>
    )
}

export default ImpactPathSettings

