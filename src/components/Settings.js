import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "./LeftSideBarAuthProfileFullScreen";
import { db, bucket } from "../firebase/config.js"
import {useFirestore, useFirestoreID } from "../firebase/useFirestore"
import firebase from 'firebase'
import { useState, useEffect, useContext } from "react";
import MenuStatus from "../hooks/MenuStatus";
import { Colors } from "../StateManagment/Colors";
import "../CSS/toggleSwitch.css";

const Settings = () => {
    const [colors] = useContext(Colors)
    const [docid, setDocid] = useState('')
    const [communityName, setCommunityName] = useState("")
    const [backgroundColor, setBackgroundColor] = useState(colors.Background)
    const [topbarColor, setTopbarColor] = useState(colors.Topbar)
    const [topbarIconsColor, setTopbarIconsColor] = useState(colors.TopbarIcons)


    const compagny = useFirestore("CompagnyMeta")

    const menuState = MenuStatus()

    useEffect(() => {
        compagny && compagny.forEach(comp => {
            setDocid(comp.docid)
        })
    },[compagny])

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

    const backgroundColorHandler = (e) => {
        const color = e.target.value 

        console.log(color)

        setBackgroundColor(color)
    }

    const saveBackgroundColor = (e) => {
  
        e.target.innerText = 'Opgeslagen'

        db.collection('Colors')
        .doc(colors.docid)
        .update({
            Background: backgroundColor
        })
    }

    const topbarColorHandler = (e) => {
        const color = e.target.value 

        setTopbarColor(color)
    }

    const saveTopbarColor = (e) => {

        e.target.innerText = 'Opgeslagen'

        db.collection('Colors')
        .doc(colors.docid)
        .update({
            Topbar: topbarColor
        })
    }

    const topbarIconsColorHandler = (e) => {
        const color = e.target.value 

        console.log(color)

        setTopbarIconsColor(color)
    }

    const saveTopbarIconsColor = (e) => {

        e.target.innerText = 'Opgeslagen'

        db.collection('Colors')
        .doc(colors.docid)
        .update({
            TopbarIcons: topbarIconsColor
        })
    }

    return (
        <div className="main" style={{backgroundColor:backgroundColor}}>
            <LeftSideBarAuthProfile />
            <LeftSideBarAuthProfileFullScreen/>
            <div className="main-container" style={{display: menuState}}>
                {compagny && compagny.map(comp => (
                <div className="profile-inner-container" key={comp.ID}>
                    <div className="divider card-header">
                        <h1>Algemeen</h1>
                        <p>Verander de algemene instellingen van {comp.CommunityName}</p>
                    </div>
                    <div className="divider">
                        <h2>Bedrijfsnaam aanpassen</h2>
                        <input className="input-classic" type="text" defaultValue={comp.CommunityName} onChange={communityNameHandler} />
                        <div className="button-container button-container-top">
                            <button className="button-simple" data-id={comp.docid} onClick={saveName}>Opslaan</button>
                        </div>
                    </div >
                    <div className="divider logo-container">
                        <h2>Logo aanpassen</h2>
                        <img src={comp.Logo} alt="" />
                        <input className="input-classic" type="file" onChange={LogoHandler} />
                    </div >
                    <div className="divider">
                        <h2>Kleuren aanpassen</h2>
                        <div className='client-styles-container'>
                            <div className='color-container'>
                                <h5>Achtergrond</h5>
                                <input className="input-color" type="color" defaultValue={backgroundColor} onChange={backgroundColorHandler} />
                                <div className="button-container-colors">
                                    <button className="button-simple" onClick={saveBackgroundColor}>Opslaan</button>
                                </div>
                            </div>
                            <div className='color-container'>
                                <h5>Topbar</h5>
                                <input className="input-color" type="color" defaultValue={topbarColor} onChange={topbarColorHandler} />
                                <div className="button-container-colors">
                                    <button className="button-simple" onClick={saveTopbarColor}>Opslaan</button>
                                </div>
                            </div>
                            <div className='color-container'>
                                <h5>Topbar iconen</h5>
                                <input className="input-color" type="color" defaultValue={topbarIconsColor} onChange={topbarIconsColorHandler} />
                                <div className="button-container-colors">
                                    <button className="button-simple" onClick={saveTopbarIconsColor}>Opslaan</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                ))}
            </div>
        </div>
    )
}

export default Settings
