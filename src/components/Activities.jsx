import LeftSideBar from "./LeftSideBar";
import LeftSideBarFullScreen from "./LeftSideBarFullScreen"
import MenuStatus from "../hooks/MenuStatus";
import {useFirestore} from "../firebase/useFirestore"
import { client } from "../hooks/Client"
import { useHistory } from "react-router-dom";
import { useState, useEffect } from 'react'
import penIcon from '../images/icons/pen-icon.png'
import { NavLink, Link } from "react-router-dom";

const Activities = () => {
    const [progression, setProgression] = useState(0)

    const menuState = MenuStatus()
    const history = useHistory();

    const activities = useFirestore("Activities")    

    const activityLink = (e) => {

        const id = e.target.dataset.id

        history.push(`/${client}/ActivityDetail/${id}`)

    }

    const guideLink = () => {
        history.push(`/${client}/AddActivity`)
    }

    const displayContent = () => {

        setTimeout(() => {
            return activities.length > 0 ? 'none' : 'flex'
        }, 1000)
    }

    return (
        <div className="main">
        <LeftSideBar />
        <LeftSideBarFullScreen/>
        <div className="main-container" style={{display: menuState}}>
            <div className='page-header'>
                <h1>Activiteiten</h1>
                <div className='edit-icon-header-container'>
                    <NavLink activeClassName='active' to={`/${client}/AddActivity`}>
                        <img src={penIcon} alt="" />
                    </NavLink>
                </div>
            </div>
            <div className='card-container'>
                {activities && activities.map(activity => (
                    <div className="goal-list card" key={activity.ID}>
                        <img className="goal-card-banner" src={activity.Banner} alt="" />
                        <div className="goalcard-body-div">
                            <h2>{activity.Activity}</h2>
                        </div>
                        <div className="button-container">
                            <button className="goal-card-button" data-id={activity.ID} onClick={activityLink} >Bekijk</button>
                        </div>
                    </div>
                ))}
            </div>
            <div className='empty-page-container' style={{display: displayContent()}}>
                <h2>Je hebt nog geen activiteit(en) toegevoegd.</h2>
                <div className='button-container-margin-top'>
                    <button onClick={guideLink}>Toevoegen</button>
                </div>
            </div>
        </div>
    </div>
    )
}

export default Activities
