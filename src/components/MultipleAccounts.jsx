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
    const [website, setWebsite] = useState('')
    const [name, setName] = useState('')
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

                  if(organisations.length === 0){
                    history.push(`/${organisations[0]}/ImpactProgress`)
                  } else {
                      setOrganisations(organisations)
                  }
      
                  setName(name)
      
                })
              })
            } else if (User === null) {
              return null
            }
          })

    },[])
    
    const colors = Colors()
    const history = useHistory();

    const compagnyLink = (e) => {

        const org = e.target.innerText

        history.push(`/${org}/ImpactProgress`)

        window.location.reload()
    }

    

    return (
        <div>
            <header className="top-bar" style={{backgroundColor: colors.TopBarColor}}>
                <a href={`${website}`}><img src={deccosLogo} className="top-bar-logo" alt="logo" /></a>
            </header>
            <div style={{backgroundColor: colors.BackgroundColor}}>
                <div className="approval-message-container">
                    <h2>Hoi {name}</h2>
                    <p><b>Selecteer je organisatie</b></p>
                    <ul>
                        {organisations && organisations.map(org => (
                            <li className='select-organisation' onClick={compagnyLink}>{org}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default MultipleAccounts
