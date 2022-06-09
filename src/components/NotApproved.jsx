import { useFirestoreUserNotApproved } from "../firebase/useFirestore"
import { useState, useEffect } from "react"
import { db } from "../firebase/config"
import { type, client } from "../hooks/Client"
import { useHistory } from "react-router-dom"

const NotApproved = () => {
    const [user, setUser] = useState(null)

    const history = useHistory()

    const users = useFirestoreUserNotApproved(type && type)

    useEffect(() => {
        users && users.forEach(user => {
            setUser(user)
        })
    }, [users])

    const verificationNotice = () => {

        if(user === null){
            return  <div>
                        <h2>Je account is niet bekend bij Deccos</h2>
                        <p>Er is een probleem ontstaan waardoor je aacount niet kan wordne gevonden bij Deccos. 
                            Neem <a href="https://deccos.nl/Contact"></a> met ons op om het probleem op te lossen.</p>
                    </div>
        } else if(user != null){
            return  <div>
                        <button onClick={verifiyAccount}>Verifieer je account</button>
                    </div>
        }
    }

    const verifiyAccount = () => {

        if(user != null){
            db.collection("Users")
            .where("ID", "==", type)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {

                    db.collection("Users")
                    .doc(doc.id)
                    .update({
                        Approved: true
                    })
                    .then(() => {
                        history.push(`/`)
                        window.location.reload()
                    })
                })
            })
        }
    }

    return (
        <div id='not-approved-container'>
            <div className="approval-message-container">
                <img src={user && user.Photo} alt=""/>
                <h2>Hoi {user && user.UserName},</h2>
                <h1>Welkom bij Deccos</h1>
                {verificationNotice()}
            </div>
        </div>
    )
}

export default NotApproved
