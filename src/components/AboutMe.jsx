import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "./LeftSideBarAuthProfileFullScreen";
import RightSideBar from "./rightSideBar/RightSideBar"
import MenuStatus from "../hooks/MenuStatus";
import Location from "../hooks/Location"
import { useFirestoreAboutMe, useFirestoreProfileFields, useFirestoreUser } from "../firebase/useFirestore";
import { useState, useContext, useRef, useEffect } from "react";
import { db } from "../firebase/config";
import { Auth } from '../StateManagment/Auth';
import firebase from "firebase";
import { client } from "../hooks/Client";
import uuid from 'react-uuid';

const AboutMe = () => {
    const [authO] = useContext(Auth)

    const route = Location()[3]
    const menuState = MenuStatus()
    const profileFields = useFirestoreProfileFields()
    const aboutMe = useFirestoreAboutMe(route)
    const id = uuid()

    const saveField = (e) => {
        const value = e.target.parentElement.previousSibling.firstElementChild.firstElementChild.nextElementSibling.value
        const title = e.target.parentElement.dataset.title

        db.collection("AboutMe")
        .where("Compagny", "==", client)
        .where("UserID", "==", route)
        .where("Title", "==", title)
        .get()
        .then(querySnapshot => {
            if(querySnapshot.empty === false){
                console.log("Bestaat")
                querySnapshot.forEach(doc => {
                    db.collection("AboutMe")
                    .doc(doc.id)
                    .update({
                        Value: value
                    })
                })
            } else if (querySnapshot.empty === true){
                console.log("Bestaat niet")
                db.collection("AboutMe")
                .doc()
                .set({
                    Compagny: client,
                    Title: title,
                    Value: value,
                    UserID: authO.ID,
                    ID: id
                })
            }
        })
    }

    return (
        <div className="main">
             <LeftSideBarAuthProfile />
            <LeftSideBarAuthProfileFullScreen/>
             <div className="profile" style={{display: menuState}}>
                 <h1>Over mij</h1>
                 <div className="divider about-me-user-text">
                    <h2>Mijn antwoorden</h2>
                    {aboutMe && aboutMe.map(about => (
                        <div key={about.ID}>
                            <h3>{about.Title}</h3>
                            <p>{about.Value}</p>
                        </div>
                    ))}
                 </div>
                 <div className="divider">
                     <h2>Antwoorden aanpassen</h2>
                    {profileFields && profileFields.map(field => (
                        <div key={field.ID}>
                            <div dangerouslySetInnerHTML={{ __html: field.HTML }}></div>
                            <div data-title={field.Title} dangerouslySetInnerHTML={{ __html: field.Button }} onClick={saveField}></div>
                        </div>
                    ))}
                 </div>
             </div>
             <RightSideBar />
        </div>
    )
}

export default AboutMe
