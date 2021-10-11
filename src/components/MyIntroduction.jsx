import LeftSideBarPublicProfile from "./LeftSideBarPublicProfile";
import LeftSideBarPublicProfileFullScreen from "./LeftSideBarPublicProfileFullScreen";
import RightSideBar from "./rightSideBar/RightSideBar"
import Location from "../hooks/Location"
import { useFirestoreIntroductions } from "../firebase/useFirestore";
import MenuStatus from "../hooks/MenuStatus";

const MyIntroduction = () => {

    const route = Location()[3]
    const menuState = MenuStatus()

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    const introductions = useFirestoreIntroductions("Introductions", route)
    
    return (
        <div className="main">
             <LeftSideBarPublicProfile />
             <LeftSideBarPublicProfileFullScreen/>
             <div className="card-overview">
                <div className="page-header">
                    <h1>Mijn introductie</h1>
                </div>
                {introductions && introductions.map(introduction => (
                    <div className="list introductions-list" style={{display: menuState}}>
                        <div className="introduction-list-inner-container">
                            <h4>{introduction.Body}</h4>
                            <p>{introduction.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                        </div>
                    </div>
                ))}
             </div>
             <RightSideBar />
        </div>
    )
}

export default MyIntroduction
