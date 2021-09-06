import { useFirestoreContributions } from "../firebase/useFirestore"
import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./rightSideBar/RightSideBar"

const Contributions = ({route}) => {

    const contributionsGoal = useFirestoreContributions("Contributions", "GoalID", route.Route)
    const contributionsMessage = useFirestoreContributions("Contributions", "MessageID", route.Route)
    const contributionsReciever = useFirestoreContributions("Contributions", "RecieverID", route.Route)
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };


    const recieverLink = (e) => {

    }

    return (
        <div className="main">
            <LeftSideBar />
            <div className="card-overview">
            {contributionsGoal && contributionsGoal.map(goal => (
                <div className="list notification-card">
                    <div className="user-meta-container">
                        <img className="user-photo" src={goal.RecieverPhoto} alt="" data-recieverid={goal.RecieverID} onClick={recieverLink} />
                        <h2>{goal.RecieverName}</h2>
                    </div>
                    <p>heeft bijdragen aan</p>
                    <h2>{goal.GoalTitle}</h2>
                    <ul>
                        <li>Gegeven door: {goal.SenderName}</li>
                        <li>Op: {goal.Timestamp.toDate().toLocaleDateString("nl-NL", options)} </li>
                    </ul>
                </div>
            ))}
            {contributionsMessage && contributionsMessage.map(message => (
                <div className="list notification-card">
                    <div className="user-meta-container">
                        <img className="user-photo" src={message.RecieverPhoto} alt="" data-recieverid={message.RecieverID} onClick={recieverLink} />
                        <h2>{message.RecieverName}</h2>
                    </div>
                    <p>heeft bijdragen aan</p>
                    <h2>{message.GoalTitle}</h2>
                    <ul>
                        <li>Gegeven door: {message.SenderName}</li>
                        <li>Op: {message.Timestamp.toDate().toLocaleDateString("nl-NL", options)} </li>
                    </ul>
                </div>
            ))} 
             {contributionsReciever && contributionsReciever.map(reciever => (
                <div className="list notification-card">
                    <div className="user-meta-container">
                        <img className="user-photo" src={reciever.RecieverPhoto} alt="" data-recieverid={reciever.RecieverID} onClick={recieverLink} />
                        <h2>{reciever.RecieverName}</h2>
                    </div>
                    <p>heeft bijdragen aan</p>
                    <h2>{reciever.GoalTitle}</h2>
                    <ul>
                        <li>Gegeven door: {reciever.SenderName}</li>
                        <li>Op: {reciever.Timestamp.toDate().toLocaleDateString("nl-NL", options)} </li>
                    </ul>
                </div>
            ))}           
            </div>
            <RightSideBar />
        </div>
    )
}

export default Contributions
