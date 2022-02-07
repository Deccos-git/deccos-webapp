import { useFirestoreID, useFirestoreMessages } from "../../firebase/useFirestore"
import LeftSideBar from "../LeftSideBar"
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import RightSideBar from "../rightSideBar/RightSideBar"
import MessageBar from "./MessageBar"
import { useContext } from 'react';
import { Auth } from '../../StateManagment/Auth';
import Location from "../../hooks/Location"
import Reaction from "./Reaction"
import { useHistory } from "react-router-dom"
import { client } from "../../hooks/Client"
import MenuStatus from "../../hooks/MenuStatus";

const NewsDetail = () => {
    const [authO] = useContext(Auth)

    const route = Location()[3]
    const menuState = MenuStatus()
    const history = useHistory()

    const news = useFirestoreID("News", route)
    const messages  = useFirestoreMessages("Messages", route)

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    const profileLink = (e) => {
        const id = e.target.dataset.id

        history.push(`/${client}/PublicProfile/${id}`)
    }

    return (
        <div className="main">
            <LeftSideBar />
            <LeftSideBarFullScreen/>
            <div className="article-container" style={{display: menuState}}>
                {news && news.map(doc => (
                    <div className="article">
                        <h1>{doc.Title}</h1>
                        <img className="article-detail-banner" src={doc.Banner} alt="" />
                        <div className="article-meta-container">
                            <div className="article-card-user-container">
                                <img src={doc.UserPhoto} alt="" data-id={doc.UserID} onClick={profileLink} />
                                <p data-id={doc.UserID} onClick={profileLink}>{doc.User}</p>
                            </div>
                            <h3 id='event-detail-timestamp'>{doc.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</h3>
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
                    <Reaction message={message}/>
                ))}
                </div>
            </div>
                
            <RightSideBar />
        </div>
    )
}

export default NewsDetail
