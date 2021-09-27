import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./rightSideBar/RightSideBar"
import { client } from '../hooks/Client';
import { Link } from "react-router-dom";
import { useFirestore } from "../firebase/useFirestore";
import { useHistory } from "react-router-dom"
import articleIcon from '../images/icons/article-icon.png'
import { useState, useContext } from 'react';
import { auth, db } from '../firebase/config';
import { motion } from "framer-motion"
import { Auth } from '../StateManagment/Auth';

const News = () => {
    const [displayAddNew, setDisplayAddNew] = useState("none")
    const [authO] = useContext(Auth)

    const news = useFirestore("News")
    const history = useHistory()

    const detailRouter = (e) => {

        const id = e.target.dataset.id 
    
        history.push(`/${client}/NewsDetail/${id}`)
    }

    const variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    const showAddNew = () => {

        auth.onAuthStateChanged(User =>{
            if(User){
                db.collection("Users")
                .doc(User.uid)
                .get()
                .then(doc => {
                    const author = doc.data().Author

                    if(author === true){
                        setDisplayAddNew("flex")
                    } else if (author === false){
                        setDisplayAddNew("none")
                    }
                })
            }
        })
    }

    showAddNew()

    return (
        <div className="main">
            <LeftSideBar />
            <div className="main-container">
                <div className="list-container">
                    <motion.div 
                    className="list"
                    style={{display: displayAddNew}}
                    initial="hidden"
                    animate="visible"
                    variants={variants}>
                        <img className="list-card-banner" src={articleIcon} alt="" />
                        <div className="article-card-user-container">
                            <img src={authO.Photo} alt="" />
                            <p>{authO.UserName}</p>
                        </div>
                        <div className="list-inner-container">
                            <h2>Voeg een item toe</h2>
                            <Link to={`/${client}/AddNews`}><button>Voeg toe</button></Link>
                        </div>
                    </motion.div>
                    {news && news.map(item => (
                        <div className="list">
                            <img className="list-card-banner" src={item.Banner} alt="" />
                            <div className="article-card-user-container">
                                <img src={item.UserPhoto} alt="" />
                                <p>{item.User}</p>
                                <p className="list-card-timestamp">{item.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                            </div>
                            <div className="list-inner-container">
                                <h2>{item.Title}</h2>
                                <button onClick={detailRouter} data-id={item.ID}>Bekijk</button>
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