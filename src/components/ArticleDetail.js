import LeftSideBar from "./LeftSideBar"
import LeftSideBarFullScreen from "./LeftSideBarFullScreen"
import RightSideBar from "./rightSideBar/RightSideBar"
import { useFirestoreID, useFirestoreMessages } from "../firebase/useFirestore"
import MessageBar from "./MessageBar"
import Location from "../hooks/Location"
import Reaction from "./Reaction"
import { client } from '../hooks/Client';
import { useHistory } from "react-router-dom";

const ArticleDetail = () => {
    const route = Location()[3]

    const messages  = useFirestoreMessages("Messages", route )
    const docs = useFirestoreID("KnowledgeCentre", route)

    const history = useHistory();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    const profileLink = (e) => {
        const id = e.target.dataset.id

        history.push(`/${client}/PublicProfile/${id}`)
    }

    return (
        <div className="main">
            <LeftSideBar />
            <LeftSideBarFullScreen/>
            <div className="article-container">
                {docs && docs.map(doc => (
                    <div className="article">
                        <h1>{doc.Title}</h1>
                        <img className="article-detail-banner" src={doc.Banner} alt="" />
                        <div className="article-meta-container">
                            <div className="article-card-user-container">
                                <img src={doc.UserPhoto} alt="" data-id={doc.UserID} onClick={profileLink} />
                                <p data-id={doc.UserID} onClick={profileLink}>{doc.User}</p>
                            </div>
                            <p id='event-detail-timestamp'>{doc.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
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
                   <Reaction message={message}/>
                ))}
                </div>
            </div>
            <RightSideBar />
        </div>
    )
}

export default ArticleDetail
