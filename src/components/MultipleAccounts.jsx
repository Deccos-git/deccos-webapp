import { useFirestore } from "../firebase/useFirestore"
import { db, timestamp } from "../firebase/config";
import uuid from 'react-uuid';
import { client } from "../hooks/Client";
import { useHistory } from "react-router-dom"

const MultipleAccounts = ({authO}) => {

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

    console.log(authO)
    console.log(compagnies)

      const registerUser = () => {

        db.collection("Users")
        .doc()
        .set({
            UserName: `${authO.ForName} ${authO.SurName}`,
            ForName: authO.ForName,
            SurName: authO.SurName,
            Compagny: client,
            Timestamp: timestamp,
            Email: authO.Email,
            Photo: authO.Photo,
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
