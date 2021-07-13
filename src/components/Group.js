import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./rightSideBar/RightSideBar"
import MessageBar from "./MessageBar"

const Group = () => {
    return (
        <div className="main">
            <LeftSideBar />
            <div className="group-container">
                <div className="group-header">
                    <h2>Groupnaam</h2>
                </div>
                <div className="chat-screen"></div>
                <MessageBar />
            </div>
            <RightSideBar />
        </div>
    )
}

export default Group