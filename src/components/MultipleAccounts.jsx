import { useFirestore } from "../firebase/useFirestore"
import { db, timestamp } from "../firebase/config";
import uuid from 'react-uuid';
import { client } from "../hooks/Client";
import { useHistory } from "react-router-dom"
import firebase from 'firebase';
import { useContext, useState, useEffect } from 'react';
import { Auth } from '../StateManagment/Auth';

const MultipleAccounts = () => {
    const [authO] = useContext(Auth)

    const compagnies = useFirestore("CompagnyMeta")

    const history = useHistory()

    console.log(authO)

    let logo = ""
    let website = ""
    let communityName = ""

    compagnies && compagnies.map(doc => {
        logo = doc.Logo
        website = doc.Website
        communityName = doc.CommunityName
    })

    const registerUser = () => {
        console.log(authO.docid)
        db.collection("Users")
        .doc(authO.docid)
        .update({
            Compagny: firebase.firestore.FieldValue.arrayUnion(authO.ID)
        })
        .then(() => {
            history.push(`/${client}/NotApproved`)
        })
      }

    return (
        <div>
            <header className="top-bar">
                <a href={`${website}`}><img src={logo} className="top-bar-logo" alt="logo" /></a>
            </header>
            <div className="main">
                <div className="approval-message-container">
                    <h2>Hoi {authO.UserName}</h2>
                    <h1>Welkom bij {communityName}</h1>
                    <h2>Wil je lid worden van onze community?</h2>
                    <button onClick={registerUser}>Ja, graag</button>
                </div>
            </div>
        </div>
    )
}

export default MultipleAccounts
