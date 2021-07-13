import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./rightSideBar/RightSideBar"
import { useFirestoreTimestamp } from "./../firebase/useFirestore";

const ChatGroups = () => {

    const docs = useFirestoreTimestamp("AllActivity")

    return (
            <div className="main">
                <LeftSideBar />
                <div className="card-overview">
                    <h2>Chats en groepen</h2>
                </div>
                <RightSideBar />
            </div>
    )
}

export default ChatGroups