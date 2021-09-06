import { useFirestore, useFirestoreID } from "../firebase/useFirestore"
import { useState } from "react"
import { db, timestamp } from "../firebase/config"
import firebase from "firebase"
import { client } from "../hooks/Client"
import uuid from 'react-uuid';

const LikeBar = ({auth, message}) => {

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
                SenderID: auth.ID,
                SenderName: auth.UserName,
                SenderPhoto: auth.Photo,
                RecieverID: goal.UserID,
                RecieverName: goal.User,
                RecieverPhoto: goal.UserPhoto,
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
                    SenderID: auth.ID,
                    SenderName: auth.UserName,
                    SenderPhoto: auth.Photo,
                    RecieverID: goal.UserID,
                    MessageID: message.ID,
                    MessageBody: message.Message,
                    Read: false,
                    ID: id,
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
                    {allGoals && allGoals.map(goal =>(
                        <option value={goal.ID}>{goal.Title}</option>
                     ))}    
                       </select>
                    <button className="button-simple" onClick={sendGoalLike}>Verstuur</button>
                </div>        
        </div>
    )
}

export default LikeBar
