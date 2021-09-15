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
             <div className="main-container">
                <Link to={`/${client}/AddArticle`}><img className="plus-icon" src={plusIcon} alt="" /></Link>
                <div className="card-container">
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
