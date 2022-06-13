import LeftSideBar from "../LeftSideBar"
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import RightSideBar from "../rightSideBar/RightSideBar"
import ArticleCard from './ArticleCard';
import { useFirestore} from '../../firebase/useFirestore.js';
import { motion } from "framer-motion"
import MenuStatus from "../../hooks/MenuStatus";
import ScrollToTop from "../../hooks/ScrollToTop";

const KnowledgeCentre = () => {

    const docs = useFirestore("KnowledgeCentre")

    const menuState = MenuStatus()
    ScrollToTop()

    return (
        <div className="main">
             <LeftSideBar />
             <LeftSideBarFullScreen/>
             <div className="main-container" style={{display: menuState}}>
                <div className="page-header">
                    <h1>Kenniscentrum</h1>
                </div>
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
