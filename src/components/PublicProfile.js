import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./rightSideBar/RightSideBar"
import { useFirestoreTimestamp } from "./../firebase/useFirestore";

const PublicProfile = () => {

    const docs = useFirestoreTimestamp("AllActivity")

    return (
            <div className="main">
                <LeftSideBar />
                <div className="card-overview">
                    <h2>Profiel van</h2>
                </div>
                <RightSideBar />
            </div>
    )
}

export default PublicProfile