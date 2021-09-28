import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./rightSideBar/RightSideBar"
import { client } from '../hooks/Client';
import { useFirestoreTimestamp } from "../firebase/useFirestore";
import { useHistory } from "react-router-dom"
import { motion } from "framer-motion"
import { useState, useContext } from 'react';
import { auth, db } from '../firebase/config';
import { Auth } from '../StateManagment/Auth';
import articleIcon from '../images/icons/article-icon.png'
import { Link } from "react-router-dom";

const Events = () => {
    const [authO] = useContext(Auth)

    const events = useFirestoreTimestamp("Events")
    const history = useHistory()
    const [displayAddNew, setDisplayAddNew] = useState("none")

    const variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }

    const detailRouter = (e) => {

        const id = e.target.dataset.id 
    
        history.push(`/${client}/EventDetail/${id}`)
    }

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
                <div className="card-container">
                    <motion.div 
                    className="card"
                    style={{display: displayAddNew}}
                    initial="hidden"
                    animate="visible"
                    variants={variants}>
                        <img className="list-card-banner" src={articleIcon} alt="" />
                        <div className="list-inner-container">
                            <div className="article-card-user-container">
                                <img src={authO.Photo} alt="" />
                                <p>{authO.UserName}</p>
                            </div>
                            <h2>Voeg een event toe</h2>
                            <Link to={`/${client}/AddEvent`}><button>Voeg toe</button></Link>
                        </div>
                    </motion.div>
                    {events && events.map(even => (
                        <div className="card">
                            <img className="list-card-banner" src={even.Banner} alt="" />
                            <div className="list-inner-container">
                                <div className="article-card-user-container">
                                    <img src={even.UserPhoto} alt="" />
                                    <p>{even.User}</p>
                                </div>
                                <h2>{even.Title}</h2>
                                <p>{even.Date}</p>
                            </div>
                            <div className="button-container">
                                <button onClick={detailRouter} data-id={even.ID}>Bekijk</button>
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