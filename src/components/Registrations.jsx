import RightSideBar from "./rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "./LeftSideBarAuthProfileFullScreen";
import { useFirestoreNotApproved } from "../firebase/useFirestore";
import { db, timestamp } from "../firebase/config";
import { client } from "../hooks/Client";
import { useFirestore } from "../firebase/useFirestore";
import firebase from "firebase";
import MenuStatus from "../hooks/MenuStatus";
import { useState, useEffect } from "react";

const Registrations = () => {
    const [verificationMethode, setVerificationMethode] = useState("")
    const [headerPhoto, setHeaderPhoto] = useState('')

    const notApprovedUsers = useFirestoreNotApproved()
    const compagny = useFirestore("CompagnyMeta")
    const banners = useFirestore('Banners')

    const menuState = MenuStatus()

    useEffect(() => {
        banners && banners.forEach(banner => {
            const header = banner.NewMember
            setHeaderPhoto(header)
        })
    }, [banners])

    let banner = null
    let docid = null
    let verificationAdmin = null
    let verificationEmail = null

    compagny && compagny.forEach(comp => {
        docid = comp.docid
        const verificationMethode = comp.VerificationMethode

        if(verificationMethode === "Admin"){
            verificationAdmin = "checked"
        } else if(verificationMethode === "Email"){
            verificationEmail = "checked"
        }
    })

    const approveAdmin = (e) => {
        const id = e.target.dataset.id
        const forname = e.target.dataset.forname
        const surname = e.target.dataset.surname 
        const photo = e.target.dataset.photo
        const userID = e.target.dataset.userid

        const memberMap = {
            UserName: `${forname} ${surname}`,
            Photo: photo,
            ID: id
        }

        db.collection("Users")
        .doc(id)
        .update({
            Approved: true
        })
        .then(() => {
            db.collection("AllActivity")
            .doc()
            .set({
                Title: `Welkom ${forname}!`,
                Type: "NewMember",
                Compagny: client,
                ButtonText: "Bekijk profiel",
                Timestamp: timestamp,
                ID: id,
                Banner: headerPhoto,
                Description: 'is lid geworden van de community',
                Link: `/${client}/PublicProfile/${userID}`,
                User: `${forname} ${surname}`,
                UserID: userID,
                UserPhoto: photo,
            }) 
        })
        .then(() => {
            db.collection("CompagnyMeta")
            .doc(docid)
            .update({
                Members: firebase.firestore.FieldValue.arrayUnion(memberMap)
            }) 
        })
        .then(() => {
            db.collection("Search")
            .doc()
            .set({
                Name: `${forname} ${surname}`,
                Type: 'Gebruiker',
                Compagny: client,
                Link: `PublicProfile/${userID}`
            })
        })
    }

    const verificationMethhodeHandler = (e) => {
        const methode = e.target.id 

        setVerificationMethode(methode)
    }

    const saveVerificationMethode = (e) => {

        db.collection("CompagnyMeta")
            .doc(docid)
            .update({
                VerificationMethode: verificationMethode
            })
            .then(() => {
                e.target.innerText = "Opgeslagen"
            })
    }

    return (
        <div className="main">
            <LeftSideBarAuthProfile />
            <LeftSideBarAuthProfileFullScreen/>
            <div className="profile profile-auth-profile" style={{display: menuState}}>
                <div className="settings-inner-container">
                    <div className="card-header">
                        <h1>Aanmelden</h1>
                        <p>Beheer de instellingen van het aanmeldproces</p>
                    </div>
                    <div className="divider">
                        <h3>Nieuwe aanmeldingen</h3>
                        {notApprovedUsers && notApprovedUsers.map(user => (
                            <div className="userrole-users-container" key={user.ID}>
                                <img src={user.Photo} alt="" />
                                <p>{user.UserName}</p>
                                <p 
                                className="userrole-users-approve-button" 
                                data-id={user.Docid}
                                data-userid={user.ID}
                                data-forname={user.ForName} 
                                data-surname={user.SurName}
                                data-photo={user.Photo}
                                onClick={approveAdmin}>
                                Goedkeuren
                                </p>
                            </div>
                        ))}
                    </div> 
                    <div className='divider'>
                        <div className="verification-methode-container">
                            <h3>Verificatie methode</h3>
                            <p>Selecteer de verificatiemethode voor nieuwe leden</p>
                            <div className="radio-input-container">
                                <input type="radio" name="verification-methode" id="Email" checked={verificationEmail} onChange={verificationMethhodeHandler} />
                                <label htmlFor="verifcation-methode">Verificatie via email</label>
                            </div>
                            <div className="radio-input-container">
                                <input type="radio" name="verification-methode" id="Admin" checked={verificationAdmin} onChange={verificationMethhodeHandler}/>
                                <label htmlFor="verifcation-methode">Verificatie door admin</label>
                            </div>
                            <button className="button-simple button-verification" onClick={saveVerificationMethode}>Opslaan</button>
                        </div>
                    </div>
                </div>   
            </div>
            <RightSideBar/>
        </div>
    )
}

export default Registrations
