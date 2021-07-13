import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import RightSideBar from "./rightSideBar/RightSideBar"
import { useFirestoreTimestamp } from "./../firebase/useFirestore";

const Members = () => {

    const docs = useFirestoreTimestamp("AllActivity")

    return (
            <div className="main">
                <LeftSideBarAuthProfile />
                <div className="card-overview">
                    <h2>Leden van de community</h2>
                    <p>Bekijk alle leden van de community</p>
                </div>
                <RightSideBar />
            </div>
    )
}

export default Members