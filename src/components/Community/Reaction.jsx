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
import uuid from 'react-uuid';
import { connectScrollTo } from "react-instantsearch-core"

const Reaction = ({message}) => {
    const [authO] = useContext(Auth)
    const [showOptions, setShowOptions] = useState('none')
    const [goalLikeDiplay, setGoalLikeDiplay] = useState('none')
    const [communityName, setCommunityName] = useState('')
    const [logo, setLogo] = useState('')
    const [reactionList, setReactionList] = useState('')
    const [subReactionList, setSubReactionList] = useState('')

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const history = useHistory()
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

    const profileLink = (e) => {
        const id = e.target.dataset.id

        history.push(`/${client}/PublicProfile/${id}`)
    }

    const linkInText = (message) => {
    
        const urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
        const links =message.Massage && message.Message.match(urlRegex)
    
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

        console.log(messageDocid)
    
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
            ID: uuid(),
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

    const fetchMessages = async (ID) => {

        const reactionArray = [] 

        await db.collection('Messages')
        .where('ParentID', '==', ID)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach( async doc => {

                console.log(doc.id)

                const message = doc.data().Message 
                const id = doc.data().ID
                const email = doc.data().Email
                const timestamp = doc.data().Timestamp
                const user = doc.data().User 
                const userID = doc.data().UserID
                const userPhoto = doc.data().UserPhoto 
                const likes = doc.data().Likes
                const userDocID = doc.data().UserDocID
                const docid = doc.id

                const reactionObject = {
                    Message: message,
                    ID: id,
                    Docid: docid,
                    Email: email,
                    Timestamp: timestamp,
                    User: user,
                    UserID: userID,
                    UserPhoto: userPhoto,
                    Likes: likes,
                    UserDocID: userDocID,
                }

                reactionArray.push(reactionObject)

            })
        })

        return reactionArray

    }

    // Layer 1

    const DisplayMessage = ({message}) => {

        const [displayTextarea, setDisplayTextarea] = useState('none')

        const asnwerDisplay = () => {
            if(displayTextarea === 'block'){
                setDisplayTextarea('none')
            } else {
                setDisplayTextarea('block')
            }
        }

        return (
            <>
            <div className="reaction-inner-container" key={message.ID} id={message.ID}>
                <div className="message-outer-container">
                    <div className="auth-message-container">
                        <img src={message.UserPhoto} alt="" data-id={message.UserID} onClick={profileLink}/>
                        <p className="auth-name" data-id={message.UserID} onClick={profileLink}>{message.User}</p>
                        <p className="message-card-timestamp">{message.Timestamp && message.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                    </div>
                    <div className="message-detail-container">
                        <div className="message-container">
                            <div className="massage" dangerouslySetInnerHTML={{__html:linkInText(message)}}></div>
                        </div>
                        <div className="like-container">
                            <div className='like-icon-container'>
                                {/* <div className='like-icon-inner-container' style={{display: impacteer}}>
                                    <img src={worldIcon} alt="" onClick={toggleGoalLikeBar}/>
                                    <p className='notification-counter-small'>{message.Contributions.length}</p>
                                </div>   */}
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
                                <div style={{display: goalLikeDiplay}}>
                                    <LikeBar message={ message && message} />
                                </div>
                                <div className='answer-area-container'>
                                    <p onClick={asnwerDisplay}>Beantwoorden</p>
                                </div>
                            </div>
                        </div>
                        <div style={{display: displayTextarea}}>
                            <ReactionBar message={message && message} />
                        </div>
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
            <Reactions reaction={message}/>
        </>
        )
    }

    const Reactions = ({reaction}) => {

        const [reactionOverview, setReactionOverview] = useState([])

        useEffect(() => {

            const getReactions = async () => {
                const reactions = await fetchMessages(reaction.ID)
                setReactionOverview(reactions)
            }
            getReactions()
        },[reaction])

        return (
            <div>
                {reactionOverview && reactionOverview.map(reaction => (
                    <DisplayReaction reaction={reaction}/>
                ))}
            </div>
        )
    }

    // Layer 2

    const DisplayReaction = ({reaction}) => {
        const [displayTextarea, setDisplayTextarea] = useState('none')

        const asnwerDisplay = () => {
            if(displayTextarea === 'block'){
                setDisplayTextarea('none')
            } else {
                setDisplayTextarea('block')
            }
        }

        console.log(reaction)

        return (
        <>
        <div>
            <div className="reaction-inner-container" key={reaction.ID} id={reaction.ID}>
                <div className="message-outer-container">
                    <div className="auth-message-container">
                        <img src={reaction.UserPhoto} alt="" data-id={reaction.UserID} onClick={profileLink}/>
                        <p className="auth-name" data-id={reaction.UserID} onClick={profileLink}>{reaction.User}</p>
                        <p className="message-card-timestamp">{reaction.Timestamp && reaction.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                    </div>
                    <div className="message-detail-container">
                        <div className="message-container">
                            <div className="massage">{reaction.Message}</div>
                        </div>
                        <div className="like-container">
                            <div className='like-icon-container'> 
                                {/* <div className='like-icon-inner-container' style={{display: impacteer}}>
                                    <img src={worldIcon} alt="" onClick={toggleGoalLikeBar}/>
                                    <p className='notification-counter-small'>{message.Contributions.length}</p>
                                </div>   */}
                                <div className='like-icon-inner-container'>
                                    <img 
                                    src={heartIcon} 
                                    alt="" 
                                    data-message={reaction.Message}
                                    data-messageid={reaction.ID}
                                    data-messagedocid={reaction.Docid}
                                    data-username={reaction.User}
                                    data-userphoto={reaction.UserPhoto}
                                    data-userid={reaction.UserID}
                                    data-userdocid={reaction.UserDocID}
                                    onClick={likeHandler}/>
                                    <p className='notification-counter-small'>{reaction.Likes}</p>
                                </div>
                                <div className='answer-area-container'>
                                    <p onClick={asnwerDisplay}>Beantwoorden</p>
                                </div>
                            </div>
                            <div style={{display: goalLikeDiplay}}>
                                <LikeBar message={reaction && reaction} />
                            </div>
                        </div>
                        <div style={{display: displayTextarea}}>
                            <ReactionBar message={reaction && reaction} />
                        </div>
                    </div>
                </div>
            </div>
            <div className={optionsClass(reaction)}>
                <img className="notifications-icon-message" onClick={toggleOptions} src={settingsIcon} alt=""/>
                <div style={{display: showOptions}}>
                    <div className='delete-message-container'>
                        <img className="notifications-icon-message" data-id={reaction.docid} src={deleteIcon} onClick={deleteMessage} alt=""/>
                    </div>
                </div>
            </div> 
            <SubReactions reaction={reaction}/>
        </div>
       
        </>
        )
    }

    const SubReactions = ({reaction}) => {

        const [reactionOverview, setReactionOverview] = useState([])

        useEffect(() => {

            console.log(reaction.ID)

            const getReactions = async () => {
                const reactions = await fetchMessages(reaction.ID)
                setReactionOverview(reactions)
            }
            getReactions()
        },[reaction])

        console.log(reactionOverview)

        return (
            <div>
                {reactionOverview && reactionOverview.map(subreaction => (
                    <DisplaySubReaction reaction={subreaction}/>
                ))}
            </div>
        )
    }

    // Layer 3

    const DisplaySubReaction = ({reaction}) => {

        const [displayTextarea, setDisplayTextarea] = useState('none')

        const asnwerDisplay = () => {
            if(displayTextarea === 'block'){
                setDisplayTextarea('none')
            } else {
                setDisplayTextarea('block')
            }
        }

        return (
        <div className='reaction-container'>
            <div className="reaction-inner-container" key={reaction.ID} id={reaction.ID}>
                <div className="message-outer-container">
                    <div className="auth-message-container">
                        <img src={reaction.UserPhoto} alt="" data-id={reaction.UserID} onClick={profileLink}/>
                        <p className="auth-name" data-id={reaction.UserID} onClick={profileLink}>{reaction.User}</p>
                        <p className="message-card-timestamp">{reaction.Timestamp && reaction.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                    </div>
                    <div className="message-detail-container">
                        <div className="message-container">
                            <div className="massage">{reaction.Message}</div>
                        </div>
                        <div className="like-container">
                            <div className='like-icon-container'>
                                {/* <div className='like-icon-inner-container' style={{display: impacteer}}>
                                    <img src={worldIcon} alt="" onClick={toggleGoalLikeBar}/>
                                    <p className='notification-counter-small'>{reaction.Contributions.length}</p>
                                </div>   */}
                                <div className='like-icon-inner-container'>
                                    <img 
                                    src={heartIcon} 
                                    alt="" 
                                    data-message={reaction.Message}
                                    data-messageid={reaction.ID}
                                    data-messagedocid={reaction.Docid}
                                    data-username={reaction.User}
                                    data-userphoto={reaction.UserPhoto}
                                    data-userid={reaction.UserID}
                                    data-userdocid={reaction.UserDocID}
                                    onClick={likeHandler}/>
                                    <p className='notification-counter-small'>{reaction.Likes}</p>
                                </div>
                                <div style={{display: goalLikeDiplay}}>
                                    <LikeBar message={ reaction && reaction} />
                                </div>
                                <div className='answer-area-container'>
                                    <p onClick={asnwerDisplay}>Beantwoorden</p>
                                </div>
                            </div>
                        </div>
                        <div style={{display: displayTextarea}}>
                            <ReactionBar message={reaction && reaction} />
                        </div>
                    </div>
                </div>
            </div>
            <div className={optionsClass(reaction)}>
                <img className="notifications-icon-message" onClick={toggleOptions} src={settingsIcon} alt=""/>
                <div style={{display: showOptions}}>
                    <div className='delete-message-container'>
                        <img className="notifications-icon-message" data-id={reaction.docid} src={deleteIcon} onClick={deleteMessage} alt=""/>
                    </div>
                </div>
            </div> 
            <SubSubReactions reaction={reaction}/>
        </div>
        )
    }

    const SubSubReactions = ({reaction}) => {

        const [reactionOverview, setReactionOverview] = useState([])

        useEffect(() => {

            const getReactions = async () => {
                const reactions = await fetchMessages(reaction.ID)
                setReactionOverview(reactions)
            }
            getReactions()
        },[reaction])

        console.log(reactionOverview)

        return (
            <div>
                {reactionOverview && reactionOverview.map(reaction => (
                    <DisplaySubSubReaction reaction={reaction}/>
                ))}
            </div>
        )
    }

    // Layer 4

    const DisplaySubSubReaction = ({reaction}) => {
        const [displayTextarea, setDisplayTextarea] = useState('none')

        const asnwerDisplay = () => {
            if(displayTextarea === 'block'){
                setDisplayTextarea('none')
            } else {
                setDisplayTextarea('block')
            }
        }

        return (
        <div className='reaction-container'>
            <div className="reaction-inner-container" key={reaction.ID} id={reaction.ID}>
                <div className="message-outer-container">
                    <div className="auth-message-container">
                        <img src={reaction.UserPhoto} alt="" data-id={reaction.UserID} onClick={profileLink}/>
                        <p className="auth-name" data-id={reaction.UserID} onClick={profileLink}>{reaction.User}</p>
                        <p className="message-card-timestamp">{reaction.Timsetamp && reaction.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                    </div>
                    <div className="message-detail-container">
                        <div className="message-container">
                            <div className="massage" dangerouslySetInnerHTML={{__html:linkInText(reaction)}}></div>
                        </div>
                        <div className="like-container">
                            <div className='like-icon-container'>
                                {/* <div className='like-icon-inner-container' style={{display: impacteer}}>
                                    <img src={worldIcon} alt="" onClick={toggleGoalLikeBar}/>
                                    <p className='notification-counter-small'>{reaction.Contributions.length}</p>
                                </div>   */}
                                <div className='like-icon-inner-container'>
                                    <img 
                                    src={heartIcon} 
                                    alt="" 
                                    data-message={reaction.Message}
                                    data-messageid={reaction.ID}
                                    data-messagedocid={reaction.Docid}
                                    data-username={reaction.User}
                                    data-userphoto={reaction.UserPhoto}
                                    data-userid={reaction.UserID}
                                    data-userdocid={reaction.UserDocID}
                                    onClick={likeHandler}/>
                                    <p className='notification-counter-small'>{reaction.Likes}</p>
                                </div>
                                <div style={{display: goalLikeDiplay}}>
                                    <LikeBar message={ reaction && reaction} />
                                </div>
                                <div className='answer-area-container'>
                                    <p onClick={asnwerDisplay}>Beantwoorden</p>
                                </div>
                            </div>
                        </div>
                        <div style={{display: displayTextarea}}>
                            <ReactionBar message={reaction && reaction} />
                        </div>
                    </div>
                </div>
            </div>
            <div className={optionsClass(reaction)}>
                <img className="notifications-icon-message" onClick={toggleOptions} src={settingsIcon} alt=""/>
                <div style={{display: showOptions}}>
                    <div className='delete-message-container'>
                        <img className="notifications-icon-message" data-id={reaction.docid} src={deleteIcon} onClick={deleteMessage} alt=""/>
                    </div>
                </div>
            </div> 
            {/* <SubSubSubReactions reaction={reaction}/> */}
        </div>
        )
    }

    return (
        <div className='reaction-container'>
            <DisplayMessage message={message}/>
        </div>
    )
}

export default Reaction
