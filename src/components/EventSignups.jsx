import RightSideBar from "./rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "./LeftSideBarAuthProfileFullScreen";
import MenuStatus from "../hooks/MenuStatus";
import { useFirestoreID} from "../firebase/useFirestore";
import Location from "../hooks/Location"
import { useHistory } from "react-router-dom";
import { client } from "../hooks/Client";

const EventSignups = () => {

    const menuState = MenuStatus()
    const route = Location()[3]
    const history = useHistory()
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    const signups = useFirestoreID('EventSignups', route)
    const events = useFirestoreID('Events', route)

    const userLink = (e) => {

        const id = e.target.dataset.id

        history.push(`/${client}/PublicProfile/${id}`)

    }

    return (
        <div className="main">
            <LeftSideBarAuthProfile />
            <LeftSideBarAuthProfileFullScreen/>
            <div className="profile profile-auth-profile" style={{display: menuState}}>
                <div className="settings-inner-container">
                    {events && events.map(vnt => (
                        <div className="card-header" key={vnt.ID}>
                            <h2>Aanmeldingen voor</h2>
                            <h1>{vnt.Title}</h1>
                            <h3>Totaal: {signups.length}</h3>
                        </div>
                    ))}
                    {signups && signups.map(signup => (
                        <div className='signup-container' key={signup.docid}>
                            <img style={{cursor: 'pointer' }} src={signup.UserPhoto} alt="" data-id={signup.UserID} onClick={userLink}/>
                            <p style={{cursor: 'pointer' }} data-id={signup.UserID} onClick={userLink}>{signup.UserName}</p>
                            <p className='signup-timestamp'>{signup.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                        </div>
                    )) }
                </div>   
            </div>
            <RightSideBar/>
        </div>
    )
}

export default EventSignups
