import { useFirestoreContributions } from "../firebase/useFirestore"
import LeftSideBar from "./LeftSideBar"
import LeftSideBarFullScreen from "./LeftSideBarFullScreen"
import RightSideBar from "./rightSideBar/RightSideBar"
import Location from "../hooks/Location"
import MenuStatus from "../hooks/MenuStatus";

const Contributions = () => {
    const route = Location()[3]
    const menuState = MenuStatus()

    const contributionsGoal = useFirestoreContributions("Contributions", "GoalID", route)
    const contributionsMessage = useFirestoreContributions("Contributions", "MessageID", route)
    const contributionsReciever = useFirestoreContributions("Contributions", "RecieverID", route)
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };


    const recieverLink = (e) => {

    }

    return (
        <div className="main">
            <LeftSideBar />
            <LeftSideBarFullScreen/>
            <div className="card-overview" style={{display: menuState}}>
            {contributionsGoal && contributionsGoal.map(goal => (
                <div className="notification-card" key={goal.ID}>
                    <div className="user-meta-container">
                        <img className="user-photo" src={goal.RecieverPhoto} alt="" data-recieverid={goal.RecieverID} onClick={recieverLink} />
                        <h2>{goal.RecieverName}</h2>
                    </div>
                    <p>heeft bijdragen aan</p>
                    <h3>{goal.GoalTitle}</h3>
                    <ul className="contribution-card-ul">
                        <li>Gegeven door: {goal.SenderName}</li>
                        <li>{goal.Timestamp.toDate().toLocaleDateString("nl-NL", options)} </li>
                    </ul>
                </div>
            ))}
            {contributionsMessage && contributionsMessage.map(message => (
                <div className="notification-card" key={message.ID}>
                    <div className="user-meta-container">
                        <img className="user-photo" src={message.RecieverPhoto} alt="" data-recieverid={message.RecieverID} onClick={recieverLink} />
                        <h2>{message.RecieverName}</h2>
                    </div>
                    <p>heeft bijdragen aan</p>
                    <h3>{message.GoalTitle}</h3>
                    <ul className="contribution-card-ul">
                        <li>Gegeven door: {message.SenderName}</li>
                        <li>{message.Timestamp.toDate().toLocaleDateString("nl-NL", options)} </li>
                    </ul>
                </div>
            ))} 
             {contributionsReciever && contributionsReciever.map(reciever => (
                <div className="notification-card" key={reciever.ID}>
                    <div className="user-meta-container">
                        <img className="user-photo" src={reciever.RecieverPhoto} alt="" data-recieverid={reciever.RecieverID} onClick={recieverLink} />
                        <h2>{reciever.RecieverName}</h2>
                    </div>
                    <p>heeft bijdragen aan</p>
                    <h3>{reciever.GoalTitle}</h3>
                    <ul className="contribution-card-ul">
                        <li>Gegeven door: {reciever.SenderName}</li>
                        <li>{reciever.Timestamp.toDate().toLocaleDateString("nl-NL", options)} </li>
                    </ul>
                </div>
            ))}           
            </div>
            <RightSideBar />
        </div>
    )
}

export default Contributions
