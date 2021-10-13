import { useFirestore } from "../firebase/useFirestore"
import { useState, useEffect } from "react"
import { auth } from "../firebase/config"
import { db } from "../firebase/config"
import { client } from "../hooks/Client"
import Location from "../hooks/Location"
import { useHistory } from "react-router-dom"

const NotApproved = () => {
    const [authO, setAuthO] = useState("")
    const [showSendMailContainer, setshowSendMailContainer] = useState("flex")
    const [showMailSendContainer, setshowMailSendContainer] = useState("none")
    const [communityName, setCommunityName] = useState("")
    const [logo, setLogo] = useState("")
    const [website, setWebsite] = useState("")
    const [verificationMethode, setVerificationMethode] = useState("")

    const compagnies = useFirestore("CompagnyMeta")

    const history = useHistory()
    const route = Location()[3]

    useEffect(() => {
        auth.onAuthStateChanged(User =>{
            if(User){
                db.collection("Users")
                .where("Compagny", "==", client)
                .where("Email", "==", User.email)
                .onSnapshot(querySnapshot => {
                    querySnapshot.forEach (doc => {
                    setAuthO(doc.data())
                })
            })
            }
        })
    }, [auth])

    useEffect(() => {
        compagnies && compagnies.forEach(comp => {
            setLogo(comp.Logo)
            setWebsite(comp.Website)
            setCommunityName(comp.CommunityName)
            setVerificationMethode(comp.VerificationMethode)
        })
    }, [compagnies])

    const verificationNotice = () => {

        if(verificationMethode === "Admin"){ 
            return  <div>
                        <h2>Je account wacht nog op goedkeuring van een beheerder</h2>
                        <p>Zodra je account is goedgekeurd ontvang je een mailtje en kun je direct inloggen.</p>
                    </div>
        } else if(verificationMethode === "Email"){
            return  <div>
                        <h2>Je account moet nog worden geverificeerd</h2>
                        <p>Je hebt een email ontvangen waarmee je je account kunt verificeren.</p>
                        <div style={{display: showSendMailContainer}} className="no-email-button-container">
                            <p>Geen mail ontvangen?</p>
                            <button className="button-simple" onClick={noMailRecieved}>Klik hier</button>
                        </div>
                        <div style={{display: showMailSendContainer}} className="no-email-button-container">
                            <p>We hebben opnieuw een mail gestuurd naar {authO.Email}</p>
                            <p id="still-no-mail-notice">Nog niets ontvangen? Kijk in je spam of stuur een mailtje naar info@deccos.nl</p>
                        </div>
                    </div>
        }
    }

    const noMailRecieved = () => {
        verificationEmailEmail()
        setshowMailSendContainer("flex")
        setshowSendMailContainer("none") 
    }

    const verificationEmailEmail = () => {
        db.collection("Email").doc().set({
            to: [authO.Email],
            cc: "info@Deccos.nl",
            message: {
            subject: `Verificeer je account `,
            html: `Hallo ${authO.ForName} ${authO.SurName}, </br></br>
                Je hebt je aangemeld voor ${communityName} <br><br>

                Klik <a href="https://deccos.co/${client}/NotApproved/${authO.ID}">hier</a> om je account te verificeren.<br><br>
                
                Vriendelijke groet, </br></br>
                ${communityName} </br></br>
                <img src="${logo}" width="100px">`,
            Gebruikersnaam: `${authO.ForName} ${authO.SurName}`,
            Emailadres: authO.Email,
            Type: "Verification mail"
              }     
          });
    }

    const verifyEmail =() => {
        if(route != undefined){
            db.collection("Users")
            .where("ID", "==", route)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {

                    console.log(doc)

                    db.collection("Users")
                    .doc(doc.id)
                    .update({
                        Approved: true
                    })
                    .then(() => {
                        history.push(`/${client}/`)
                    })
                    .then(() => {
                        window.location.reload(false);
                    })
                })
            })
        }
    }
    verifyEmail()




    return (
        <div>
             <header className="top-bar">
                <a href={`${website}`}><img src={logo} className="top-bar-logo" alt="logo" /></a>
            </header>
            <div className="main">
                <div className="approval-message-container">
                    <img src={logo} alt="" />
                    <h1>Welkom bij {communityName}</h1>
                    {verificationNotice()}

                    <a href={`${website}`}>Terug naar de website</a>
                </div>
            </div>
        </div>
    )
}

export default NotApproved
