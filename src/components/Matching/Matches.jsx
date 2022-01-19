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

        const matchesArray = []

        for(const match of matches){

            const matchList = []

            matchList.ID = match.ID
            matchList.Status = match.Status
            matchList.Rating = match.Rating

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

    const matchDetailLink = (e) => {

        const id = e.target.dataset.id

        history.push(`/${client}/MatchDetail/${id}`)

    }

    const Status = ({status}) => {

        if(status === 'Active'){
            return <div id="status-active"></div>
        } else if(status === 'Inactive'){
            return <div id="status-inactive"></div>
        } else if(status === 'Deleted'){
            return <div id="status-deleted"></div>
        } 
    }

    const StarRating = ({rating}) => {

        const quality = rating -1 

        return (
          <div className="star-rating">
            {[...Array(5)].map((star, index) => {
              return (
                <button
                  type="button"
                  id='star-item'
                  key={index}
                  className={index <= (quality) ? "on" : "off"}
                >
                  <span className="star">&#9733;</span>
                </button>
              );
            })}
          </div>
        );
      };
   

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
                             <div id='matches-status-container'>
                                <Status status={matches.Status}/>
                            </div>
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
                            <div id='matches-rating-container'>
                                <StarRating rating={matches.Rating}/>
                            </div>
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
