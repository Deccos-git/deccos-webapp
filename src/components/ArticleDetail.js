import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./rightSideBar/RightSideBar"
import { useFirestoreID, useFirestoreMessages } from "../firebase/useFirestore"
import LikeBar from "./LikeBar"
import ReactionBar from "./ReactionBar"
import { useHistory } from "react-router-dom"
import { client } from "../hooks/Client"
import MessageBar from "./MessageBar"
import Location from "../hooks/Location"

const ArticleDetail = () => {
    const route = Location()[3]

    const messages  = useFirestoreMessages("Messages", route )
    const history = useHistory()

    const docs = useFirestoreID("KnowledgeCentre", route)

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

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

    const updateRoute = () => {

        messages && messages.forEach(message => {
            history.push(`/${client}/MessageDetail/${message.ID}`)
        })
        
    }

    return (
        <div className="main">
            <LeftSideBar />
            <div className="article-container">
                {docs && docs.map(doc => (
                    <div className="article">
                        <h1>{doc.Title}</h1>
                        <img className="article-detail-banner" src={doc.Banner} alt="" />
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
                <MessageBar/>
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
                                <p className="like-counter">Aantal bijdragen aan doelen: {message.Contributions.length}</p>
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

export default ArticleDetail
