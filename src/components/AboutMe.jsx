import LeftSideBarPublicProfile from "./LeftSideBarPublicProfile";
import LeftSideBarPublicProfileFullScreen from "./LeftSideBarPublicProfileFullScreen";
import RightSideBar from "./rightSideBar/RightSideBar"
import MenuStatus from "../hooks/MenuStatus";
import Location from "../hooks/Location"
import { useFirestoreProfileFields, useFirestoreUser } from "../firebase/useFirestore";
import { useState, useContext } from "react";
import { db } from "../firebase/config";
import { Auth } from '../StateManagment/Auth';
import firebase from "firebase";

const AboutMe = () => {
    const [authO] = useContext(Auth)

    const route = Location()[3]
    const menuState = MenuStatus()
    const profileFields = useFirestoreProfileFields()
    const users = useFirestoreUser(authO.ID)

    const saveField = (e) => {
        const value = e.target.parentElement.previousSibling.firstElementChild.firstElementChild.nextElementSibling.value
        const title = e.target.parentElement.dataset.title

        users && users.forEach(user => {
            const aboutMe = user.AboutMe

            console.log(aboutMe)
    
            aboutMe.forEach((about, index) => {
                if(about.Title === title){

                    // const index = aboutMe.indexOf(about)

                    console.log(index)
                    
    
                    const newAboutMe = aboutMe.filter(about => about[index])

                    console.log(newAboutMe)
                }
            })
        })

        

        // db.collection("Users")
        // .doc(authO.Docid)
        // .update({
        //     AboutMe: aboutMe
        // })
    }

    return (
        <div className="main">
             <LeftSideBarPublicProfile />
             <LeftSideBarPublicProfileFullScreen/>
             <div className="profile" style={{display: menuState}}>
                 <h2>Over mij</h2>
                 {profileFields && profileFields.map(field => (
                     <div key={field.ID}>
                        <div dangerouslySetInnerHTML={{ __html: field.HTML }}></div>
                        <div data-title={field.Title} dangerouslySetInnerHTML={{ __html: field.Button }} onClick={saveField}></div>
                     </div>
                ))}
             </div>
             <RightSideBar />
        </div>
    )
}

export default AboutMe
