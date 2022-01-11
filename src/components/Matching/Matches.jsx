import {useFirestoreTimestamp, useFirestore, useFirestoreID, useFirestoreMatches} from "../../firebase/useFirestore"
import LeftSideBar from "../LeftSideBar"
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import RightSideBar from "../rightSideBar/RightSideBar";
import MenuStatus from "../../hooks/MenuStatus";
import { client } from '../../hooks/Client';
import { useHistory } from "react-router-dom";
import { useEffect, useState } from 'react'
import { db, timestamp } from "../../firebase/config.js"
import uuid from 'react-uuid';

const Matches = () => {

    const [matchesOverview, setMatchesOverview] = useState('')

    const menuState = MenuStatus()
    const history = useHistory()

    const tags = useFirestore('MatchTags')

    const displayMatches = async () => {

        const matchArray = []

       await db.collection('Matches')
            .where("Compagny", "==", client)
            .orderBy("Timestamp", "desc")
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach( async doc => {

                const match = doc.data().Match

                const matchDuo = []
        
                await match.forEach(async id => {
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
                                ID: id
                            }

                            matchDuo.push(matchObject)

                        })
                    }) 
                })

                // Te vroeg

                matchArray.push(matchDuo)

            })

        })

        return matchArray
    }


    useEffect(() => {
        displayMatches().then( match => {

            if(match.length != 0){
                setMatchesOverview(match)
            }
            
        })
    }, [])

    console.log(matchesOverview)

    const matchDetailLink = (e) => {

        const id = e.target.dataset.id

        history.push(`/${client}/MatchDetail/${id}`)

    }
   

    return (
        <div className="main">
            <LeftSideBar />
            <LeftSideBarFullScreen/>
            <div className="card-overview goal-detail-container" style={{display: menuState}}>
                <div className="page-header">
                    <h1>Matches</h1>
                </div>
                <div className="card-container">
                    {matchesOverview && matchesOverview.map(matches => (
                        <div className="goal-list card" key={uuid()}>
                            {matches.map(match => (
                            <div className='matches-inner-container'>
                               <img className="match-card-banner" src={match.Banner} alt="" />
                               <div className="goalcard-body-div">
                                   <h2>{match.Title}</h2>
                               </div>
                           </div>
                            ))}
                            <div className="button-container">
                                <button className="goal-card-button" data-id={matches.ID} onClick={matchDetailLink} >Bekijk</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <RightSideBar />
        </div>
    )
}

export default Matches
