import RightSideBar from "./rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "./LeftSideBarAuthProfileFullScreen";
import { useFirestoreUsers, useFirestore } from "../firebase/useFirestore";
import { db } from "../firebase/config";
import { useState, useEffect } from "react";
import MenuStatus from "../hooks/MenuStatus";
import { client } from '../hooks/Client';

const UserRoles = () => {
    const [adminID, setAdminID] = useState("")
    const [adminName, setAdminName] = useState("")
    const [adminPhoto, setAdminPhoto] = useState("")
    const [adminEmail, setAdminEmail] = useState("")
    const [authorID, setAuthorID] = useState("")
    const [authorName, setAuthorName] = useState("")
    const [authorPhoto, setAuthorPhoto] = useState("")
    const [authorEmail, setAuthorEmail] = useState("")
    const [impacteerID, setImpacteerID] = useState("")
    const [impacteerName, setImpacteerName] = useState("")
    const [impacteerPhoto, setImpacteerPhoto] = useState("")
    const [impacteerEmail, setImpacteerEmail] = useState("")
    const [communityName, setCommunityName] = useState('')
    const [communityLogo, setCommunityLogo] = useState('')
    const [displayImpact, setDisplayImpact] = useState('')

    const users = useFirestoreUsers(false)
    const admins = useFirestore('Admins')
    const authors = useFirestore('Authors')
    const impacteers = useFirestore('Impacteers')
    const compagny = useFirestore("CompagnyMeta")

    const menuState = MenuStatus()

    useEffect(() => {
        compagny && compagny.forEach(comp => {
            setDisplayImpact(comp.Impact)
        })
    },[compagny])

    useEffect(() => {
       compagny && compagny.forEach(comp => {
        setCommunityName(comp.CommunityName)
        setCommunityLogo(comp.Logo)
       })
    }, [compagny])

    const deleteAdmin = (e) => {

        const id = e.target.dataset.id

        db.collection("Admins")
        .doc(id)
        .delete()
    }

    const adminHandler = (e) => {
        const id = e.target.options[e.target.selectedIndex].dataset.id
        const photo = e.target.options[e.target.selectedIndex].dataset.photo
        const username = e.target.options[e.target.selectedIndex].dataset.name
        const email = e.target.options[e.target.selectedIndex].dataset.email

        setAdminID(id)
        setAdminName(username)
        setAdminPhoto(photo)
        setAdminEmail(email)
    }

    const addAdmin = (e) => {

        e.target.innerText = 'Toegevoegd'

        db.collection("Admins")
        .doc()
        .set({
            Compagny: client,
            UserName: adminName,
            Photo: adminPhoto,
            UserID: adminID,
            Email: adminEmail
        })
        .then(() => {
            db.collection("Email").doc().set({
                to: [authorEmail],
                cc: "info@Deccos.nl",
                message: {
                subject: `Je bent als beheerder toegevoegd op ${communityName}`,
                html: `Hallo ${authorName}, </br></br>
                    Je bent door een beheerder van ${communityName} toegevoegd als beheerder.<br><br>
    
                    Dat betekent dat je vanaf nu:<br><br>
    
                    <ul>
                        <li>Algemene instellingen van de community kunt aanpassen</li>
                        <li>Analytics (statistieken) van de community kunt inzien</li>
                        <li>Leden kunt verwijderen</li>
                        <li>Gebruikersrollen kan wijzigen</li>
                        <li>Nieuwe aanmeldingen voor de community kan goedkeuren</li>
                        <li>Instellingen voor kanalen, groepen en doelen aanpassen</li>
                        <li>De welkomsboodschap aanpassen</li>
                    </ul><br><br>
                    
                    Vriendelijke groet, </br></br>
                    ${communityName} </br></br>
                    <img src="${communityLogo}" width="100px">`,
                Gebruikersnaam: `${authorName}`,
                Emailadres: authorEmail,
                Type: "Verification mail"
                  }     
              });
        })
    }

    const deleteAuthor = (e) => {

        const id = e.target.dataset.id

        db.collection("Authors")
        .doc(id)
        .delete()
    }

    const authorHandler = (e) => {
        const id = e.target.options[e.target.selectedIndex].dataset.id
        const photo = e.target.options[e.target.selectedIndex].dataset.photo
        const username = e.target.options[e.target.selectedIndex].dataset.name
        const email = e.target.options[e.target.selectedIndex].dataset.email

        setAuthorID(id)
        setAuthorName(username)
        setAuthorPhoto(photo)
        setAuthorEmail(email)
    }

    const addAuthor = (e) => {

        e.target.innerText = 'Toegevoegd'

        db.collection("Authors")
        .doc()
        .set({
            Compagny: client,
            UserName: authorName,
            Photo: authorPhoto,
            UserID: authorID,
            Email: authorEmail
        })
        .then(() => {
            db.collection("Email").doc().set({
                to: [authorEmail],
                cc: "info@Deccos.nl",
                message: {
                subject: `Je bent als auteur toegevoegd op ${communityName}`,
                html: `Hallo ${authorName}, </br></br>
                    Je bent door een beheerder van ${communityName} toegevoegd als auteur.<br><br>
    
                    Dat betekent dat je vanaf nu:<br><br>
    
                    <ul>
                        <li>Artikelen, events, neuwsberichten en andere kanaalitems kunt toevoegen</li>
                        <li>Artikelen, events, neuwsberichten en andere kanaalitems kunt aanpassen</li>
                    </ul><br><br>
                    
                    Vriendelijke groet, </br></br>
                    ${communityName} </br></br>
                    <img src="${communityLogo}" width="100px">`,
                Gebruikersnaam: `${authorName}`,
                Emailadres: authorEmail,
                Type: "Verification mail"
                  }     
              });
        })
    }

    const deleteImpacteer = (e) => {

        const id = e.target.dataset.id

        db.collection("Impacteers")
        .doc(id)
        .delete()
    }

    const impacteerHandler = (e) => {
        const id = e.target.options[e.target.selectedIndex].dataset.id
        const photo = e.target.options[e.target.selectedIndex].dataset.photo
        const username = e.target.options[e.target.selectedIndex].dataset.name
        const email = e.target.options[e.target.selectedIndex].dataset.email

        setImpacteerID(id)
        setImpacteerName(username)
        setImpacteerPhoto(photo)
        setImpacteerEmail(email)
    }

    const addImpacteer= (e) => {

        e.target.innerText = 'Toegevoegd'

        db.collection("Impacteers")
        .doc()
        .set({
            Compagny: client,
            UserName: impacteerName,
            Photo: impacteerPhoto,
            UserID: impacteerID,
            Email: impacteerEmail
        })
        .then(() => {
            db.collection("Email").doc().set({
                to: [authorEmail],
                cc: "info@Deccos.nl",
                message: {
                subject: `Je bent als impacteer toegevoegd op ${communityName}`,
                html: `Hallo ${authorName}, </br></br>
                    Je bent door een beheerder van ${communityName} toegevoegd als impacteer.<br><br>
    
                    Dat betekent dat je vanaf nu:<br><br>
    
                    <ul>
                        <li>Het impactpad van de community kunt bekijken</li>
                        <li>Doelen van de community kunt bekijken</li>
                        <li>Goal likes geven</li>
                    </ul>
                    <br><br>
                    
                    Vriendelijke groet, </br></br>
                    ${communityName} </br></br>
                    <img src="${communityLogo}" width="100px">`,
                Gebruikersnaam: `${authorName}`,
                Emailadres: authorEmail,
                Type: "Verification mail"
                  }     
              });
        })
    }

    const showImpact = () => {
        if(displayImpact === true){
            return 'block'
        } else if (displayImpact === false){
            return 'none'
        }
    }

    return (
        <div className="main">
            <LeftSideBarAuthProfile />
            <LeftSideBarAuthProfileFullScreen/>
            <div className="profile profile-auth-profile" style={{display: menuState}}>
                <div className="settings-inner-container">
                    <div className="divider card-header">
                        <h1>Gebruikersrollen</h1>
                        <p>Pas de gebruikersrollen van je community aan</p>
                    </div>
                    <div className="divider">
                        <h3>Admin</h3>
                        <p>De admin rol geeft toegang tot de volgende beheersopties:</p>
                        <ul>
                            <li>Algemene instellingen van de community aanpassen</li>
                            <li>Analytics (statistieken) van de community inzien</li>
                            <li>Leden verwijderen</li>
                            <li>Gebruikersrollen wijzigen</li>
                            <li>Nieuwe aanmeldingen voor de community goedkeuren</li>
                            <li>Instellingen voor kanalen, groepen en doelen aanpassen</li>
                            <li>De welkomsboodschap aanpassen</li>
                        </ul>
                        <h4>Leden met rol admin</h4>
                        {admins && admins.map(admin => (
                            <div className="userrole-users-container" key={admin.ID}>
                                <img src={admin.Photo} alt="" />
                                <p>{admin.UserName}</p>
                                <p className="userrole-users-delete-button" data-id={admin.docid} onClick={deleteAdmin}>Verwijderen</p>
                            </div>
                        ))}
                        <h4>Admin toevoegen</h4>
                        <select className="userrole-select" name="" id="" onChange={adminHandler}>
                            <option value="">--- Selecteer ---</option>
                            {users && users.map(user => (
                                <option data-id={user.ID} data-name={user.UserName} data-photo={user.Photo} data-email={user.Email} key={user.ID}>{user.UserName}</option>
                            ))}
                        </select>
                        <div className="button-userrole-container">
                            <button className="button-simple" onClick={addAdmin}>Toevoegen</button>
                        </div>
                    </div>
                    <div className='divider'>
                        <h3>Auteur</h3>
                        <p>De auteur rol geeft toegang tot de volgende beheersopties:</p>
                        <ul>
                        <li>Toevoegen van artikelen, events, neuwsberichten en andere kanaalitems</li>
                        </ul>
                        <h4>Leden met rol auteur</h4>
                        {authors && authors.map(author => (
                            <div className="userrole-users-container" key={author.ID}>
                                <img src={author.Photo} alt="" />
                                <p>{author.UserName}</p>
                                <p className="userrole-users-delete-button" data-id={author.docid} onClick={deleteAuthor}>Verwijderen</p>
                            </div>
                        ))}
                        <h4>Auteur toevoegen</h4>
                        <select className="userrole-select" name="" id="" onChange={authorHandler}>
                            <option value="">--- Selecteer ---</option>
                            {users && users.map(user => (
                                <option data-id={user.ID} data-name={user.UserName} data-photo={user.Photo} data-email={user.Email} key={user.ID}>{user.UserName}</option>
                            ))}
                        </select>
                        <div className="button-userrole-container">
                            <button className="button-simple" onClick={addAuthor}>Toevoegen</button>
                        </div>
                    </div>
                    <div style={{display: showImpact()}}>
                        <h3>Impacteer</h3>
                        <p>De impacteer rol geeft toegang tot de volgende opties:</p>
                        <ul>
                            <li>Doelen bekijken</li>
                            <li>Goal likes geven</li>
                            <li>Impactpad bekijken</li>
                        </ul>
                        <h4>Leden met rol impacteer</h4>
                        {impacteers && impacteers.map(impacteer => (
                            <div className="userrole-users-container" key={impacteer.ID}>
                                <img src={impacteer.Photo} alt="" />
                                <p>{impacteer.UserName}</p>
                                <p className="userrole-users-delete-button" data-id={impacteer.docid} onClick={deleteImpacteer}>Verwijderen</p>
                            </div>
                        ))}
                        <h4>Impacteer toevoegen</h4>
                        <select className="userrole-select" name="" id="" onChange={impacteerHandler}>
                            <option value="">--- Selecteer ---</option>
                            {users && users.map(user => (
                                <option data-id={user.ID} data-name={user.UserName} data-photo={user.Photo} data-email={user.Email} key={user.ID}>{user.UserName}</option>
                            ))}
                        </select>
                        <div className="button-userrole-container">
                            <button className="button-simple" onClick={addImpacteer}>Toevoegen</button>
                        </div>
                    </div>
                </div>
            </div>
            <RightSideBar/>
        </div>
    )
}

export default UserRoles
