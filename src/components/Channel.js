import LeftSideBar from "./LeftSideBar";
import RightSideBar from "./rightSideBar/RightSideBar"
import { client } from '../hooks/Client';
import plusIcon from '../images/icons/plus-icon.png'
import { Link } from "react-router-dom";
import { useFirestoreChannelItems, useFirestoreID } from "../firebase/useFirestore";
import { db } from "../firebase/config.js"
import { useHistory } from "react-router-dom";

const Channel = ({route}) => {

    const channels = useFirestoreID("Channels", route.Route)
    const items = useFirestoreChannelItems("ChannelItems", route.Route)
    const history = useHistory()

    const updateRoute = (e) => {

        const channelID = e.target.dataset.id

        db.collection("Route")
        .doc(route.docid)
        .update({
            Route: channelID
        })

        history.push(`/${client}/ChannelDetail`)
    }

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    return (
            <div className="main">
                <LeftSideBar />
                <div className="main-container">
                {channels && channels.map(channel => (
                    <>
                        <Link to={`/${client}/AddChannelItem`}><img className="plus-icon" data-id={channel.ID} src={plusIcon} alt="" onClick={updateRoute} /></Link>
                        <div className={channel.Layout}>
                            {items && items.map(item => (
                                <div key={item.ID}>
                                    <img src={item.Banner} alt="" />
                                    <div className="list-inner-container">
                                        <div className="article-card-user-container">
                                            <img src={item.UserPhoto} alt="" />
                                            <p>{item.User}</p>
                                        </div>
                                        <h2>{item.Title}</h2>
                                        <p>{item.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                                    </div>
                                    <div className="button-container">
                                        <button onClick={updateRoute} data-id={item.ID}>Bekijk</button>
                                    </div>
                                </div>
                            )) }
                        </div>
                    </>
                ))}
                </div>
                <RightSideBar />
            </div>
    )
}

export default Channel