import { useFirestoreMessages } from "../firebase/useFirestore"
import { useFirestoreID } from "../firebase/useFirestore"
import LeftSideBar from "./LeftSideBar"
import LeftSideBarFullScreen from "./LeftSideBarFullScreen"
import RightSideBar from "./rightSideBar/RightSideBar"
import ReactionBar from "./ReactionBar"
import LikeBar from "./LikeBar"
import { db } from "../firebase/config"
import { useHistory } from "react-router-dom"
import { client } from "../hooks/Client"
import ArrowLeftIcon from '../images/icons/arrow-left-icon.png'
import Location from "../hooks/Location"
import MenuStatus from "../hooks/MenuStatus";

const MessageDetail = () => {
    const route = Location()[3]
    const messages = useFirestoreID("Messages", route)
    const history = useHistory()
    const menuState = MenuStatus()

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
            numberOfReactions = `Bekijk reactie`
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
                    < ReactionBar message={message} />
                    <p onClick={showContributions} data-id={message.ID}>Aantal bijdragen: {numberOfContributions}</p>
                    < LikeBar message={message} />
                    </div>
                ))}

                <div>
                    <p>----- Reacties -----</p>
                </div>
                <div className="reaction-area">
                {reactions && reactions.map(reaction => ( 
                    <div className="reaction-inner-container" key={reaction.ID}>
                        <div className="auth-message-container">
                            <img src={reaction.UserPhoto} alt="" data-id={reaction.UserID} onClick={profileLink}/>
                        </div>
                        <div className='message-inner-container'>
                            <div className="user-meta-container">
                                <p className="auth-name" data-id={reaction.UserID} onClick={profileLink}>{reaction.User}</p>
                                <p className="message-card-timestamp">{reaction.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                            </div>
                            <div className="message-container">
                            <div className="massage" dangerouslySetInnerHTML={{__html:reaction.Message}}></div>
                            </div>
                            <div className="like-container">
                                <p>Aantal bijdragen: {numberOfContributionsReaction}</p>
                                {/* <img src={heartIcon} alt="" onClick={LikeHandler} /> */}
                                < LikeBar message={reaction} />
                            </div>
                            <div className="button-container">
                                <button onClick={updateRoute}>{numberOfReactions}</button>
                            </div>
                            < ReactionBar message={reaction} />
                        </div>
                    </div>
                ))}
            </div>
            </div>
             <RightSideBar />
        </div>
    )
}

export default MessageDetail
