import RightSideBar from "./rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "./LeftSideBarAuthProfileFullScreen";
import { useFirestore } from "../firebase/useFirestore";
import { db } from "../firebase/config";
import { useState } from "react";
import MenuStatus from "../hooks/MenuStatus";

const UserRoles = () => {
    const [adminID, setAdminID] = useState("")
    const [authorID, setAuthorID] = useState("")

    const users = useFirestore("Users")

    const menuState = MenuStatus()

    const admins = () => {

        const adminArray = []

        users && users.forEach(user => {
            if(user.Admin === true){
                const userMeta ={
                    UserName: user.UserName,
                    Photo: user.Photo,
                    ID: user.Docid
                }

                adminArray.push(userMeta)
            } 
        })

        return adminArray

    } 
    
    const authors = () => {

        const authorArray = []

        users && users.forEach(user => {
            if(user.Author === true){
                const userMeta ={
                    UserName: user.UserName,
                    Photo: user.Photo,
                    ID: user.Docid
                }

                authorArray.push(userMeta)
            } 
        })

        return authorArray

    }  

    const deleteAdmin = (e) => {

        const id = e.target.dataset.id

        db.collection("Users")
        .doc(id)
        .update({
            Admin: false
        })
    }

    const adminHandler = (e) => {
        const id = e.target.value

        setAdminID(id)
    }

    const addAdmin = () => {

        db.collection("Users")
        .doc(adminID)
        .update({
            Admin: true
        })

    }

    const deleteAuthor = (e) => {

        const id = e.target.dataset.id

        db.collection("Users")
        .doc(id)
        .update({
            Author: false
        })
    }

    const authorHandler = (e) => {
        const id = e.target.value

        setAuthorID(id)
    }

    const addAuthor = () => {

        db.collection("Users")
        .doc(authorID)
        .update({
            Author: true
        })

    }

    return (
        <div className="main">
            <LeftSideBarAuthProfile />
            <LeftSideBarAuthProfileFullScreen/>
            <div className="profile" style={{display: menuState}}>
                <div className="divider card-header">
                    <h2>Gebruikersrollen</h2>
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
                    {admins().map(admin => (
                        <div className="userrole-users-container" key={admin.ID}>
                            <img src={admin.Photo} alt="" />
                            <p>{admin.UserName}</p>
                            <p className="userrole-users-delete-button" data-id={admin.ID} onClick={deleteAdmin}>Verwijderen</p>
                        </div>
                    ))}
                    <h4>Admin toevoegen</h4>
                    <select className="userrole-select" name="" id="" onChange={adminHandler}>
                        <option value="">--- Selecteer ---</option>
                        {users && users.map(user => (
                            <option value={user.Docid} key={user.ID}>{user.UserName}</option>
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
                    {authors().map(author => (
                        <div className="userrole-users-container" key={author.ID}>
                            <img src={author.Photo} alt="" />
                            <p>{author.UserName}</p>
                            <p className="userrole-users-delete-button" data-id={author.ID} onClick={deleteAuthor}>Verwijderen</p>
                        </div>
                    ))}
                    <h4>Auteur toevoegen</h4>
                    <select className="userrole-select" name="" id="" onChange={authorHandler}>
                        <option value="">--- Selecteer ---</option>
                        {users && users.map(user => (
                            <option value={user.Docid} key={user.ID}>{user.UserName}</option>
                        ))}
                    </select>
                    <div className="button-userrole-container">
                        <button className="button-simple" onClick={addAuthor}>Toevoegen</button>
                    </div>
                </div>


            </div>
            <RightSideBar/>
        </div>
    )
}

export default UserRoles
