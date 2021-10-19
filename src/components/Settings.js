import RightSideBar from "./rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "./LeftSideBarAuthProfileFullScreen";
import { db, bucket } from "../firebase/config.js"
import {useFirestore, useFirestoreID } from "../firebase/useFirestore"
import firebase from 'firebase'
import { useState } from "react";
import MenuStatus from "../hooks/MenuStatus";

const Settings = () => {

    const compagny = useFirestore("CompagnyMeta")

    const [communityName, setCommunityName] = useState("")
    const [website, setWebsite] = useState("")

    const menuState = MenuStatus()

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

            saveLogo(downloadURL)

                })
            })
        })
    }

    const saveLogo = (banner) => {
        compagny && compagny.forEach(comp => {
            db.collection("CompagnyMeta")
            .doc(comp.docid)
            .update({
                Logo: banner
            })
        })
    }

    const communityNameHandler = (e) => {

        const communityName = e.target.value

        setCommunityName(communityName)

    }

    const saveName = (e) => {

        const docid = e.target.dataset.id
        db.collection("CompagnyMeta")
        .doc(docid)
        .update({
            CommunityName: communityName
        })
    }

    const websiteHandler = (e) => {

        const website = e.target.value

        setWebsite(website)

    }

    const saveWebsite = (e) => {

        const docid = e.target.dataset.id
        
        db.collection("CompagnyMeta")
        .doc(docid)
        .update({
            Website: website
        })
    }

    return (
        <div className="main">
            <LeftSideBarAuthProfile />
            <LeftSideBarAuthProfileFullScreen/>
            <div className="profile profile-auth-profile" style={{display: menuState}}>
                {compagny && compagny.map(comp => (
                <div className="settings-inner-container">
                    <div className="card-header">
                        <h1>Bedrijfsinstellingen</h1>
                        <p>Verander de instellingen van {comp.CommunityName}</p>
                    </div>
                    <div className="divider">
                        <h4>Community naam aanpassen</h4>
                        <input className="input-classic" type="text" placeholder={comp.CommunityName} onChange={communityNameHandler} />
                        <div className="button-container button-container-top">
                            <button className="button-simple" data-id={comp.docid} onClick={saveName}>Opslaan</button>
                        </div>
                    </div >
                    <div className="divider logo-container">
                        <h4>Logo aanpassen</h4>
                        <img src={comp.Logo} alt="" />
                        <input className="input-classic" type="file" onChange={LogoHandler} />
                    </div >
                    <div className="divider">
                        <h4>Website aanpassen</h4>
                        <input className="input-classic" type="text" placeholder={comp.Website} onChange={websiteHandler} />
                        <div className="button-container button-container-top">
                            <button className="button-simple" data-id={comp.docid} onClick={saveWebsite}>Opslaan</button>
                        </div>
                    </div >
                </div>
                ))}
            </div>
            <RightSideBar />
        </div>
    )
}

export default Settings
