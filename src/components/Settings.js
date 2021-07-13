import RightSideBar from "./rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import Auth from "../firebase/Auth"
import { client } from '../hooks/Client';
import { db, auth, bucket } from "../firebase/config.js"
import {useFirestore } from "../firebase/useFirestore"
import firebase from 'firebase'
import { useState } from "react";

const Settings = () => {

    const [photo, setPhoto] = useState("")

    const auth = Auth()
    const docs = useFirestore("CompagnyMeta")

    const userPhoto = auth.Photo

    // setPhoto(userPhoto)

    console.log(photo)

    const changePhoto = (e) => {

        const userphoto = e.target.files[0]

        const storageRef = bucket.ref("/ProfilePhotos/" + userphoto.name);
        const uploadTask = storageRef.put(userphoto)

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

            setPhoto(downloadURL)

                })
            })
        })
    }

    return (
        <div className="main">
            <LeftSideBarAuthProfile />
                <div className="profile">
                    <div className="card-header">
                        <h2>{auth.UserName}</h2>
                        <p>Verander de instellingen van de community</p>
                    </div>
                    <div className="divider">
                        <h4>Community naam aanpassen</h4>
                        <input type="text" placeholder={auth.ForName} />
                    </div >
                    <div className="divider">
                        <h4>Logo aanpassen</h4>
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

export default Settings
