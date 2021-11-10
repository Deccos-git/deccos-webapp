import { useFirestoreMessages, useFirestore, useFirestoreID } from "../firebase/useFirestore"
import LeftSideBar from "./LeftSideBar"
import LeftSideBarFullScreen from "./LeftSideBarFullScreen"
import RightSideBar from "./rightSideBar/RightSideBar"
import ReactionBar from "./ReactionBar"
import LikeBar from "./LikeBar"
import { db, timestamp } from "../firebase/config"
import { useHistory } from "react-router-dom"
import heartIcon from '../images/icons/heart-icon.png'
import { client } from "../hooks/Client"
import ArrowLeftIcon from '../images/icons/arrow-left-icon.png'
import Location from "../hooks/Location"
import MenuStatus from "../hooks/MenuStatus";
import Reaction from "./Reaction"
import worldIcon from '../images/icons/world-icon.png'
import { useState, useContext, useEffect } from "react"
import { Auth } from '../StateManagment/Auth';
import GetYearMonth from '../hooks/GetYearMonth'
import uuid from 'react-uuid';
import firebase from "firebase"

const MessageDetail = () => {
    const [authO] = useContext(Auth)

    const route = Location()[3]
    const [goalLikeDiplay, setGoalLikeDiplay] = useState('none')
    const [communityName, setCommunityName] = useState('')
    const [logo, setLogo] = useState('')
    const [impacteer, setImpacteer] = useState('none')

    const messages = useFirestoreID("Messages", route)
    const compagny = useFirestore("CompagnyMeta")
    const impacteers = useFirestore('Impacteers')
    const admins = useFirestore('Admins')

    const history = useHistory()
    const menuState = MenuStatus()
    const getYearMonth = GetYearMonth()
    const id = uuid()

    useEffect(() => {
        impacteers && impacteers.forEach(impacteer => {
            if(impacteer.UserID === authO.ID){
                setImpacteer('flex')
            }
        })
    }, [impacteers])

    useEffect(() => {
        admins && admins.forEach(admin => {
            if(admin.UserID === authO.ID){
                setImpacteer('flex')
            }
        })
    }, [admins])


    useEffect(() => {
        compagny && compagny.forEach(comp => {
            const communityName = comp.CommunityName 
            const logo = comp.Logo 
 
            setCommunityName(communityName)
            setLogo(logo)
 
        })
     }, [compagny])

    let parentID = ""

    messages && messages.forEach(message => {

        parentID = message.ID
        
    })

    let numberOfContributions = ""
    let numberOfContributionsReaction = ""

    messages && messages.forEach(message => {

        if(message.Contributions != undefined){
            if(message.Contributions.length === 0){
                numberOfContributions = 0
            } else {
                numberOfContributions = message.Contributions.length
            }
        }
    })

    const reactions = useFirestoreMessages("Messages", parentID )

    reactions && reactions.forEach(reaction => {
        if(reaction.Contributions != undefined){
            if(reaction.Contributions.length === 0){
                numberOfContributionsReaction = 0
            } else {
                numberOfContributionsReaction = reaction.Contributions.length
            }
        }
    })

    let numberOfReactions = ""

    reactions && reactions.forEach(reaction => {

        if(reaction.Thread.length === 0){
            numberOfReactions = `Bekijk 0 reacties`
        } else if (reaction.Thread.length === 1){
            numberOfReactions = `Bekijk ${reaction.Thread.length} reactie`
        } else {
            numberOfReactions = `Bekijk ${reaction.Thread.length} reacties`
        }

    })

    const updateRoute = () => {

        reactions && reactions.forEach(reaction => {
            history.push(`/${client}/MessageDetail/${reaction.ID}`)
        })
    }

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };


    const showContributions = (e) => {

        const id = e.target.dataset.id

        history.push(`/${client}/Contributions/${id}`)
    }

    const previousMessage = () => {

        messages && messages.forEach(message => {

            console.log(message.ID)

            db.collection("Messages")
            .where("ID", "==", message.ID)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {

                    const prevPath = doc.data().PrevPath
            
                    history.push(`${prevPath}`)

                })
            })
        })
    }

    const profileLink = (e) => {
        const id = e.target.dataset.id

        history.push(`/${client}/PublicProfile/${id}`)
    }

    const toggleGoalLikeBar = () => {
        if(goalLikeDiplay === 'none'){
            setGoalLikeDiplay('flex')
        } else if (goalLikeDiplay === 'flex'){
            setGoalLikeDiplay('none')
        }
    }

    const likeHandler = (e) => {

        const userID = e.target.dataset.userid
        const userDocID = e.target.dataset.userdocid
        const userName = e.target.dataset.username
        const userPhoto = e.target.dataset.userphoto
        const messageID = e.target.dataset.messageid
        const messageDocid = e.target.dataset.messagedocid
        const message = e.target.dataset.message
        const userEmail = e.target.dataset.useremail
    
        db.collection("Likes")
        .doc()
        .set({
            Timestamp: timestamp,
            SenderID: authO.ID,
            SenderName: authO.UserName,
            SenderPhoto: authO.Photo,
            RecieverID: userID,
            RecieverName: userName,
            RecieverPhoto: userPhoto,
            MessageID: messageID,
            MessageBody: message,
            Read: false,
            ID: id,
            Compagny: client,
        })
        .then(() => {
            db.collection("Notifications")
            .doc()
            .set({
                Timestamp: timestamp,
                SenderID: authO.ID,
                SenderName: authO.UserName,
                SenderPhoto: authO.Photo,
                RecieverID: userID,
                MessageID: messageID,
                MessageBody: message,
                Read: false,
                ID: id,
                Header:`${authO.UserName} vindt jouw bericht`,
                SubHeader:`leuk`,
                Compagny: client,
                Type: "Like"
            })
        })
        .then(() => {
            db.collection("Messages")
            .doc(messageDocid)
            .update({
                    Likes: firebase.firestore.FieldValue.increment(1)
                })
            })
        .then(() => {
            db.collection("Users")
            .doc(userDocID)
            .update({
                    Likes: firebase.firestore.FieldValue.increment(1)
                })
            })
            .then(() => {

                console.log(client, getYearMonth, userID)
                
                db.collection("LikeGraph")
                .where("Compagny", "==", client)
                .where("Month", "==", getYearMonth)
                .where('UserID', '==', userID )
                .get()
                .then(querySnapshot => {
                    if(querySnapshot.empty === false){
                        querySnapshot.forEach(doc => {

                            console.log("bestaat")

                            db.collection("LikeGraph")
                            .doc(doc.id)
                            .update({
                                Contributions: firebase.firestore.FieldValue.increment(1)
                            })
                        })
                    } else if (querySnapshot.empty === true){
                        console.log("bestaat niet")
                        db.collection("LikeGraph")
                        .doc()
                        .set({
                            Month: getYearMonth,
                            Contributions: 1,
                            Compagny: client,
                            LastActive: timestamp,
                            ID: uuid(),
                            UserName: userName,
                            UserID: userID
                        })
                    } 
                })
            })
            .then (() => {
                sendAsMail(userID, userEmail, userName)
            })
        
    }

    const sendAsMail = (userID, userEmail, userName) => {

        db.collection("Email").doc().set({
            to: [userEmail],
            cc: "info@Deccos.nl",
            message: {
            subject: `Je hebt een nieuwe like ontvangen in ${communityName}.`,
            html: `Hallo ${userName}, </br></br>

                Je hebt een nieuwe like ontvangen in ${communityName}.</br></br>

                Bekijk de like <a href="https://www.deccos.co/${client}/Likes/${userID}"><u>hier</u></a>.<br><br>
                
                Vriendelijke groet, </br></br>
                ${communityName} </br></br>
                <img src="${logo}" width="100px">`,
            Gebruikersnaam: `${userName}`,
            Emailadres: userEmail,
            Type: "Contribution"
              }     
          }); 
    }

    return (
        <div className="main">
             <LeftSideBar />
             <LeftSideBarFullScreen/>
             <div className="card-overview" style={{display: menuState}}>
                <div className="previous-message-container" onClick={previousMessage}>
                    <img src={ArrowLeftIcon} alt="" />
                    <p>Vorige bericht</p>
                 </div>
                {messages && messages.map(message => (
                    <div className="message-card" key={message.ID}>
                        <div className="auth-message-container">
                            <img src={message.UserPhoto} alt="" data-id={message.UserID} onClick={profileLink} />
                            <p className="auth-name" data-id={message.UserID} onClick={profileLink}>{message.User}</p>
                            <p className="message-card-timestamp">{message.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                        </div>
                        <div className="massage" dangerouslySetInnerHTML={{__html:message.Message}}></div>
                        <div className='like-container'>
                            <div className='like-icon-container'>
                                <div className='like-icon-inner-container' onClick={toggleGoalLikeBar} style={{display: impacteer}}>
                                    <img src={worldIcon} alt="" />
                                    <p className='notification-counter-small'>{message.Contributions.length}</p>
                                </div>
                                <div className='like-icon-inner-container'>
                                    <img 
                                    src={heartIcon} 
                                    alt="" 
                                    data-message={message.Message}
                                    data-messageid={message.ID}
                                    data-messagedocid={message.docid}
                                    data-username={message.User}
                                    data-userphoto={message.UserPhoto}
                                    data-userid={message.UserID}
                                    data-useremail ={message.Email}
                                    data-userdocid={message.UserDocID}
                                    onClick={likeHandler}/>
                                    <p className='notification-counter-small'>{message.Likes}</p>
                                </div>
                            </div>
                            <div style={{display: goalLikeDiplay}}>
                                < LikeBar message={message} />
                            </div>
                        </div>
                        < ReactionBar message={message} />
                    </div>
                ))}

                <div>
                    <p>----- Reacties -----</p>
                </div>
                <div className="reaction-area">
                {reactions && reactions.map(reaction => ( 
                   <Reaction message={reaction}/>
                ))}
            </div>
            </div>
             <RightSideBar />
        </div>
    )
}

export default MessageDetail
