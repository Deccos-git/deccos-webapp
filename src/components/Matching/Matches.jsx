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
    const matches = useFirestore('Matches')

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

        const matchesArray = {
            Matches: []
        }

        for(const match of matches){

            matchesArray.ID = match.ID

            const matchList = []

            for(const id of match.Match){


                const itemList = await items(id)

                matchList.push(itemList)

            }

            matchesArray.Matches.push(matchList)
        }

        return matchesArray
    }

    useEffect(() => {
        matchArray().then(match => {
            setMatchesOverview(match)
        })
    }, [matches])

    const matchDetailLink = (e) => {

        const id = e.target.dataset.id

        history.push(`/${client}/MatchDetail/${id}`)

    }

    console.log(matchesOverview.ID)
   

    return (
        <div className="main">
            <LeftSideBar />
            <LeftSideBarFullScreen/>
            <div className="card-overview goal-detail-container" style={{display: menuState}}>
                <div className="page-header">
                    <h1>Matches</h1>
                </div>
                <div className="card-container">
                    {matchesOverview && matchesOverview.Matches.map(matches => (
                        <div className="goal-list card" key={uuid()}>
                            {matches.map(match => (
                                <>
                                {match.map(item => (
                                    <div className='matches-inner-container'>
                                        <img className="match-card-banner" src={item.Banner} alt="" />
                                        <div className="goalcard-body-div">
                                            <h2>{item.Title}</h2>
                                        </div>
                                    </div>
                                ))}
                                </>
                            ))}
                            <div className="button-container">
                                <button className="goal-card-button" data-id={matchesOverview.ID} onClick={matchDetailLink} >Bekijk</button>
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
