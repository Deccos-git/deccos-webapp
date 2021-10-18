import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "./LeftSideBarAuthProfileFullScreen";
import RightSideBar from "./rightSideBar/RightSideBar"
import { useFirestoreTimestamp } from "./../firebase/useFirestore";
import MenuStatus from "../hooks/MenuStatus";

const Analytics = () => {

    const docs = useFirestoreTimestamp("AllActivity")

    const menuState = MenuStatus()

    return (
            <div className="main">
                <LeftSideBarAuthProfile />
                <LeftSideBarAuthProfileFullScreen/>
                <div className="profile profile-auth-profile" style={{display: menuState}}>
                    <div className="settings-inner-container">
                        <div className="divider card-header">
                            <h1>Analytics</h1>
                            <p>Analyseer de ontwikkeling van je community</p>
                        </div>
                        <div className='divider'>
                            <h2>Leden</h2>
                        </div>
                        <div className='divider'>
                            <h2>Berichten</h2>
                        </div>
                        <div className='divider'>
                            <h2>Bijdragen aan doelen</h2>
                        </div>
                    </div>  
                </div>
                <RightSideBar />
            </div>
    )
}

export default Analytics