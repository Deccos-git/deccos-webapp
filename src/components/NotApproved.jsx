import { useFirestore, useFirestoreUser } from "../firebase/useFirestore"
import { useState, useEffect } from "react"
import { auth } from "../firebase/config"
import { db, timestamp } from "../firebase/config"
import { client } from "../hooks/Client"
import Location from "../hooks/Location"
import { useHistory } from "react-router-dom"
import uuid from 'react-uuid';
import GetYearMonth from '../hooks/GetYearMonth'
import firebase from 'firebase'
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
    const getYearMonth = GetYearMonth()
    const location = Location()[3]
    const colors = Colors()

    let route = ''

    if(location != undefined){
        route = location
    }

    const compagnies = useFirestore("CompagnyMeta")
    const banners = useFirestore('Banners')
    const users = useFirestoreUser(route)

    useEffect(() => {
        banners && banners.forEach(banner => {
            const header = banner.NewMember
            setHeaderPhoto(header)
        })

    }, [banners])

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
                .where("Compagny", "array-contains", client)
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
            setWebsite(comp.Website)
            setCommunityName(comp.CommunityName)
            setVerificationMethode(comp.VerificationMethode)
        })
    }, [compagnies])

    const verificationNotice = () => {

        console.log(verificationMethode, route, user, online)

        if(verificationMethode === "Admin" && route === '1' && user != null){ 
            return  <div>
                        <h2>Je account wacht nog op goedkeuring van een beheerder</h2>
                        <p>Zodra je account is goedgekeurd ontvang je een mailtje en kun je direct inloggen.</p>
                    </div>
        } else if (verificationMethode === "Admin" && route === '1' && user === null  && online === true){
            return  <div>
                        <h2>Je account wacht nog op goedkeuring van een beheerder</h2>
                        <p>Zodra je account is goedgekeurd ontvang je een mailtje en kun je direct inloggen.</p>
                    </div>
        } else if(verificationMethode === "Email" && route === '1' && user != null){
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
        } else if(verificationMethode === "Email" && route != '1' && user != null){
            return  <div>
                        <button onClick={verifiyAccount}>Verifieer je account</button>
                    </div>
        } else if(verificationMethode === "Email" && route != '1' && user === null){
            return  <div>
                        <h2>Je account moet nog worden geverificeerd</h2>
                        <p>Je hebt een email ontvangen op {authO.Email} waarmee je je account kunt verificeren.</p>
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
        else if(verificationMethode === "Email" && route === '1' && online === true && user === null){
            return  <div>
                        <h2>Je account moet nog worden geverificeerd</h2>
                        <p>Je hebt een email ontvangen op {authO.Email} waarmee je je account kunt verificeren.</p>
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
        console.log(authO.Email)
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

    const verifiyAccount = () => {
        console.log(route)
        console.log(headerPhoto)
        console.log(user)
        if(route != 1 && user != null && headerPhoto != null){
            console.log('test user')
            db.collection("Users")
            .where("ID", "==", route)
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
                db.collection("AllActivity")
                .doc()
                .set({
                    Title: `Welkom ${user.UserName}!`,
                    Type: "NewMember",
                    Compagny: client,
                    ButtonText: "Bekijk profiel",
                    Timestamp: timestamp,
                    ID: id,
                    Banner: headerPhoto,
                    Description: 'is lid geworden van de community',
                    Link: `/${client}/PublicProfile/${user.ID}`,
                    User: `${user.UserName}`,
                    UserPhoto: user.Photo,
                }) 
            })
            .then(() => {
                db.collection("MemberGraph")
                .where("Compagny", "==", client)
                .where('Month', '==', getYearMonth)
                .get()
                .then(querySnapshot => {

                    console.log(querySnapshot)

                    if(querySnapshot.empty === false){

                        querySnapshot.forEach(doc => {
                            console.log('Bestaat')

                            db.collection("MemberGraph")
                            .doc(doc.id)
                            .update({
                                Contributions: firebase.firestore.FieldValue.increment(1)
                            })
                            .then(() => {
                                console.log('link')
                                history.push(`/${client}/`)
                                window.location.reload()
                            })
                        })
                    } else if(querySnapshot.empty === true){
                        console.log("bestaat niet")
                        db.collection("MemberGraph")
                        .doc()
                        .set({
                            Month: getYearMonth,
                            Contributions: 1,
                            Compagny: client,
                            LastActive: timestamp,
                            ID: uuid()
                        })
                        .then(() => {
                            console.log('link')
                            history.push(`/${client}/`)
                            window.location.reload()
                        })
                    }
                })
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
                    <a href={`${website}`} target="_blank">Terug naar de website</a>
                </div>
            </div>
        </div>
    )
}

export default NotApproved
