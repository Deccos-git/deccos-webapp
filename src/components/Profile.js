import RightSideBar from "./rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import Auth from "../firebase/Auth"
import { db, bucket, auth } from "../firebase/config.js"
import {useFirestore } from "../firebase/useFirestore"
import firebase from 'firebase'
import { useState } from "react";

const Profile = () => {

    const [newPhoto, setNewPhoto] = useState("")

    const docs = useFirestore("CompagnyMeta")
    const authO = Auth()

    let photo = authO.Photo

    const changePhoto = (e) => {

        const newPhoto = e.target.files[0]

        const storageRef = bucket.ref("/ProfilePhotos/" + newPhoto.name);
        const uploadTask = storageRef.put(newPhoto)

        uploadTask.then(() => {
          
            uploadTask.on('state_changed', snapshot => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED:
                console.log('Upload is paused');
                break;
            case firebase.storage.TaskState.RUNNING:
                console.log('Upload is running');
                break;
            }
            }, (err) => {
                alert(err)
            }, () => {
            uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            console.log('File available at', downloadURL);

            setNewPhoto(downloadURL)

                })
            })
        })
        .then(() => {
            auth.onAuthStateChanged(User =>{
                if(User){
                    db.collection("Users")
                    .doc(User.uid)
                    .update({
                        Photo: newPhoto
                    })
                }
            });
        })
    }

    console.log(newPhoto)


    const logOut = () => {
        auth.signOut()
        .then(() => {
            window.location.reload()
        }) 
    }

    const deleteAccount = () => {
        auth
        .currentUser
        .delete()
        .catch(err => {
            console.log(err)
        })
        .then(() => {
            db.collection("Users")
            .doc(auth.id)
            .delete()
        })
        .then(() => {
           docs && docs.forEach(doc => {
               db.collection("CompagnyMeta")
               .doc(doc.id)
               .update({
                   Members: firebase.firestore.FieldValue.delete(doc.UserName)
               })
           })
        })
        .then(() => {
            window.location.reload()
        }) 
    }

    return (
        <div className="main">
            <LeftSideBarAuthProfile />
                <div className="profile">
                    <div className="card-header">
                        <h2>{authO.UserName}</h2>
                        <p>Verander de instellingen van je profiel</p>
                    </div>
                    <div className="divider account-status">
                        <h4>Uitloggen/verwijderen</h4>
                        <button id="log-out-button" onClick={logOut}>Uitloggen</button>
                        <button id="delete-account-button" onClick={deleteAccount}>Verwijderen</button>
                    </div >
                    <div className="divider">
                        <h4>Schermnaam aanpassen</h4>
                        <h5>Voornaam</h5>
                        <input type="text" placeholder={authO.ForName} />
                        <h5>Achternaam</h5>
                        <input type="text" placeholder={authO.SurName} />
                    </div >
                    <div className="divider">
                        <h4>Profielfoto aanpassen</h4>
                        <img src={photo} alt="" />
                        <input type="file" onChange={changePhoto} />
                    </div >
                    <div className="save-bar">
                        <button>Opslaan</button>
                    </div>
                </div>
            <RightSideBar />
        </div>
    )
}

export default Profile
