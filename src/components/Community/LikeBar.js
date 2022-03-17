import { useFirestore, useFirestoreID } from "../../firebase/useFirestore"
import { useState, useContext } from "react"
import { db, timestamp } from "../../firebase/config"
import firebase from "firebase"
import { client } from "../../hooks/Client"
import uuid from 'react-uuid';
import { Auth } from '../../StateManagment/Auth';

const LikeBar = ({message}) => {
    const [authO] = useContext(Auth)
    const [goalID, setGoalID] = useState("")

    const allGoals = useFirestore("Goals")
    const compagny = useFirestore("CompagnyMeta")

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

    const sendGoalLike = (e) => {

        e.target.innerHTML = "Verstuurd"

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
                .then (() => {
                    sendAsMail()
                })
            })
    }

    let communityName = ""
    let logo = ""
    let email = ""

    compagny && compagny.forEach(comp => {
        communityName = comp.CommunityName
        logo = comp.Logo
    })

    const sendAsMail = () => {

        db.collection("Email").doc().set({
            to: [message.Email],
            cc: "info@Deccos.nl",
            message: {
            subject: `Je hebt een nieuwe bijdrage ontvangen in ${communityName}.`,
            html: `Hallo ${message.User}, </br></br>

                Je hebt een nieuwe bijdrage ontvangen in ${communityName}.</br></br>

                Bekijk de bijdrage <a href="https://www.deccos.co/${client}/Contributions/${userID}"><u>hier</u></a>.<br><br>
                
                Vriendelijke groet, </br></br>
                ${communityName} </br></br>
                <img src="${logo}" width="100px">`,
            Gebruikersnaam: `${message.User}`,
            Emailadres: message.Email,
            Type: "Chat"
              }     
          }); 
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
