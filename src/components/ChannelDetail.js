import { useFirestoreID, useFirestoreMessages } from "../firebase/useFirestore";
import LeftSideBar from "./LeftSideBar";
import RightSideBar from "./rightSideBar/RightSideBar"
import LikeBar from "./LikeBar"
import ReactionBar from "./ReactionBar"
import MessageBar from "./MessageBar"
import { useHistory } from "react-router-dom"
import { client } from "../hooks/Client"
import { useContext } from 'react';
import { Auth } from '../StateManagment/Auth';
import Location from "../hooks/Location"

const ChannelDetail = () => {
    const [authO] = useContext(Auth)

    const route = Location()[3]

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
            history.push(`/${client}/MessageDetail/${message.ID}`)
        })
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
                                    <p className="like-counter">Aantal bijdragen: {message.Contributions.length}</p>
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

export default ChannelDetail