import { useFirestoreID, useFirestoreMessages, useFirestoreMatchRoadmaps, useFirestoreMatchTagsType } from "../../firebase/useFirestore"
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
import completeIcon from '../../images/icons/complete-icon.png'
import userIcon from '../../images/icons/user-icon.png'
import deleteTaskIcon from '../../images/icons/delete-task-icon.png'

const MatchDetail = () => {
    const [authO] = useContext(Auth)

    const [matchesOverview, setMatchesOverview] = useState('')
    const [docid, setDocid] = useState('')
    const [status, setStatus] = useState('')
    const [rating, setRating] = useState(0);

    const route = Location()[3]
    const menuState = MenuStatus()
    const history = useHistory()

    const messages  = useFirestoreMessages("Messages", route )
    const matches = useFirestoreID("Matches", route)
    const matchRoadmaps = useFirestoreMatchRoadmaps()
    const mainTags = useFirestoreMatchTagsType('Main')

    // Set default rating in state

    useEffect(() => {
        matches && matches.forEach(match => {
            const rating = match.Rating

            setRating(rating)
        })
    }, [matches])

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
                    const tags = doc.data().Tags

                    const matchObject = {
                        Title: title,
                        Banner: banner,
                        Timestamp: timestamp,
                        ID: id,
                        Tags: tags
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
            matchList.Matches = match.Matches

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

    const matchResemblance = (matches) => {

        const matchesArray = matches.split(',')

        return matchesArray
    }

    const matchItemDetailLink = (e) => {
        const id = e.target.dataset.id

        history.push(`/${client}/MatchItemDetail/${id}`)
    }

    const StarRating = () => {
        const [hover, setHover] = useState(0);

        console.log(rating, hover)

        return (
          <div className="star-rating">
            {[...Array(5)].map((star, index) => {
              index += 1;
              return (
                <button
                  type="button"
                  id='star-item'
                  key={index}
                  className={index <= (hover || rating) ? "on" : "off"}
                  onClick={() => saveRating(index) }
                  onMouseEnter={() => setHover(index)}
                  onMouseLeave={() => setHover(rating)}
                >
                  <span className="star">&#9733;</span>
                </button>
              );
            })}
          </div>
        );
      };

      const saveRating = (index) => {
          db.collection('Matches')
          .doc(docid)
          .update({
              Rating: index
          })
      }

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

    const taskCompleted = (e) => {
        const docid = e.target.dataset.docid 
        const completed = e.target.dataset.completed

        if(completed === 'false'){
            db.collection('MatchRoadmaps')
            .doc(docid)
            .update({
                Completed: true,
                BackgroundColor: '#b2d7bb',
                Icon: deleteTaskIcon,
                User: authO.UserName,
                UserPhoto: authO.Photo,
                UserID: authO.ID,
            })
        } else if (completed === 'true'){
            db.collection('MatchRoadmaps')
            .doc(docid)
            .update({
                Completed: false,
                BackgroundColor: 'white',
                Icon: completeIcon,
                User: authO.UserName,
                UserPhoto: authO.Photo,
                UserID: authO.ID,
            })
        }  
    }

    const stepUserLink = (e) => {
        const id = e.target.dataset.id 

        history.push(`/${client}/PublicProfile/${id}`)
    }

    const showStepUserPhoto = (step) => {
        if(step.Completed === false){
            return 'hidden'
        }
    }

    return (
        <div className="main">
            <LeftSideBar />
            <LeftSideBarFullScreen/>
            <div className="card-overview goal-detail-container" style={{display: menuState}}>
                <div className="article-container">
                    {matchesOverview && matchesOverview.map(matches => (
                        <div id='match-detail-outer-container' className='article'>
                            <div id='match-detail-container'>
                                {matches.map(match => (
                                <>
                                    {match.map(item => (
                                        <div id='match-item-detail-container'>
                                            <div id='match-detail-banner-container'>
                                                <img src={item.Banner} alt="" data-id={item.ID} onClick={matchItemDetailLink} style={{border: `3px solid ${typeColor(item)}`}}/>
                                                <h3 data-id={item.ID} onClick={matchItemDetailLink}>{item.Title}</h3>
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
                            <div id='matches-container'>
                                <h3>Overeenkomsten</h3>
                                <div id='match-detail-resemblance-container'>
                                    {matchResemblance(matches.Matches) && matchResemblance(matches.Matches).map(match => (
                                        <div id='match-item-detail-inner-categorie-tag-container'>
                                            <p>{match}</p>
                                        </div>
                                    ))}
                                 </div>
                            </div>
                            <div id='step-outer-container'>
                                <h3>Stappenplan</h3>
                                {matchRoadmaps && matchRoadmaps.map(step => (
                                    <div id='step-container'>
                                        <p id='step-position-roadmap'>{step.Position}</p>
                                        <div id='step-inner-container' style={{backgroundColor: step.BackgroundColor}}>
                                            <img src={step.Icon} id='check-icon-roadmap' data-docid={step.docid} data-completed={step.Completed} onClick={taskCompleted}/>
                                            <p id='step-title-roadmap'>{step.Title}</p>
                                        </div>
                                        <div id='step-user-container' style={{visibility: showStepUserPhoto(step)}}>
                                            <img src={step.UserPhoto} data-id={step.UserID} alt="" onClick={stepUserLink} />
                                        </div>
                                    </div>
                                ))}
                            </div>  
                            <div id='quality-container'>
                                <h3>Kwaliteit</h3>
                                <StarRating/>      
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
