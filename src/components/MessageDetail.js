import { useFirestoreMessages } from "../firebase/useFirestore"
import { useFirestoreID } from "../firebase/useFirestore"
import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./rightSideBar/RightSideBar"
import ReactionBar from "./ReactionBar"
import LikeBar from "./LikeBar"
import { db } from "../firebase/config"
import { useHistory, useLocation } from "react-router-dom"
import { client } from "../hooks/Client"
import ArrowLeftIcon from '../images/icons/arrow-left-icon.png'
import { useContext } from 'react';
import { Route } from '../StateManagment/Route';
import { Auth } from '../StateManagment/Auth';

const MessageDetail = ({auth}) => {
    const [route, setRoute] = useContext(Route)
    const [authO] = useContext(Auth)

    const messages = useFirestoreID("Messages", route)
    const history = useHistory()
    const location = useLocation()

    let parentID = ""

    messages && messages.forEach(message => {

        parentID = message.ID
        
    })

    let numberOfContributions = ""
    let numberOfContributionsReaction = ""

    messages && messages.forEach(message => {

        console.log(message.Contributions.length)

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

        const routeRef = db.collection("Route")
        .doc(route.docid)

        reactions && reactions.forEach(reaction => {
            routeRef.update({
                Route: reaction.ID,
            })
        })

        history.push(`/${client}/MessageDetail`)
    }

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    const previousMessage = () => {

        messages && messages.forEach(message => {

            console.log(message.ID)

            db.collection("Messages")
            .where("ID", "==", message.ID)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {

                    const parentID = doc.data().ParentID
                    const prevPath = doc.data().PrevPath

                    setRoute(parentID)
            
                    history.push(`${prevPath}`)

                })
            })
        })
    }

    const showContributions = (e) => {

        const id = e.target.dataset.id
        
        setRoute(id)

        history.push(`/${client}/Contributions`)
    }

    return (
        <div className="main">
             <LeftSideBar />
             <div className="card-overview">
                 <div className="previous-message-container" onClick={previousMessage}>
                    <img src={ArrowLeftIcon} alt="" />
                    <p>Vorige bericht</p>
                 </div>
                {messages && messages.map(message => (
                    <div className="message-card">
                        <div className="auth-message-container">
                            <img src={message.UserPhoto} alt="" />
                            <p className="auth-name">{message.User}</p>
                            <p className="message-card-timestamp">{message.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                        </div>
                    <p className="massage">{message.Message}</p>
                    < ReactionBar message={message} />
                    <p onClick={showContributions} data-id={message.ID}>Aantal bijdragen: {numberOfContributions}</p>
                    < LikeBar auth={authO} message={message} />
                    </div>
                ))}

                <div>
                    <p>----- Reacties -----</p>
                </div>
                <div className="reaction-area">
                {reactions && reactions.map(reaction => ( 
                    <div className="reaction-inner-container">
                        <div className="auth-message-container">
                            <img src={reaction.UserPhoto} alt="" />
                        </div>
                        <div>
                            <div className="user-meta-container">
                                <p className="auth-name">{reaction.User}</p>
                                <p className="message-card-timestamp">{reaction.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                            </div>
                            <div className="message-container">
                                <p className="massage">{reaction.Message}</p>
                            </div>
                            <div className="like-container">
                                <p>Aantal bijdragen: {numberOfContributionsReaction}</p>
                                {/* <img src={heartIcon} alt="" onClick={LikeHandler} /> */}
                                < LikeBar auth={authO} message={reaction} />
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
