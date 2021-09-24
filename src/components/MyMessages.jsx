import LeftSideBarPublicProfile from "./LeftSideBarPublicProfile";
import RightSideBar from "./rightSideBar/RightSideBar"
import Location from "../hooks/Location"
import { useFirestoreMyMessages } from "../firebase/useFirestore";
import { client } from "../hooks/Client";
import { useHistory } from "react-router-dom";

const MyMessages = () => {

    const route = Location()[3]
    const history = useHistory()

    const messages = useFirestoreMyMessages("Messages", route)

    const messageDetail = (e) => {

        const id = e.target.dataset.id

        history.push(`/${client}/MessageDetail/${id}`)

    }
    
    return (
        <div className="main">
             <LeftSideBarPublicProfile />
             <div className="card-overview">
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