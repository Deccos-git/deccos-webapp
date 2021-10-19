import RightSideBar from "./rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "./LeftSideBarAuthProfileFullScreen";
import { useState } from 'react';
import { auth, db, timestamp } from "../firebase/config";
import uuid from 'react-uuid';
import { bucket } from '../firebase/config';
import firebase from 'firebase'
import spinnerRipple from '../images/spinner-ripple.svg'
import { useHistory } from "react-router-dom";
import MenuStatus from "../hooks/MenuStatus";

const NewClient = () => {
    const [compagnyName, setCompagnyName] = useState("")
    const [communityName, setCommunityName] = useState("")
    const [website, setWebsite] = useState("")
    const [logo, setLogo] = useState("")
    const [loader, setLoader] = useState("")

    const history = useHistory();
    const id = uuid()
    const menuState = MenuStatus()

    const compagnyNameHandler = (e) => {

        const name = e.target.value 
        setCompagnyName(name)

    }

    const communityNameHandler = (e) => {
        const name = e.target.value 
        setCommunityName(name)

    }

    const websiteHandler = (e) => {
        const website = e.target.value 
        setWebsite(website)

    }


    const logoHandler = (e) => {

        setLoader(spinnerRipple)

        const logo = e.target.files[0]

        const storageRef = bucket.ref("/Logos/" + logo.name);
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
            setLoader(downloadURL)

                })
            })
        })
    }


    const saveNewClient = (e) => {
        e.preventDefault()

        db.collection("CompagnyMeta")
        .doc()
        .set({
           Compagny: compagnyName,
           CommunityName: communityName, 
           Logo: logo,
           Members: [],
           ID: id,
           VerificationMethode: "Admin",
           Website: website,
           Rules: [],
           Timestamp: timestamp,
           ActivityBanner: [{
                NewEvent: 'https://firebasestorage.googleapis.com/v0/b/deccos-app.appspot.com/o/DefaultActivityBanners%2Fwall-events.png?alt=media&token=6a539d0e-0c5c-45e3-9899-bbdf1e53fe31',
                NewGoal: 'https://firebasestorage.googleapis.com/v0/b/deccos-app.appspot.com/o/DefaultActivityBanners%2Fwall-new-goal.png?alt=media&token=2f349b5e-b2c9-4ca2-9588-9cdaa166e8070',
                NewMember: 'https://firebasestorage.googleapis.com/v0/b/deccos-app.appspot.com/o/DefaultActivityBanners%2Fwall-group-register.png?alt=media&token=51023ce7-0460-4e6f-b8b4-019e74af1b35',
                NewArticle: 'https://firebasestorage.googleapis.com/v0/b/deccos-app.appspot.com/o/DefaultActivityBanners%2Fwall-new-article.png?alt=media&token=d068573a-fb08-467c-99ab-c790294acd63',
                NewIntroduction: 'https://firebasestorage.googleapis.com/v0/b/deccos-app.appspot.com/o/DefaultActivityBanners%2Fwall-goal-cutout.png?alt=media&token=822bee4f-6652-4a22-bbec-115595234aac'
           }],
           WelcomeHeader: 'https://firebasestorage.googleapis.com/v0/b/deccos-app.appspot.com/o/Hero-III.jpg?alt=media&token=71ffc2d8-b90a-4497-aaf2-2206f619712d',
           WelcomeText: `Welkom bij ${communityName}`,
           Categories: [
               "-- Selecteer een categorie --"
           ]
        })
        .then(() => {
            db.collection("Channels")
            .doc()
            .set({
                Compagny: compagnyName,
                Name: "Nieuws",
                Layout: "Post",
                ID: uuid(),
                Link: "News",
                Members: []
            })
        })
        .then(() => {
            db.collection("Channels")
            .doc()
            .set({
                Compagny: compagnyName,
                Name: "Kenniscentrum",
                Layout: "Card",
                ID: uuid(),
                Link: "KnowledgeCentre",
                Members: []
            })
        })
        .then(() => {
            db.collection("Channels")
            .doc()
            .set({
                Compagny: compagnyName,
                Name: "Events",
                Layout: "Post",
                ID: uuid(),
                Link: "Events",
                Members: []
            })
        })
        .then(() => {
            db.collection("ImpactPaths")
            .doc()
            .set({
                Compagny: compagnyName,
                ID: uuid(),
                Timestamp: timestamp,
                Goal: ''
            })
        })
        .then(() => {
            history.push(`/${compagnyName}`) 
        })

    }

    return (
        <div className="main">
        <LeftSideBarAuthProfile />
        <LeftSideBarAuthProfileFullScreen/>
        <div className="profile profile-auth-profile" style={{display: menuState}}>
            <div className="settings-inner-container">
                <div className="card-header">
                    <h2>Nieuwe klant</h2>
                    <p>Maak een nieuwe klant aan</p>
                </div>
                <form >
                    <div className="divider">
                        <p>Bedrijfsnaam</p>
                        <input onChange={compagnyNameHandler} type="text" placeholder="Schrijf hier de bedrijfsnaam" />
                    </div>
                    <div className="divider">
                        <p>Community naam</p>
                        <input onChange={communityNameHandler} type="text" placeholder="Schrijf hier de communitynaam" />
                    </div>
                    <div className="divider">
                        <p>Website</p>
                        <input onChange={websiteHandler} type="text" placeholder="Schrijf hier de communitynaam" />
                    </div>
                    <div className="divider">
                        <p>Logo</p>
                        <input type="file" onChange={logoHandler} />
                        <div className="spinner-container">
                            <img src={loader} alt="" />
                        </div>
                    </div>
                    <div className="button-container">
                        <button onClick={saveNewClient}>Opslaan</button>
                    </div>
                </form>
            </div>
        </div>
        <RightSideBar />
    </div>
    )
}

export default NewClient
