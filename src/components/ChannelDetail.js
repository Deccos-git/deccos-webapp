import { useFirestoreID, useFirestoreMessages } from "../firebase/useFirestore";
import LeftSideBar from "./LeftSideBar";
import LeftSideBarFullScreen from "./LeftSideBarFullScreen"
import RightSideBar from "./rightSideBar/RightSideBar"
import MessageBar from "./MessageBar"
import Location from "../hooks/Location"
import Reaction from "./Reaction";
import MenuStatus from "../hooks/MenuStatus";
import { useHistory } from "react-router-dom"
import { client } from "../hooks/Client"

const ChannelDetail = () => {
    const route = Location()[3]
    const menuState = MenuStatus()

    const items = useFirestoreID("ChannelItems", route)
    const messages  = useFirestoreMessages("Messages", route)

    const history = useHistory()
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    const profileLink = (e) => {
        const id = e.target.dataset.id

        history.push(`/${client}/PublicProfile/${id}`)
    }

    return (
        <div className="main">
                <LeftSideBar />
                <LeftSideBarFullScreen/>
                <div className="main-container" style={{display: menuState}}>
                    {items && items.map(item => (
                        <div className="article" key={item.ID}>
                        <h1>{item.Title}</h1>
                        <img className="article-detail-banner" src={item.Banner} alt="" />
                        <div className="article-meta-container">
                            <div className="article-card-user-container">
                                <img src={item.UserPhoto} alt="" data-id={item.UserID} onClick={profileLink} />
                                <p data-id={item.UserID} onClick={profileLink}>{item.User}</p>
                            </div>
                            <p id='event-detail-timestamp'>{item.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
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
                        <Reaction message={message}/>
                    ))}
                    </div>
                </div>
                <RightSideBar />
            </div>
    )

}

export default ChannelDetail