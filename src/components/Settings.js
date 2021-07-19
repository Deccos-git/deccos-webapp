import RightSideBar from "./rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import Auth from "../firebase/Auth"
import { client } from '../hooks/Client';
import { db, auth, bucket } from "../firebase/config.js"
import {useFirestore } from "../firebase/useFirestore"
import firebase from 'firebase'
import { useState } from "react";
import { useHistory } from "react-router-dom";

const Settings = () => {

    const [logo, setLogo] = useState("")
    const [communityName, setCommunityName] = useState("")

    const auth = Auth()
    const docs = useFirestore("CompagnyMeta")
    const history = useHistory();

    const LogoHandler = (e) => {

        const logo = e.target.files[0]

        const storageRef = bucket.ref("/ProfilePhotos/" + logo.name);
        const uploadTask = storageRef.put(logo)

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

            setLogo(downloadURL)

                })
            })
        })
    }

    const communityNameHandler = (e) => {

        const communityName = e.target.value

        setCommunityName(communityName)

    }

    const saveSettings = (e) => {

        e.preventDefault()

        docs && docs.forEach(doc => {
            db.collection("CompagnyMeta")
            .doc(doc.docid)
            .update({
                Logo: logo,
                CommunityName: communityName

            })
            .then(() => {
                history.push(`/${client}/Settings`)
            })
        })
    }

    return (
        <div className="main">
            <LeftSideBarAuthProfile />
            {docs && docs.map(doc => (
            <div className="profile">
                <div className="card-header">
                    <h2>{doc.CommunityName}</h2>
                    <p>Verander de instellingen van de community</p>
                </div>
                <div className="divider">
                    <h4>Community naam aanpassen</h4>
                    <input type="text" value={doc.CommunityName} onChange={communityNameHandler} />
                </div >
                <div className="divider">
                    <h4>Logo aanpassen</h4>
                    <img src={doc.Logo} alt="" />
                    <input type="file" onChange={LogoHandler} />
                </div >
                <div className="save-bar">
                    <button onClick={saveSettings}>Opslaan</button>
                </div>
            </div>
            ))}
            <RightSideBar />
        </div>
    )
}

export default Settings
