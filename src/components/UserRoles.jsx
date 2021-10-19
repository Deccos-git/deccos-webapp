import RightSideBar from "./rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "./LeftSideBarAuthProfileFullScreen";
import { useFirestoreUsers, useFirestore } from "../firebase/useFirestore";
import { db } from "../firebase/config";
import { useState } from "react";
import MenuStatus from "../hooks/MenuStatus";
import { client } from '../hooks/Client';

const UserRoles = () => {
    const [user, setUser] = useState('')

    const [adminID, setAdminID] = useState("")
    const [adminName, setAdminName] = useState("")
    const [adminPhoto, setAdminPhoto] = useState("")
    const [authorID, setAuthorID] = useState("")
    const [authorName, setAuthorName] = useState("")
    const [authorPhoto, setAuthorPhoto] = useState("")


    const users = useFirestoreUsers(false)
    const admins = useFirestore('Admins')
    const authors = useFirestore('Authors')

    const menuState = MenuStatus()

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

        setAdminID(id)
        setAdminName(username)
        setAdminPhoto(photo)
    }

    const addAdmin = (e) => {

        e.target.innerText = 'Toegevoegd'

        db.collection("Admins")
        .doc()
        .set({
            Compagny: client,
            UserName: adminName,
            Photo: adminPhoto,
            UserID: adminID
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

        setAuthorID(id)
        setAuthorName(username)
        setAuthorPhoto(photo)
    }

    const addAuthor = (e) => {

        e.target.innerText = 'Toegevoegd'

        db.collection("Authors")
        .doc(authorID)
        .set({
            Compagny: client,
            UserName: authorName,
            Photo: authorPhoto,
            UserID: authorID
        })
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
                                <option data-id={user.ID} data-name={user.UserName} data-photo={user.Photo} key={user.ID}>{user.UserName}</option>
                            ))}
                        </select>
                        <div className="button-userrole-container">
                            <button className="button-simple" onClick={addAdmin}>Toevoegen</button>
                        </div>
                    </div>
                    <div >
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
                                <option data-id={user.ID} data-name={user.UserName} data-photo={user.Photo} key={user.ID}>{user.UserName}</option>
                            ))}
                        </select>
                        <div className="button-userrole-container">
                            <button className="button-simple" onClick={addAuthor}>Toevoegen</button>
                        </div>
                    </div>
                </div>
            </div>
            <RightSideBar/>
        </div>
    )
}

export default UserRoles
