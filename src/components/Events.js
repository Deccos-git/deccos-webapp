import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./rightSideBar/RightSideBar"
import { client } from '../hooks/Client';
import { Link } from "react-router-dom";
import plusIcon from '../images/icons/plus-icon.png'
import { useFirestore } from "../firebase/useFirestore";

const Events = () => {

    const events = useFirestore("Events")

    const detailRouter = () => {

    
        // routes && routes.forEach(route => {
        //     db.collection("Route")
        //     .doc(route.docid)
        //     .update({
        //         Route: doc.ID
        //     })
        // })
    
        // history.push(`/${client}/ArticleDetail`)
    }

    return (
        <div className="main">
            <LeftSideBar />
            <div className="main-container">
                <Link to={`/${client}/AddEvent`}><img className="plus-icon" src={plusIcon} alt="" /></Link>
                <div className="card-container">
                    {events && events.map(even => (
                        <div className="card">
                            <img src={even.Banner} alt="" />
                            <div className="list-inner-container">
                                <div className="article-card-user-container">
                                    <img src={even.UserPhoto} alt="" />
                                    <p>{even.User}</p>
                                </div>
                                <h2>{even.Title}</h2>
                                <p>{even.Date}</p>
                            </div>
                            <div className="button-container">
                                <button onClick={detailRouter}>Bekijk</button>
                            </div>
                        </div>
                    ))}
                 </div>
            </div>
            <RightSideBar />
        </div>
    )
}

export default Events