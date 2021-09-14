import { client } from '../hooks/Client';
import { useHistory } from "react-router-dom";
import { db } from '../firebase/config';
import { useFirestore } from '../firebase/useFirestore';
import { motion } from "framer-motion"
import { useContext } from 'react';
import { Route } from '../StateManagment/Route';

const ArticleCard = ({doc}) => {

    const [route, setRoute] = useContext(Route)

    const history = useHistory();
    const routes = useFirestore("Route")

    const variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }

    const detailRouter = () => {
    
        setRoute(doc.ID)
    
        history.push(`/${client}/ArticleDetail`)
    }

    return (
            <motion.div 
            className="card" 
            initial="hidden"
            animate="visible"
            variants={variants}>
                <img src={doc.Banner} alt="" />
                <div className="list-inner-container">
                    <div className="article-card-user-container">
                        <img src={doc.UserPhoto} alt="" />
                        <p>{doc.User}</p>
                    </div>
                    <h2>{doc.Title}</h2>
                    <button onClick={detailRouter}>Bekijk</button>
                </div>
            </motion.div>
    )
}

export default ArticleCard
