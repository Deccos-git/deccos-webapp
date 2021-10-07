import LeftSideBarPublicProfile from "./LeftSideBarPublicProfile";
import LeftSideBarPublicProfileFullScreen from "./LeftSideBarPublicProfileFullScreen";
import RightSideBar from "./rightSideBar/RightSideBar"
import Location from "../hooks/Location"
import { useFirestoreMyMessages } from "../firebase/useFirestore";
import { client } from "../hooks/Client";
import { useHistory } from "react-router-dom";
import MenuStatus from "../hooks/MenuStatus";

const MyMessages = () => {

    const route = Location()[3]
    const history = useHistory()
    const menuState = MenuStatus()

    const messages = useFirestoreMyMessages("Messages", route)

    const messageDetail = (e) => {

        const id = e.target.dataset.id

        history.push(`/${client}/MessageDetail/${id}`)

    }
    
    return (
        <div className="main">
             <LeftSideBarPublicProfile />
             <LeftSideBarPublicProfileFullScreen/>
             <div className="card-overview" style={{display: menuState}}>
                <div className="page-header">
                    <h1>Mijn berichten</h1>
                </div>
                {messages && messages.map(message => (
                    <div className="list introductions-list my-message" data-id={message.ID} key={message.ID} onClick={messageDetail}>
                        <p>{message.Message}</p>
                    </div>
                ))}
            </div>
             <RightSideBar />
        </div>
    )
}

export default MyMessages