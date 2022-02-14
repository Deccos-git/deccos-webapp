import LeftSideBar from "../LeftSideBar"
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import RightSideBar from "../rightSideBar/RightSideBar"
import { client } from '../../hooks/Client';
import { useFirestoreTimestamp } from "../../firebase/useFirestore";
import { useHistory } from "react-router-dom"
import { motion } from "framer-motion"
import { useState } from 'react';
import { db, timestamp } from '../../firebase/config';
import MenuStatus from "../../hooks/MenuStatus";
import firebase from 'firebase';

import Calendar from "../Calender";

const Events = () => {
    const [listViewTab, setListViewTab] = useState('active-tab')
    const [calenderViewTab, setCalenderViewTab] = useState('not-active-tab')
    const [listDisplay, setListDisplay] = useState('flex')
    const [calenderDisplay, setCalenderDisplay] = useState('none')

    const [memberStatus, setMemberStatus] = useState('Abonneren')

    const events = useFirestoreTimestamp("Events")

    const menuState = MenuStatus()
    const history = useHistory()

    const detailRouter = (e) => {

        const id = e.target.dataset.id 
        const docid = e.target.dataset.docid

        db.collection("Events")
        .doc(docid)
        .update({
            Clicks: firebase.firestore.FieldValue.arrayUnion(timestamp)
        })
        .then(() => {
            history.push(`/${client}/EventDetail/${id}`)
        })

    }

    const profileLink = (e) => {
        const id = e.target.dataset.id

        history.push(`/${client}/PublicProfile/${id}`)
    }

    const showListView = () => {
        setListDisplay('flex')
        setCalenderDisplay('none')
        setListViewTab('active-tab')
        setCalenderViewTab('not-active-tab')
    }

    const showCalenderView = () => {
        setListDisplay('none')
        setCalenderDisplay('flex')
        setListViewTab('not-active-tab')
        setCalenderViewTab('active-tab')
    }

    const CalenderView = () => {
        return (

            <div className="card-container" style={{display: calenderDisplay}}>
                <Calendar events={events}/>
            </div>

        )
    }

    return (
        <div className="main">
            <LeftSideBar />
            <LeftSideBarFullScreen/>
            <div className="main-container" style={{display: menuState}}>
                <div className="page-header">
                    <h1>Events</h1>
                    <div className='group-navigation-container'>
                        <p className={listViewTab} onClick={showListView}>Lijst</p>
                        <p className={calenderViewTab} onClick={showCalenderView}>Kalender</p>
                    </div>
                </div>
                <div className="card-container" style={{display: listDisplay}}>
                    {events && events.map(even => (
                        <div className="card">
                            <img className="card-banner" src={even.Banner} alt="" />
                            <div className="list-inner-container">
                                <div className="article-card-user-container">
                                    <img src={even.UserPhoto} alt="" data-id={even.UserID} onClick={profileLink} />
                                    <p data-id={even.UserID} onClick={profileLink}>{even.User}</p>
                                </div>
                                <h2>{even.Title}</h2>
                                <p>{even.Date}</p>
                            </div>
                            <div className="button-container">
                                <button onClick={detailRouter} data-docid={even.docid} data-id={even.ID}>Bekijk</button>
                            </div>
                        </div>
                    ))}
                 </div>
                 <CalenderView/>
            </div>
            <RightSideBar />
        </div>
    )
}

export default Events