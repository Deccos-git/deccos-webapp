import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./rightSideBar/RightSideBar"
import { useFirestoreID, useFirestore, useFirestoreMessages } from "../firebase/useFirestore"
import LikeBar from "./LikeBar"
import ReactionBar from "./ReactionBar"
import { db } from "../firebase/config"
import { useHistory } from "react-router-dom"
import { client } from "../hooks/Client"
import MessageBar from "./MessageBar"

const ArticleDetail = ({route, auth}) => {

    const routes = useFirestore("Route")
    const messages  = useFirestoreMessages("Messages", route.Article )
    const history = useHistory()

    let routeArticle = ""

    routes && routes.forEach(route => {

        routeArticle = route.Article

    })

    const docs = useFirestoreID("KnowledgeCentre", routeArticle)

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
            db.collection("Route")
            .doc(route.docid)
            .update({
                Message: message.ID
            })
        })
        history.push(`/${client}/MessageDetail`)
    }

    return (
        <div className="main">
            <LeftSideBar />
            <div className="article-container">
                {docs && docs.map(doc => (
                    <div className="article">
                        <h1>{doc.Title}</h1>
                        <img src={doc.Banner} alt="" />
                        <div className="list-inner-container">
                            <div className="article-card-user-container">
                                <img src={doc.UserPhoto} alt="" />
                                <p>{doc.User}</p>
                            </div>
                            <p>{doc.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                            <p>{doc.Categorie}</p>
                            <div className="article-body-container">
                                <div dangerouslySetInnerHTML={{ __html: doc.Body }}></div>
                            </div>
                        </div>
                    </div>
                ))}
                <h2>Berichten</h2>
                <MessageBar route={route} auth={auth}/>
                <div className="reaction-area">
                    {messages && messages.map(message => ( 
                        <div className="reaction-inner-container">
                            <div className="auth-message-container">
                                <img src={message.UserPhoto} alt="" />
                                <p className="auth-name">{message.User}</p>
                                <p className="message-card-timestamp">{message.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                            </div>
                            <p>{message.Message}</p>
                            < ReactionBar message={message} />
                            < LikeBar auth={auth} message={message} />
                            <div className="button-container">
                                <button onClick={updateRoute}>{numberOfReactions}</button>
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
