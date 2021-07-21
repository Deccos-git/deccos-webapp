import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./rightSideBar/RightSideBar"
import { useFirestoreID, useFirestore } from "../firebase/useFirestore"

const ArticleDetail = () => {

    const routes = useFirestore("Route")

    let routeArticle = ""

    routes && routes.forEach(route => {

        routeArticle = route.Article

    })

    const docs = useFirestoreID("KnowledgeCentre", routeArticle)

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    return (
        <div className="main">
            <LeftSideBar />
                {docs && docs.map(doc => (
                    <div className="article">
                        <h1>{doc.Title}</h1>
                        <img src={doc.Banner} alt="" />
                        <div className="list-inner-container">
                            <div className="article-card-user-container">
                                <img src={doc.UserPhoto} alt="" />
                                <p>{doc.User}</p>
                            </div>
                            <p>{doc.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                            <p>{doc.Categorie}</p>
                            <div className="article-body-container">
                                <div dangerouslySetInnerHTML={{ __html: doc.Body }}></div>
                            </div>
                        </div>
                    </div>
                ))}
            <RightSideBar />
        </div>
    )
}

export default ArticleDetail
