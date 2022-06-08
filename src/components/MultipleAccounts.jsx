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
    const [organisations, setOrganisations] = useState([])

    useEffect(() => {

        auth.onAuthStateChanged(User => {
            if(User){

                console.log(User)
      
              db.collection("Users")
              .where("Email", "==", User.email)
              .get()
              .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                  const name = doc.data().UserName
                  const organisations = doc.data().Compagny 

                    history.push(`/${organisations[0]}`)
                 
                })
              })
            } else if (User === null) {
              return history.push(`/Login`)
            }
          })

    },[])
    
    const colors = Colors()
    const history = useHistory();


    return (
        <div>
        </div>
    )
}

export default MultipleAccounts
