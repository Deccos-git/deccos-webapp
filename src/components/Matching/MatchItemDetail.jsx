import { useFirestoreID, useFirestoreMessages, useFirestore } from "../../firebase/useFirestore"
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

const MatchItemDetail = () => {

    const route = Location()[3]
    const menuState = MenuStatus()
    const history = useHistory()
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    const messages  = useFirestoreMessages("Messages", route )
    const matchItems = useFirestoreID('MatchItems', route)
    const allItems = useFirestore('MatchItems')
    const tags = useFirestore('MatchTags')

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

    // Display matches

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

            matchArray.push(itemObject)

        }
    })

    const itemLink = (e) => {
        const id = e.target.dataset.id

        history.push(`/${client}/MatchItemDetail/${id}`)
    }
    

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
                            <div>
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
                            <div id='matches-container'>
                                <h3>Mogelijke matches</h3>
                                {matchArray && matchArray.map(match => (
                                    <div className='match-detail-container'>
                                        <img src={match.Banner} alt="" data-id={match.ID} onClick={itemLink} />
                                        <p id='match-detail-item-title' data-id={match.ID} onClick={itemLink}>{match.Title}</p>
                                        <p>{match.Matches.length} matches</p>
                                        {match.Matches.map(m => (
                                            <p>{m}</p>
                                        ))}
                                        <button className='button-simple'>Creeer match</button>
                                        
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
