import { useFirestore, useFirestoreID } from "../firebase/useFirestore"
import { useState } from "react"
import { db, timestamp } from "../firebase/config"
import firebase from "firebase"

const LikeBar = ({auth, message}) => {

    const [goalID, setGoalID] = useState("")

    const allGoals = useFirestore("Goals")

    const goalHandler = (e) => {

        const select = e.target

        const option = select.options
        const selected = option[option.selectedIndex].value

        setGoalID(selected)

    }

    const goals = useFirestoreID("Goals", goalID)

    const userID = message.UserID

    const users = useFirestoreID("Users", userID)

    const sendGoalLike = () => {

        goals && goals.forEach(goal => {
            db.collection("Likes")
            .doc()
            .set({
                GoalID: goal.ID,
                Timestamp: timestamp,
                Sender: auth.ID,
                Reciever: goal.UserID,
                MessageID: message.ID
            })
            .then(() => {
                    db.collection("Goals")
                    .doc(goal.docid)
                    .update({
                        Likes: firebase.firestore.FieldValue.increment(1)
                    })
                })
            .then(() => {
                db.collection("Messages")
                .doc(message.docid)
                .update({
                    Likes: firebase.firestore.FieldValue.increment(1)
                })
            })
            .then(() => {
                users && users.forEach(user => {
                    db.collection("Users")
                    .doc(user.docid)
                    .update({
                        Likes: firebase.firestore.FieldValue.increment(1)
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
