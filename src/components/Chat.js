import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./rightSideBar/RightSideBar"
import MessageBar from "./MessageBar"

const Chat = () => {
    return (
        <div className="main">
            <LeftSideBar />
            <div className="group-container">
                <div className="group-header">
                    <h2>Chat met</h2>
                </div>
                <div className="chat-screen"></div>
                <MessageBar />
            </div>
            <RightSideBar />
        </div>
    )
}

export default Chat