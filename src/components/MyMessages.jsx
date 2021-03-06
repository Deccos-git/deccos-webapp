import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "./LeftSideBarAuthProfileFullScreen";
import RightSideBar from "./rightSideBar/RightSideBar"
import Location from "../hooks/Location"
import { useFirestoreMyMessages } from "../firebase/useFirestore";
import { client } from "../hooks/Client";
import { useHistory } from "react-router-dom";
import MenuStatus from "../hooks/MenuStatus";
import deleteIcon from '../images/icons/delete-icon.png'
import { db } from "../firebase/config";

const MyMessages = () => {

    const route = Location()[3]
    const history = useHistory()
    const menuState = MenuStatus()

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    const messages = useFirestoreMyMessages("Messages", route)

    const messageDetail = (e) => {

        const id = e.target.dataset.id

        history.push(`/${client}/MessageDetail/${id}`)

    }

    const deleteMessage = (e) => {

        const docid = e.target.dataset.docid 

        db.collection('Messages')
        .doc(docid)
        .delete()
    }
    
    return (
        <div className="main">
              <LeftSideBarAuthProfile />
            <LeftSideBarAuthProfileFullScreen/>
             <div className="card-overview" style={{display: menuState}}>
                <div className="page-header">
                    <h1>Mijn berichten</h1>
                </div>
                {messages && messages.map(message => (
                    <div className="introductions-container my-message" key={message.ID}>
                        <div className="introduction-list-inner-container">
                            <h4 className="my-message-message-container" data-id={message.ID} onClick={messageDetail}>{message.Message}</h4>
                            <p>{message.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                        </div>
                        <img className='my-messages-delete-button' data-docid={message.docid} src={deleteIcon} onClick={deleteMessage} alt="" />
                    </div>
                ))}
            </div>
             <RightSideBar />
        </div>
    )
}

export default MyMessages