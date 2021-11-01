import RightSideBar from "./rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "./LeftSideBarAuthProfileFullScreen";
import { useFirestoreNotApproved, useFirestoreSubscriptionsNotApproved } from "../firebase/useFirestore";
import { db, timestamp } from "../firebase/config";
import { client } from "../hooks/Client";
import { useFirestore } from "../firebase/useFirestore";
import firebase from "firebase";
import MenuStatus from "../hooks/MenuStatus";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom"

const Registrations = () => {
    const [verificationMethode, setVerificationMethode] = useState("")
    const [headerPhoto, setHeaderPhoto] = useState('')
    const [communityNameDB, setCommunityNameDB] = useState("")
    const [logoDB, setLogoDB] = useState("")

    const notApprovedUsers = useFirestoreNotApproved()
    const notApprovedGroups = useFirestoreSubscriptionsNotApproved('Subscriptions')
    const compagny = useFirestore("CompagnyMeta")
    const banners = useFirestore('Banners')

    const menuState = MenuStatus()
    const history = useHistory()

    useEffect(() => {
        compagny && compagny.forEach(comp => {
            setCommunityNameDB(comp.CommunityName)
            setLogoDB(comp.Logo)
        })
    }, [compagny])

    useEffect(() => {
        banners && banners.forEach(banner => {
            const header = banner.NewMember
            setHeaderPhoto(header)
        })
    }, [banners])

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
        const email = e.target.dataset.email

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
        .then(() => {
            db.collection("Email").doc().set({
                to: email,
                cc: "info@Deccos.nl",
                message: {
                subject: `Je account is goedgekeurd voor ${communityNameDB}`,
                html: `
                    Beste ${forname} ${surname}, <br><br>
    
                    Je aanmelding voor ${communityNameDB} is goedgekeurd door een beheerder. <br><br>
    
                    Je kunt vanaf nu <a href='https://deccos.co/${client}'>hier</a> inloggen.<br><br>
    
                    Vriendelijke groet, </br></br>
                    ${communityNameDB} </br></br>
                    <img src="${logoDB}" width="100px">
                    
                    `,
                Gebruikersnaam: `${forname} ${surname}`,
                Emailadres: email,
                Type: "Verification mail email"
                  }     
              });
        })
    }

    const approveGroupMember = (e) => {
        const id = e.target.dataset.id
        const email = e.target.dataset.email
        const name = e.target.dataset.name
        const groupName = e.target.dataset.groupname 
        const groupID = e.target.dataset.groupid

        db.collection('Subscriptions')
        .doc(id)
        .update({
            Approved: true
        })
        .then(() => {
            db.collection("Email").doc().set({
                to: email,
                cc: "info@Deccos.nl",
                message: {
                subject: `Je aanvraag voor groep ${groupName} is goedgekeurd op ${communityNameDB}`,
                html: `
                    Beste ${name}, <br><br>
    
                    Je aanvraag voor groep ${groupName} is goedgekeurd op ${communityNameDB}. <br><br>
    
                    Bekijk de groep <a href='https://deccos.co/${client}GroupLanding/${groupID}'>hier</a>.<br><br>
    
                    Vriendelijke groet, </br></br>
                    ${communityNameDB} </br></br>
                    <img src="${logoDB}" width="100px">
                    
                    `,
                Gebruikersnaam: `${name}`,
                Emailadres: email,
                Type: "Verification mail email"
                  }     
              });
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

    const linkToUser = (e) => {
        const id = e.target.dataset.userid

        history.push(`/${client}/PublicProfile/${id}`)
    }

    const linkToGroup = (e) => {
        const id = e.target.dataset.groupid

        history.push(`/${client}/GroupLanding/${id}`)
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
                    <div className='divider'>
                        <div className="verification-methode-container">
                            <h3>Verificatie methode voor community</h3>
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
                    <div className="divider">
                        <h3>Nieuwe aanmeldingen voor community</h3>
                        {notApprovedUsers && notApprovedUsers.map(user => (
                            <div className="userrole-users-container" key={user.ID}>
                                <img className='pointer' src={user.Photo} alt="" data-userid={user.ID} onClick={linkToUser} />
                                <p className='pointer' data-userid={user.ID} onClick={linkToUser}>{user.UserName}</p>
                                <p 
                                className="userrole-users-approve-button" 
                                data-id={user.Docid}
                                data-userid={user.ID}
                                data-forname={user.ForName} 
                                data-surname={user.SurName}
                                data-photo={user.Photo}
                                data-email={user.Email}
                                onClick={approveAdmin}>
                                Goedkeuren
                                </p>
                            </div>
                        ))}
                    </div> 
                    <div className='divider'>
                        <h3>Nieuwe aanmeldingen voor groepen</h3>
                        {notApprovedGroups && notApprovedGroups.map(group=> (
                             <div className="userrole-users-container" key={group.ID}>
                                <img className='pointer' src={group.UserPhoto} alt="" data-userid={group.UserID} onClick={linkToUser} />
                                <p className='pointer' onClick={linkToUser} data-userid={group.UserID}>{group.UserName}</p>
                                <p>&nbsp;wil lid worden van&nbsp;</p>
                                <p className='pointer' onClick={linkToGroup}><u data-groupid={group.SubID}>{group.SubName}</u></p>
                                <p 
                                className="userrole-users-approve-button" 
                                data-id={group.docid}
                                data-email={group.UserEmail}
                                data-name={group.UserName}
                                data-groupname={group.SubName}
                                data-groupid={group.SubID}
                                onClick={approveGroupMember}>
                                Goedkeuren
                                </p>
                            </div>
                        ))}

                    </div>
                </div>   
            </div>
            <RightSideBar/>
        </div>
    )
}

export default Registrations
