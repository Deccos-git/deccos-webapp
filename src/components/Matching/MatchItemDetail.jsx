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

const MatchItemDetail = () => {
    const [matchesOverview, setMatchesOverview] = useState('')

    const route = Location()[3]
    const menuState = MenuStatus()
    const history = useHistory()
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    const messages  = useFirestoreMessages("Messages", route )
    const matchItems = useFirestoreID('MatchItems', route)
    const allItems = useFirestore('MatchItems')
    const tags = useFirestore('MatchTags')
    const matches = useFirestoreMatches(route)

    // Display tags and categories

    const ItemArray = []

    matchItems && matchItems.forEach(item => {

        const categorieArray = []

        const tagArray = []

        tags && tags.forEach(tag => {
            const categorie = tag.Categorie

            if(item.Tags.includes(tag.Tag)){

                const tags = [
                    categorie,
                    tag.Tag
                ]

                tagArray.push(tags) 
            }
        })

        categorieArray.push(tagArray)

        const ItemObject = {
            Title: item.Title,
            Banner: item.Banner,
            Timestamp: item.Timestamp,
            Categories: categorieArray,
            ID: item.ID
        }

        ItemArray.push(ItemObject)
    })

    // Display possible matches

    const matchArray = []

    allItems && allItems.forEach(item => {

        if(item.ID !== route){

            const matches = []

            const itemObject = {
                Title: item.Title,
                Banner: item.Banner,
                Timestamp: item.Timestamp,
                Matches: matches,
                ID: item.ID
            }

            // Check for resemblance
            matchItems && matchItems.forEach(matchItem => {

                matchItem.Tags.forEach(matchItemTag => {
                    if(item.Tags.includes(matchItemTag)){
                        matches.push(matchItemTag)
                    }
                })
                
            })

            if(matches.length > 0){
                matchArray.push(itemObject)
            }

        }
    })

    const resemblance = (length) => {
        if(length > 1){
            return 'Overeenkomsten'
        } else {
            return 'Overeenkomst'
        }
    }

    const itemLink = (e) => {
        const id = e.target.dataset.id

        history.push(`/${client}/MatchItemDetail/${id}`)
    }

    const createMatch = (e) => {

        e.target.innerText = 'Match is gecreeerd'
        e.target.style.color = 'gray'

        const matchID = e.target.dataset.id 

        db.collection('Matches')
        .doc()
        .set({
            ID: `${matchID}_${route}`,
            Compagny: client,
            Timestamp: timestamp,
            Match: [
                matchID,
                route
                ],
        })

    }

    // Display matches

    const displayMatches = async () => {

        const matchArray = []

        matches && matches.forEach(match => {
    
            match.Match.forEach(async id => {
                if(id !== route){
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
    
                            matchArray.push(matchObject)
    
                        })
                    })
                }
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
    }, [matches])


    console.log(matchesOverview)
    

    return (
        <div className="main">
            <LeftSideBar />
            <LeftSideBarFullScreen/>
            <div className="card-overview goal-detail-container" style={{display: menuState}}>
                <div className="article-container">
                    {ItemArray && ItemArray.map(item => (
                        <div className="article">
                            <h1>{item.Title}</h1>
                            <img className="match-item-detail-banner" src={item.Banner} alt="" />
                            <div id='tags-container'>
                                <h3>Tags</h3>
                                {item.Categories.map(tags => (
                                    <>
                                    {tags && tags.map(tag => (
                                        <>
                                        <h5>{tag[0]}</h5>
                                        <p>{tag[1]}</p>
                                        </>             
                                    ))}
                                    </>    
                                ))}
                            </div>
                            <div className='matches-container'>
                                <h3>Mogelijke matches</h3>
                                {matchArray && matchArray.map(match => (
                                    <div className='match-detail-container'>
                                        <img src={match.Banner} alt="" data-id={match.ID} onClick={itemLink} />
                                        <p id='match-detail-item-title' data-id={match.ID} onClick={itemLink}>{match.Title}</p>
                                        <p>{match.Matches.length} {resemblance(match.Matches.length)}</p>
                                        {match.Matches.map(m => (
                                            <p><i>{m}</i></p>
                                        ))}
                                        <button className='button-simple' data-id={match.ID} onClick={createMatch}>Creeer match</button>
                                        
                                    </div>
                                ))}
                            </div>
                            <div className='matches-container'>
                                <h3>Matches</h3>
                                {matchesOverview && matchesOverview.map(match => (
                                    <div className='match-detail-container'>
                                        <img src={match.Banner} alt="" data-id={match.ID} onClick={itemLink} />
                                        <p id='match-detail-item-title' data-id={match.ID} onClick={itemLink}>{match.Title}</p>
                                    </div>
                                ))}

                            </div>
                            <div className="article-meta-container">
                                <p id='event-detail-timestamp'>{item.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
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

export default MatchItemDetail
