import { useFirestore } from "../firebase/useFirestore"
import { useState } from "react";
import { db, timestamp } from "../firebase/config";
import { auth } from "../firebase/config";
import uuid from 'react-uuid';
import { client } from "../hooks/Client";
import { useHistory } from "react-router-dom"

const MultipleAccounts = () => {
    const [user, setUser] = useState("")
    const compagnies = useFirestore("CompagnyMeta")

    const id = uuid()
    const history = useHistory()

    let logo = ""
    let website = ""
    let communityName = ""

    compagnies && compagnies.map(doc => {
        logo = doc.Logo
        website = doc.Website
        communityName = doc.CommunityName
    })

    auth.onAuthStateChanged(User => {
        if(User){
          db.collection("Users")
          .doc(User.uid)
          .get()
          .then(doc => {

            setUser(doc.data())
          
          })
        }
      })

      const registerUser = () => {

        db.collection("Users")
        .doc()
        .set({
            UserName: `${user.ForName} ${user.SurName}`,
            ForName: user.ForName,
            SurName: user.SurName,
            Compagny: client,
            Timestamp: timestamp,
            Email: user.Email,
            Photo: user.Photo,
            Channels: [],
            ID: id,
            Approved: false,
            Author: false,
            Admin: false,
            Deleted: false,
            About: "",
            Docid: "",
            Contributions: []
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
                    <h2>Hoi {user.UserName}</h2>
                    <h1>Welkom bij {communityName}</h1>
                    <h2>Wil je lid worden van onze community?</h2>
                    <button onClick={registerUser}>Ja, graag</button>
                </div>
            </div>
        </div>
    )
}

export default MultipleAccounts
