import LikeBar from "./LikeBar"
import ReactionBar from "./ReactionBar"
import { useHistory } from "react-router-dom"
import { client } from "../../hooks/Client"
import deleteIcon from '../../images/icons/delete-icon.png'
import settingsIcon from '../../images/icons/settings-icon.png'
import heartIcon from '../../images/icons/heart-icon.png'
import { useState, useContext, useEffect } from "react"
import { Auth } from '../../StateManagment/Auth';
import { db, timestamp } from "../../firebase/config"
import { useFirestore } from "../../firebase/useFirestore"
import firebase from "firebase"
import GetYearMonth from '../../hooks/GetYearMonth'
import uuid from 'react-uuid';

const Reaction = ({message}) => {
    const [authO] = useContext(Auth)
    const [showOptions, setShowOptions] = useState('none')
    const [goalLikeDiplay, setGoalLikeDiplay] = useState('none')
    const [communityName, setCommunityName] = useState('')
    const [logo, setLogo] = useState('')
    const [impacteer, setImpacteer] = useState('none')

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const history = useHistory()
    const getYearMonth = GetYearMonth()
    const id = uuid()

    const compagny = useFirestore("CompagnyMeta")
    const impacteers = useFirestore('Impacteers')
    const admins = useFirestore('Admins')

    useEffect(() => {
        compagny && compagny.forEach(comp => {
            const communityName = comp.CommunityName 
            const logo = comp.Logo 
 
            setCommunityName(communityName)
            setLogo(logo)
 
        })
     }, [compagny])

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

    let numberOfReactions = ""

        if(message.Thread.length === 0){
            numberOfReactions = `Bekijk 0 reacties`
        } else if (message.Thread.length === 1){
            numberOfReactions = `Bekijk ${message.Thread.length} reactie`
        } else {
            numberOfReactions = `Bekijk ${message.Thread.length} reacties`
        }

    const updateRoute = () => {

        history.push(`/${client}/MessageDetail/${message.ID}`)
        
    }

    const profileLink = (e) => {
        const id = e.target.dataset.id

        history.push(`/${client}/PublicProfile/${id}`)
    }

    const linkInText = (message) => {
    
        const urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
        const links = message.Message.match(urlRegex)
    
        if(links != null){
    
            const newText = message.Message.replace(links[0], `<a href="${links}", target="_blank">${links}</a>`)
    
            return newText
    
        } else {
    
            return message.Message
        }
    
    }

    const toggleOptions = () => {
        if(showOptions === "none"){
            setShowOptions("flex")
        } else if(showOptions === "flex"){
            setShowOptions("none")
        }
    }

    const optionsClass = (message) => {
        if(message.User === authO.UserName){
            return "reaction-options-container"
        } else if (message.User != authO.UserName)  {
            return "hide-message-options"
        }
    }

    const deleteMessage = (e) => {
        const id = e.target.dataset.id 

        db.collection('Messages')
        .doc(id)
        .delete()
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
                sendAsMail(userID)
            })
        
    }

    const sendAsMail = (userID) => {

        db.collection("Email").doc().set({
            to: [message.Email],
            cc: "info@Deccos.nl",
            message: {
            subject: `Je hebt een nieuwe like ontvangen in ${communityName}.`,
            html: `Hallo ${message.User}, </br></br>

                Je hebt een nieuwe like ontvangen in ${communityName}.</br></br>

                Bekijk de like <a href="https://www.deccos.co/${client}/Likes/${userID}"><u>hier</u></a>.<br><br>
                
                Vriendelijke groet, </br></br>
                ${communityName} </br></br>
                <img src="${logo}" width="100px">`,
            Gebruikersnaam: `${message.User}`,
            Emailadres: message.Email,
            Type: "Contribution"
              }     
          }); 
    }

    return (
        <div className='reaction-container'>
            <div className="reaction-inner-container" key={message.ID}>
                <div className="auth-photo-container">
                    <img src={message.UserPhoto} alt="" data-id={message.UserID} onClick={profileLink}/>
                </div>
                <div className="message-outer-container">
                    <div className="auth-message-container">
                        <p className="auth-name" data-id={message.UserID} onClick={profileLink}>{message.User}</p>
                        <p className="message-card-timestamp">{message.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                    </div>
                    <div className="message-container">
                        <div className="massage" dangerouslySetInnerHTML={{__html:linkInText(message)}}></div>
                    </div>
                    <div className="like-container">
                        <div className='like-icon-container'>
                            {/* <div className='like-icon-inner-container' style={{display: impacteer}}>
                                <img src={worldIcon} alt="" onClick={toggleGoalLikeBar}/>
                                <p className='notification-counter-small'>{message.Contributions.length}</p>
                            </div> */}
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
                                data-userdocid={message.UserDocID}
                                onClick={likeHandler}/>
                                <p className='notification-counter-small'>{message.Likes}</p>
                            </div>
                        </div>
                        <div style={{display: goalLikeDiplay}}>
                            <LikeBar message={message} />
                        </div>
                    </div>
                    < ReactionBar message={message} />
                    <div className="button-container">
                        <button className="reaction-button" onClick={updateRoute}>{numberOfReactions}</button>
                    </div>
                </div>
            </div>
            <div className={optionsClass(message)}>
                <img className="notifications-icon-message" onClick={toggleOptions} src={settingsIcon} alt=""/>
                <div style={{display: showOptions}}>
                    <div className='delete-message-container'>
                        <img className="notifications-icon-message" data-id={message.docid} src={deleteIcon} onClick={deleteMessage} alt=""/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Reaction
