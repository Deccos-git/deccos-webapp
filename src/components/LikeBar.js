import { useFirestore, useFirestoreID } from "../firebase/useFirestore"
import { useState, useContext } from "react"
import { db, timestamp } from "../firebase/config"
import firebase from "firebase"
import { client } from "../hooks/Client"
import uuid from 'react-uuid';
import { Auth } from '../StateManagment/Auth';

const LikeBar = ({message}) => {
    const [authO] = useContext(Auth)
    const [goalID, setGoalID] = useState("")

    const allGoals = useFirestore("Goals")
    const id = uuid()

    const goalHandler = (e) => {

        const select = e.target

        const option = select.options
        const selected = option[option.selectedIndex].value

        setGoalID(selected)

    }

    const goals = useFirestoreID("Goals", goalID)

    let userID = ""

    if(message != undefined){

    userID = message.UserID

    }

    const users = useFirestoreID("Users", userID)

    const sendGoalLike = () => {

        goals && goals.forEach(goal => {

            db.collection("Contributions")
            .doc()
            .set({
                GoalID: goal.ID,
                GoalTitle: goal.Title,
                Timestamp: timestamp,
                GoalName: goal.Title,
                SenderID: authO.ID,
                SenderName: authO.UserName,
                SenderPhoto: authO.Photo,
                RecieverID: message.UserID,
                RecieverName: message.User,
                RecieverPhoto: message.UserPhoto,
                MessageID: message.ID,
                MessageBody: message.Message,
                Read: false,
                ID: id,
                Compagny: client,
            })
            .then(() => {
                db.collection("Notifications")
                .doc()
                .set({
                    GoalID: goal.ID,
                    GoalName: goal.Title,
                    Timestamp: timestamp,
                    SenderID: authO.ID,
                    SenderName: authO.UserName,
                    SenderPhoto: authO.Photo,
                    RecieverID: message.UserID,
                    MessageID: message.ID,
                    MessageBody: message.Message,
                    Read: false,
                    ID: id,
                    Header:`${authO.UserName} heeft aangegeven dat jouw bericht`,
                    SubHeader:`een bijdrage is aan het doel`,
                    Compagny: client,
                    Type: "Contribution"
                })
            })
            .then(() => {
                    db.collection("Goals")
                    .doc(goal.docid)
                    .update({
                        Contributions: firebase.firestore.FieldValue.arrayUnion(id)
                    })
                })
            .then(() => {
                db.collection("Messages")
                .doc(message.docid)
                .update({
                    Contributions: firebase.firestore.FieldValue.arrayUnion(id)
                })
            })
            .then(() => {
                users && users.forEach(user => {
                    db.collection("Users")
                    .doc(user.docid)
                    .update({
                        Contributions: firebase.firestore.FieldValue.arrayUnion(id)
                    })
                })
            })
        })
    }

    return (
        <div>
                <div className="like-goal-container">
                    <p>Je bent een bijdrage aan:</p>
                    <select onChange={goalHandler}>
                    <option>Selecteer een doel</option>
                    {allGoals && allGoals.map(goal =>(
                        <option key={goal.ID} value={goal.ID}>{goal.Title}</option>
                     ))}    
                       </select>
                    <button className="button-simple" onClick={sendGoalLike}>Verstuur</button>
                </div>        
        </div>
    )
}

export default LikeBar
