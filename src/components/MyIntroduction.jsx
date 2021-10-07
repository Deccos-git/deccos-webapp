import LeftSideBarPublicProfile from "./LeftSideBarPublicProfile";
import LeftSideBarPublicProfileFullScreen from "./LeftSideBarPublicProfileFullScreen";
import RightSideBar from "./rightSideBar/RightSideBar"
import Location from "../hooks/Location"
import { useFirestoreIntroductions } from "../firebase/useFirestore";
import MenuStatus from "../hooks/MenuStatus";

const MyIntroduction = () => {

    const route = Location()[3]
    const menuState = MenuStatus()

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
                        <p>{introduction.Body}</p>
                    </div>
                ))}
             </div>
             <RightSideBar />
        </div>
    )
}

export default MyIntroduction
