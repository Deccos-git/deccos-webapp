import { useFirestoreID, useFirestoreMessages, useFirestore, useFirestoreMatches } from "../../firebase/useFirestore"
import { motion } from "framer-motion"
import MessageBar from "../MessageBar"
import LeftSideBar from "../LeftSideBar"
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import RightSideBar from "../rightSideBar/RightSideBar"
import { useHistory } from "react-router-dom"
import { client } from "../../hooks/Client"
import { useContext, useState, useEffect } from 'react';
import { Auth } from '../../StateManagment/Auth';
import Location from "../../hooks/Location"
import Reaction from "../Reaction"
import MenuStatus from "../../hooks/MenuStatus";
import { db, timestamp } from "../../firebase/config"

const MatchDetail = () => {

    const route = Location()[3]
    const menuState = MenuStatus()
    const messages  = useFirestoreMessages("Messages", route )

    return (
        <div className="main">
            <LeftSideBar />
            <LeftSideBarFullScreen/>
            <div className="card-overview goal-detail-container" style={{display: menuState}}>
            
                <div className="article-container">
                    
                    <h2>Berichten</h2>
                    <MessageBar/>
                    <div className="reaction-area">
                    {messages && messages.map(message => ( 
                    <Reaction message={message}/>
                    ))}
                    </div>
                </div>    
            </div>
            <RightSideBar />
        </div>
    )
}

export default MatchDetail
