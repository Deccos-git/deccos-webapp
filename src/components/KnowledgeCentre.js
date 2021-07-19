import { client } from '../hooks/Client';
import plusIcon from '../images/icons/plus-icon.png'
import { Link } from "react-router-dom";
import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./rightSideBar/RightSideBar"
import ArticleCard from './ArticleCard';
import { useFirestore } from '../firebase/useFirestore.js';

const KnowledgeCentre = () => {

    const docs = useFirestore("KnowledgeCentre")

    return (
        <div className="main">
             <LeftSideBar />
             <div className="card-container">
                <Link to={`/${client}/AddArticle`}><img className="plus-icon" src={plusIcon} alt="" /></Link>
                <div className="article-container">
                    {docs && docs.map(doc => (
                        <ArticleCard doc={doc} />
                    ))}
                </div>
            </div>
            <RightSideBar />
        </div>
    )
}

export default KnowledgeCentre
