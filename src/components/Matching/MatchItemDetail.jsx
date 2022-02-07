import { useFirestoreID, useFirestoreMessages, useFirestore, useFirestoreMatches, useFirestoreMatchTagsType } from "../../firebase/useFirestore"
import { motion } from "framer-motion"
import MessageBar from "../Community/MessageBar"
import LeftSideBar from "../LeftSideBar"
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import RightSideBar from "../rightSideBar/RightSideBar"
import { useHistory } from "react-router-dom"
import { client } from "../../hooks/Client"
import { useContext, useState, useEffect } from 'react';
import { Auth } from '../../StateManagment/Auth';
import Location from "../../hooks/Location"
import Reaction from "../Community/Reaction"
import MenuStatus from "../../hooks/MenuStatus";
import { db, timestamp } from "../../firebase/config"
import uuid from "react-uuid"

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
    const mainTags = useFirestoreMatchTagsType('Main')

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
            ID: item.ID,
            Fields: item.ProfileFields,
            Tags: item.Tags
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
                ID: item.ID,
                Tags: item.Tags
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
        const matches = e.target.dataset.matches

        db.collection('Matches')
        .doc()
        .set({
            ID: uuid(),
            Compagny: client,
            Timestamp: timestamp,
            Matches: matches,
            Status: 'Active',
            Rating: 0,
            Match: [
                matchID,
                route
                ],
        })

    }

    // Display matches

    const matchedItems = async (id) => {

        const matchArray = []

        await db.collection('MatchItems')
        .where('ID', '==', id)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const title = doc.data().Title
                const banner = doc.data().Banner
                const timestamp = doc.data().Timestamp
                const id = doc.data().ID
                const tags = doc.data().Tags

                const matchObject = {
                    Title: title,
                    Banner: banner,
                    Timestamp: timestamp,
                    ID: id,
                    Tags: tags
                }

                matchArray.push(matchObject)

            })
        })

        return matchArray
    }

    const displayMatches = async () => {

        let items = {}

        for(const match of matches){

            for(const id of match.Match){
                if(id !== route){
                    items.Match = await matchedItems(id) 

                    items.ID = match.ID
                    items.Status = match.Status
                    items.Rating = match.Rating
                    items.Tags = match.Tags
                }
            }
        }

        return items

    }

    useEffect(() => {
        displayMatches().then( match => {

                setMatchesOverview(match)
            
        })
    }, [matches])


    const matchLink = (e) => {
        const id = e.target.dataset.id

        history.push(`/${client}/MatchDetail/${id}`)
    }

    const Status = ({status}) => {

        if(status === 'Active'){
            return <div id="status-active" className='match-detail-status-image'></div>
        } else if(status === 'Inactive'){
            return <div id="status-inactive" className='match-detail-status-image'></div>
        } else if(status === 'Deleted'){
            return <div id="status-deleted" className='match-detail-status-image'></div>
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
      
      const typeColor = (item) => {

        let color = ''

        console.log(item)

        mainTags && mainTags.forEach(tag => {
            const tagMain = tag.Tag

            if(item.Tags.includes(tagMain)){
                color = tag.Color
            }
        })

        return color

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
                            <img className="match-item-detail-banner" src={item.Banner} alt="" style={{border: `3px solid ${typeColor(item)}`}} />
                            <div id='profile-fields-container'>
                                <h3>Over mij</h3>
                                {item.Fields.map(field => (
                                    <div className='profile-field-inner-container'>
                                        <p id='title-field'>{field.Title}</p>
                                        <p>{field.Input}</p>
                                    </div>
                                ))}

                            </div>
                            <div id='tags-container'>
                                <h3>Tags</h3>
                                {item.Categories.map(tags => (
                                    <div id="match-item-detail-categorie-tag-container">
                                    {tags && tags.map(tag => (
                                        <div id="match-item-detail-inner-categorie-tag-container">
                                            <h5>{tag[0]}</h5>
                                            <p>{tag[1]}</p>
                                        </div>             
                                    ))}
                                    </div>    
                                ))}
                            </div>
                            <div className='matches-container'>
                                <h3>Mogelijke matches</h3>
                                {matchArray && matchArray.map(match => (
                                    <div className='match-detail-container'>
                                        <img src={match.Banner} alt="" data-id={match.ID} onClick={itemLink} style={{border: `3px solid ${typeColor(match)}`}}/>
                                        <p id='match-detail-item-title' data-id={match.ID} onClick={itemLink}>{match.Title}</p>
                                        <p>{match.Matches.length} {resemblance(match.Matches.length)}</p>
                                        {match.Matches.map(m => (
                                            <p><i>{m}</i></p>
                                        ))}
                                        <button className='button-simple' data-matches={match.Matches} data-id={match.ID} onClick={createMatch}>Creeer match</button>
                                        
                                    </div>
                                ))}
                            </div>
                            <div className='matches-container'>
                                <h3>Matches</h3>
                                {matchesOverview.Match && matchesOverview.Match.map(match => (
                                    <div className='match-detail-container'>
                                        <img src={match.Banner} alt="" data-id={matchesOverview.ID} onClick={matchLink} style={{border: `3px solid ${typeColor(match)}`}}/>
                                        <p id='match-detail-item-title' data-id={matchesOverview.ID} onClick={matchLink}>{match.Title}</p>
                                        <StarRating rating={matchesOverview.Rating}/> 
                                        <Status status={matchesOverview.Status}/>
                                    </div>
                                ))}

                            </div>
                            <div>
                                <p>Aangemeld op <b>{item.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</b></p>
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
