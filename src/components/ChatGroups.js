import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./rightSideBar/RightSideBar"
import { useFirestoreChatsGroups } from "./../firebase/useFirestore";
import Auth from "../firebase/Auth";

const ChatGroups = () => {

    const auth = Auth()

    console.log(auth.UserName)

    const chats = useFirestoreChatsGroups("Chats", auth.UserName)

    console.log(chats)

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