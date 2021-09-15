import { useFirestoreID, useFirestoreMessages } from "../firebase/useFirestore"
import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./rightSideBar/RightSideBar"
import LikeBar from "./LikeBar"
import ReactionBar from "./ReactionBar"
import { useHistory } from "react-router-dom"
import { client } from "../hooks/Client"
import MessageBar from "./MessageBar"
import { db } from "../firebase/config"
import { useContext } from 'react';
import { Auth } from '../StateManagment/Auth';
import Location from "../hooks/Location"

const NewsDetail = () => {
    const [authO] = useContext(Auth)

    const route = Location()[3]

    const news = useFirestoreID("News", route)
    const messages  = useFirestoreMessages("Messages", route)
    const history = useHistory()

    let numberOfReactions = ""

    messages && messages.forEach(message => {
        if(message.Thread.length === 0){
            numberOfReactions = `Bekijk bericht`
        } else if (message.Thread.length === 1){
            numberOfReactions = `Bekijk ${message.Thread.length} reactie`
        } else {
            numberOfReactions = `Bekijk ${message.Thread.length} reacties`
        }
    })

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    const updateRoute = () => {

        messages && messages.forEach(message => {
            history.push(`/${client}/MessageDetail/${message.ID}`)
        })
        
    }

    return (
        <div className="main">
            <LeftSideBar />
            <div className="article-container">
                {news && news.map(doc => (
                    <div className="article">
                        <h1>{doc.Title}</h1>
                        <img src={doc.Banner} alt="" />
                        <div className="list-inner-container">
                            <div className="article-card-user-container">
                                <img src={doc.UserPhoto} alt="" />
                                <p>{doc.User}</p>
                            </div>
                            <p>{doc.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                            <div className="article-body-container">
                                <div dangerouslySetInnerHTML={{ __html: doc.Body }}></div>
                            </div>
                        </div>
                    </div>
                ))}
                <h2>Berichten</h2>
                <MessageBar route={route} auth={authO}/>
                <div className="reaction-area">
                {messages && messages.map(message => ( 
                    <div className="reaction-inner-container">
                        <div className="auth-message-container">
                            <img src={message.UserPhoto} alt="" />
                        </div>
                        <div>
                            <div className="user-meta-container">
                                <p className="auth-name">{message.User}</p>
                                <p className="message-card-timestamp">{message.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                            </div>
                            <div className="message-container">
                                <p className="massage">{message.Message}</p>
                            </div>
                            <div className="like-container">
                                {/* <img src={heartIcon} alt="" onClick={LikeHandler} /> */}
                                < LikeBar message={message} />
                            </div>
                            <div className="button-container">
                                <button onClick={updateRoute}>{numberOfReactions}</button>
                            </div>
                            < ReactionBar message={message} />
                        </div>
                    </div>
                ))}
                </div>
            </div>
                
            <RightSideBar />
        </div>
    )
}

export default NewsDetail
