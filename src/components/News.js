import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./rightSideBar/RightSideBar"
import { client } from '../hooks/Client';
import { Link } from "react-router-dom";
import plusIcon from '../images/icons/plus-icon.png'
import { useFirestore } from "../firebase/useFirestore";

const News = () => {

    const news = useFirestore("News")

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

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    return (
        <div className="main">
            <LeftSideBar />
            <div className="main-container">
                <Link to={`/${client}/AddNews`}><img className="plus-icon" src={plusIcon} alt="" /></Link>
                <div className="list-container">
                    {news && news.map(item => (
                        <div className="list">
                            <img src={item.Banner} alt="" />
                            <div className="list-inner-container">
                                <div className="article-card-user-container">
                                    <img src={item.UserPhoto} alt="" />
                                    <p>{item.User}</p>
                                </div>
                                <h2>{item.Title}</h2>
                                <p>{item.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
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

export default News