import { useFirestore, useFirestoreUser } from "../firebase/useFirestore"
import { useState, useEffect } from "react"
import { auth } from "../firebase/config"
import { db, timestamp } from "../firebase/config"
import { pathID, client } from "../hooks/Client"
import { useHistory } from "react-router-dom"
import uuid from 'react-uuid';
import deccosLogo from '../images/deccos-logo.png'
import Colors from "../hooks/Colors";

const NotApproved = () => {
    const [authO, setAuthO] = useState('')
    const [user, setUser] = useState(null)
    const [online, setOnline] = useState(null)
    const [showSendMailContainer, setshowSendMailContainer] = useState("flex")
    const [showMailSendContainer, setshowMailSendContainer] = useState("none")
    const [communityName, setCommunityName] = useState("")
    const [logo, setLogo] = useState("")
    const [website, setWebsite] = useState("")
    const [headerPhoto, setHeaderPhoto] = useState(null)
    const [verificationMethode, setVerificationMethode] = useState("")

    const history = useHistory()
    const id = uuid()
    const colors = Colors()

    const compagnies = useFirestore("CompagnyMeta")
    const users = useFirestoreUser(pathID && pathID)


    useEffect(() => {
        users && users.forEach(user => {
            setUser(user)
        })
    }, [users])

    useEffect(() => {
        auth.onAuthStateChanged(User =>{
            if(User){
                setOnline(true)
                db.collection("Users")
                .where("Email", "==", User.email)
                .onSnapshot(querySnapshot => {
                    querySnapshot.forEach (doc => {
                    setAuthO(doc.data())
                })
            })
            } else {
                setOnline(null)
            }
        })
    }, [compagnies])

    useEffect(() => {
        compagnies && compagnies.forEach(comp => {
            setLogo(comp.Logo)
            setCommunityName(comp.CommunityName)
        })
    }, [compagnies])

    const verificationNotice = () => {

        console.log(pathID, user, online)

        if(user === null){
            return  <div>
                        <h2>Je account moet nog worden geverificeerd</h2>
                        <p>Je hebt een email ontvangen op {authO.Email} waarmee je je account kunt verificeren.</p>
                        <div style={{display: showSendMailContainer}} className="no-email-button-container">
                            <p>Geen mail ontvangen?</p>
                            <button className="button-simple" onClick={noMailRecieved}>Opnieuw versturen</button>
                        </div>
                        <div style={{display: showMailSendContainer}} className="no-email-button-container">
                            <p>We hebben opnieuw een mail gestuurd naar {authO.Email}</p>
                            <p id="still-no-mail-notice">Nog niets ontvangen? Kijk in je spam of stuur een mailtje naar info@deccos.nl</p>
                        </div>
                    </div>
        } else if(user != null){
            return  <div>
                        <button onClick={verifiyAccount}>Verifieer je account</button>
                    </div>
        }
    }

    const noMailRecieved = () => {
        verificationEmail()
        setshowMailSendContainer("flex")
        setshowSendMailContainer("none") 
    }

    const verificationEmail = () => {
        console.log(authO.Email)
        db.collection("Email").doc().set({
            to: [authO.Email],
            cc: "info@Deccos.nl",
            message: {
            subject: `Verificeer je account `,
            html: `Hallo ${authO.ForName} ${authO.SurName}, </br></br>
                Je hebt je aangemeld voor ${communityName} <br><br>

                Klik <a href="https://deccos.co/${pathID}/NotApproved/${authO.ID}">hier</a> om je account te verificeren.<br><br>
                
                Vriendelijke groet, </br></br>
                Het Deccos team </br></br>
                <img src="${deccosLogo}" width="100px">`,
            Gebruikersnaam: `${authO.ForName} ${authO.SurName}`,
            Emailadres: authO.Email,
            Type: "Verification mail"
              }     
          });
    }

    const verifiyAccount = () => {

        if(user != null){
            console.log('test user')
            db.collection("Users")
            .where("ID", "==", pathID)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {

                    db.collection("Users")
                    .doc(doc.id)
                    .update({
                        Approved: true
                    })
                })
            })
            .then(() => {
                history.push(`/${client}/Login`)
            })
        }
    }

    return (
        <div id='not-approved-container'>
             <header className="top-bar" style={{backgroundColor: colors.TopBarColor}}>
                <a href={`${website}`}><img src={logo} className="top-bar-logo" alt="logo" /></a>
            </header>
            <div className="main" style={{backgroundColor: colors.BackgroundColor}}>
                <div className="approval-message-container">
                    <img src={authO.Photo} alt=""/>
                    <h2>Hoi {authO.UserName},</h2>
                    <h1>Welkom bij {communityName}</h1>
                    {verificationNotice()}
                </div>
            </div>
        </div>
    )
}

export default NotApproved
