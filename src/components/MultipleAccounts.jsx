import { useFirestore } from "../firebase/useFirestore"
import { db, timestamp, auth } from "../firebase/config";
import uuid from 'react-uuid';
import { client } from "../hooks/Client";
import { useHistory } from "react-router-dom"
import firebase from 'firebase';
import { useContext, useState, useEffect } from 'react';
import Colors from "../hooks/Colors";
import ButtonClicked from "../hooks/ButtonClicked";
import deccosLogo from '../images/deccos-logo.png'

const MultipleAccounts = () => {
    const [name, setName] = useState('')
    const [userDocID, setUserDocID] = useState('')
    const [userID, setUserID] = useState('')
    const [logo, setLogo] = useState('')
    const [website, setWebsite] = useState('')
    const [compagny, setCompagny] = useState('')

    
    const colors = Colors()
    const history = useHistory();

    auth.onAuthStateChanged(User => {
        if(User){

            db.collection("Users")
            .where("Email", "==", User.email)
            .get()
            .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const name = doc.data().UserName
                const ID = doc.data().ID
                const compagny = doc.data().Compagny

                setName(name)
                setUserDocID(doc.id)
                setUserID(ID)
                setCompagny(compagny)
            })
            })
        } else if (User === null) {
            return
        }
        })

        console.log(compagny)

    const selectCompagny = () => {

        

        if(compagny.length === 0){
            history.push(`/${compagny[0]}/ImpactProgress`)
        } else {

        }

    }

    return (
        <div>
            <header className="top-bar" style={{backgroundColor: colors.TopBarColor}}>
                <a href={`${website}`}><img src={deccosLogo} className="top-bar-logo" alt="logo" /></a>
            </header>
            <div style={{backgroundColor: colors.BackgroundColor}}>
                <div className="approval-message-container">
                    <h2>Hoi {name}</h2>
                    {selectCompagny()}
                </div>
            </div>
        </div>
    )
}

export default MultipleAccounts
