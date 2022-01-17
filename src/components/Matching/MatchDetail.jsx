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
    const [matchesOverview, setMatchesOverview] = useState('')
    const [docid, setDocid] = useState('')
    const [status, setStatus] = useState('')

    const route = Location()[3]
    const menuState = MenuStatus()
    const messages  = useFirestoreMessages("Messages", route )
    const matches = useFirestoreID("Matches", route)

    // set docid of match in state

    useEffect(() => {
        matches && matches.forEach(match => {
            const docid = match.docid 

            setDocid(docid)
        })
    }, [matches])

    //Set status of match in state

    useEffect(() => {
        matches && matches.forEach(match => {
            const status = match.Status

            setStatus(status)
        })
    }, [matches])

    // Find match items

    const items = async (id) => {

        const matchDuo = []

        await db.collection('MatchItems')
            .where('ID', '==', id)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    const title = doc.data().Title
                    const banner = doc.data().Banner
                    const timestamp = doc.data().Timestamp
                    const id = doc.data().ID

                    const matchObject = {
                        Title: title,
                        Banner: banner,
                        Timestamp: timestamp,
                        ID: id,
                    }

                    matchDuo.push(matchObject)

                })
            })

            return matchDuo
    }

    const matchArray = async () => {

        const matchesArray = []

        for(const match of matches){

            const matchList = []

            matchList.ID = match.ID

            for(const id of match.Match){

                const itemList = await items(id)

                matchList.push(itemList)

            }

            matchesArray.push(matchList)
        }

        return matchesArray
    }

    useEffect(() => {
        matchArray().then(match => {
            setMatchesOverview(match)
        })
    }, [matches])

    const statusHandler = (e) => {

        const status = e.target.options[e.target.selectedIndex].value 

        console.log(status)

        saveStatus(status)
    }

    const saveStatus = (status) => {

        db.collection('Matches')
        .doc(docid)
        .update({
            Status: status
        })
    }

    const Status = () => {

        if(status === 'Active'){
            return <div id="status-active"></div>
        } else if(status === 'Inactive'){
            return <div id="status-inactive"></div>
        } else if(status === 'Deleted'){
            return <div id="status-deleted"></div>
        } 
    }


    return (
        <div className="main">
            <LeftSideBar />
            <LeftSideBarFullScreen/>
            <div className="card-overview goal-detail-container" style={{display: menuState}}>
                <div className="article-container">
                    {matchesOverview && matchesOverview.map(matches => (
                        <div id='match-detail-outer-container'>
                            <div id='match-detail-container'>
                                {matches.map(match => (
                                <>
                                    {match.map(item => (
                                        <div id='match-item-detail-container'>
                                            <div id='match-detail-banner-container'>
                                                <img src={item.Banner} alt="" />
                                                <h3>{item.Title}</h3>
                                            </div>
                                        </div>
                                    ))}
                                </>
                                ))}
                            </div>
                            <div id='status-container'>
                                <div id='status-display-container'>
                                    <h3>Status</h3>
                                    <Status/>
                                </div>
                                <select name="" id="" onChange={statusHandler}>
                                    <option value="Active">Actief</option>
                                    <option value="Inactive">Inactief</option>
                                    <option value="Deleted">Verwijderd</option>
                                </select>
                            </div>            
                        </div>
                    ))}
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
