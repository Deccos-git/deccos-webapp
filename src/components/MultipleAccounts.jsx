import { useFirestore } from "../firebase/useFirestore"
import { db, timestamp, auth } from "../firebase/config";
import uuid from 'react-uuid';
import { client } from "../hooks/Client";
import { useHistory } from "react-router-dom"
import firebase from 'firebase';
import { useContext, useState, useEffect } from 'react';
import Colors from "../hooks/Colors";
import ButtonClicked from "../hooks/ButtonClicked";

const MultipleAccounts = () => {
    const [name, setName] = useState('')
    const [userDocID, setUserDocID] = useState('')
    const [userID, setUserID] = useState('')
    const [logo, setLogo] = useState('')
    const [website, setWebsite] = useState('')
    const [communityName, setCommunityName] = useState('')

    const compagnies = useFirestore("CompagnyMeta")
    
    const colors = Colors()

    auth.onAuthStateChanged(User => {
        if(User){

            db.collection("Users")
            .where("Email", "==", User.email)
            .get()
            .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const name = doc.data().UserName
                const ID = doc.data().ID

                setName(name)
                setUserDocID(doc.id)
                setUserID(ID)
            })
            })
        } else if (User === null) {
            return
        }
        })

    useEffect(() => {

        compagnies && compagnies.forEach(doc => {
            setLogo(doc.Logo)
            setWebsite(doc.Website)
            setCommunityName(doc.CommunityName)
        })

    },[compagnies])

    const registerUser = (e) => {

        ButtonClicked(e, 'Aangemeld')

        db.collection("Users")
        .doc(userDocID)
        .update({
            Compagny: firebase.firestore.FieldValue.arrayUnion(client)
        })
        .then(() => {
            window.location.reload()
        })
      }

    return (
        <div>
            <header className="top-bar" style={{backgroundColor: colors.TopBarColor}}>
                <a href={`${website}`}><img src={logo} className="top-bar-logo" alt="logo" /></a>
            </header>
            <div className="main" style={{backgroundColor: colors.BackgroundColor}}>
                <div className="approval-message-container">
                    <h2>Hoi {name}</h2>
                    <h1>Welkom bij {communityName}</h1>
                    <h2>Wil je lid worden van onze online omgeving?</h2>
                    <button onClick={registerUser}>Aanmelden</button>
                </div>
            </div>
        </div>
    )
}

export default MultipleAccounts
