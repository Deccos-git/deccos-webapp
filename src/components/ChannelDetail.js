import { useFirestoreID, useFirestoreMessages } from "../firebase/useFirestore";
import LeftSideBar from "./LeftSideBar";
import RightSideBar from "./rightSideBar/RightSideBar"
import LikeBar from "./LikeBar"
import ReactionBar from "./ReactionBar"
import MessageBar from "./MessageBar"
import { db } from "../firebase/config"
import { useHistory } from "react-router-dom"
import { client } from "../hooks/Client"
import { useContext } from 'react';
import { Route } from '../StateManagment/Route';
import { Auth } from '../StateManagment/Auth';


const ChannelDetail = () => {
    const [route, setRoute] = useContext(Route)
    const [authO] = useContext(Auth)

    const items = useFirestoreID("ChannelItems", route)
    const messages  = useFirestoreMessages("Messages", route)
    const history = useHistory()

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
            setRoute(message.ID)
        })
        history.push(`/${client}/MessageDetail`)
    }


    return (
        <div className="main">
                <LeftSideBar />
                <div className="main-container">
                    {items && items.map(item => (
                        <div className="article" key={item.ID}>
                        <h1>{item.Title}</h1>
                        <img src={item.Banner} alt="" />
                        <div className="list-inner-container">
                            <div className="article-card-user-container">
                                <img src={item.UserPhoto} alt="" />
                                <p>{item.User}</p>
                            </div>
                            <p>{item.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                            <div className="article-body-container">
                                <div dangerouslySetInnerHTML={{ __html: item.Body }}></div>
                            </div>
                        </div>
                    </div>
                    )) }
                    <h2>Berichten</h2>
                    <MessageBar route={route} auth={authO}/>
                    <div className="reaction-area">
                        {messages && messages.map(message => ( 
                            <div className="reaction-inner-container" key={message.ID}>
                                <div className="auth-message-container">
                                    <img src={message.UserPhoto} alt="" />
                                    <p className="auth-name">{message.User}</p>
                                    <p className="message-card-timestamp">{message.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                                </div>
                                <p>{message.Message}</p>
                                < ReactionBar message={message} />
                                < LikeBar auth={authO} message={message} />
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

export default ChannelDetail