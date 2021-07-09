import { useState } from 'react';
import { auth, db, timestamp } from "../firebase/config";
import { client } from "../hooks/Client";
import uuid from 'react-uuid';
import firebase from 'firebase'


const RegisterUser = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordRepeat, setPasswordRepeat] = useState("")
    const [forname, setForname] = useState("")
    const [surname, setSurname] = useState("")
    const [photo, setPhoto] = useState("")

    const id = uuid()

    const fornameHandler = (e) => {
        const forname = e.target.value

        setForname(forname)
    }

    const surnameHandler = (e) => {
        const surname = e.target.value

        setSurname(surname)
    }

    const emailHandler = (e) => {
        const email = e.target.value

        setEmail(email)
    }

    const passwordHandler = (e) => {
        const password = e.target.value

        setPassword(password)
    }

    const passwordRepeatHandler = (e) => {
        const passwordRepeat = e.target.value

        setPasswordRepeat(passwordRepeat)
    }

    const photoHandler = (e) => {
        const photo = e.target.value

        setPhoto(photo)
    }

    const checkHandler = () => {
        if(password === passwordRepeat){
            registerHandler()
        } else {
            alert('De paswoorden zijn niet gelijk')
        }
    }

    const registerHandler = () => {
    
        auth
        .createUserWithEmailAndPassword(email, password)
        .then((cred) => {
            db.collection("Users")
            .doc(cred.user.uid)
            .set({
                UserName: `${forname} ${surname}`,
                ForName: forname,
                SurName: surname,
                Compagny: client,
                Timestamp: timestamp,
                Email: email,
                Photo: photo,
                Channels: [],
                ID: id
            })
        })
        .then(() => {
            db.collection("AllActivity")
            .doc()
            .set({
                Title: forname,
                Type: "NewMember",
                Compagny: client,
                Timestamp: timestamp,
                ID: id
            }) 
        })
        .then(() => {
            db.collection("Compagny")
            .doc()
            .set({
                Members: firebase.firestore.FieldValue.arrayUnion(`${forname} ${surname}`)
            }) 
        })
    }

    return (
        <div className="login-container">
            <h2>Register</h2>
            <form>
                <p>Voornaam*</p>
                <input onChange={fornameHandler} type="text" placeholder="Schrijf hier je voornaam" />
                <p>Achternaam</p>
                <input onChange={surnameHandler} type="text" placeholder="Schrijf hier je achternaam" />
                <p>Emailadres*</p>
                <input onChange={emailHandler} type="email" placeholder="Schrijf hier je achternaam" />
                <p>Wachtwoord*</p>
                <input onChange={passwordHandler} type="password" placeholder="Schrijf hier je wachtwoord" />
                <p>Herhaal je wachtwoord*</p>
                <input onChange={passwordRepeatHandler} type="password" placeholder="Herhaal hier je wachtwoord" />
                <p>Profielfoto</p>
                <input onChange={photoHandler} type="file" />
            </form>
            <div className="button-container">
                <button onClick={checkHandler}>Aanmelden</button>
            </div>
            
        </div>
    )
}

export default RegisterUser
