import { client } from '../hooks/Client';
import articleIcon from '../images/icons/article-icon.png'
import { Link } from "react-router-dom";
import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./rightSideBar/RightSideBar"
import ArticleCard from './ArticleCard';
import { useFirestore } from '../firebase/useFirestore.js';
import { motion } from "framer-motion"
import { useState, useContext } from 'react';
import { auth, db } from '../firebase/config';
import { Auth } from '../StateManagment/Auth';


const KnowledgeCentre = () => {
    const [authO] = useContext(Auth)
    const docs = useFirestore("KnowledgeCentre")
    const [displayAddNew, setDisplayAddNew] = useState("none")

    const variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
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
                            <h2>Voeg een artikel toe</h2>
                            <Link to={`/${client}/AddArticle`}><button>Voeg toe</button></Link>
                        </div>
                    </motion.div>
                    {docs && docs.map(doc => (
                        <ArticleCard doc={doc} key={doc.ID} />
                    ))}
                </div>
            </div>
            <RightSideBar />
        </div>
    )
}

export default KnowledgeCentre
