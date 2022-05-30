import { useState } from 'react';
import { auth, db, timestamp } from "../firebase/config";
import uuid from 'react-uuid';
import { bucket } from '../firebase/config';
import firebase from 'firebase'
import spinnerRipple from '../images/spinner-ripple.svg'
import { useHistory } from "react-router-dom";
import ButtonClicked from "../hooks/ButtonClicked";
import dummyPhoto from '../images/Design/dummy-photo.jpeg'
import dummyLogo from '../images/dummy-logo.png'
import deccosLogo from '../images/deccos-logo.png'
import NoContentNotice from '../hooks/NoContentNotice';

const NewClient = () => {
    const [communityName, setCommunityName] = useState("")
    const [logo, setLogo] = useState(dummyLogo)
    const [loader, setLoader] = useState('none')
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordRepeat, setPasswordRepeat] = useState("")
    const [forname, setForname] = useState("")
    const [surname, setSurname] = useState("")
    const [photo, setPhoto] = useState(dummyPhoto)

    const history = useHistory();
    const id = uuid()


    const communityNameHandler = (e) => {
        const name = e.target.value 
        setCommunityName(name)

    }

    const LogoHandler = (e) => {

        const logo = e.target.files[0]
        setLogo(spinnerRipple)

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

   

    const fornameHandler = (e) => {
        const forname = e.target.value

        setForname(forname)
    }

    const surnameHandler = (e) => {
        const surname = e.target.value

        setSurname(surname)
    }

    const emailHandler = (e) => {
        const email = e.target.value

        setEmail(email)
    }

    const passwordHandler = (e) => {
        const password = e.target.value

        setPassword(password)
    }

    const passwordRepeatHandler = (e) => {
        const passwordRepeat = e.target.value

        setPasswordRepeat(passwordRepeat)
    }

const createUser = () => {
    
    auth.createUserWithEmailAndPassword(email, password)
    .then((cred) => {
        db.collection("Users")
        .doc(cred.user.uid)
        .set({
            UserName: `${forname} ${surname}`,
            ForName: forname,
            SurName: surname,
            Compagny: firebase.firestore.FieldValue.arrayUnion(communityName.toLocaleLowerCase()),
            Timestamp: timestamp,
            Email: email,
            Photo: photo,
            ID: id,
            Approved: true,
            Deleted: false,
            Docid: cred.user.uid,
        })
    })
    .catch((err) => {
        console.log(err)
            if(err){
                alert(err)
            } else {
                loginUser()
            }
      })
}

    const loginUser = () => {
        auth.signInWithEmailAndPassword(email, password)
        .catch(err => {
            console.log(err)
            if(err){
                alert(err)
            } else {
                history.replace(`/${communityName.toLocaleLowerCase()}/Introduction`) 
            }
        })
    }

    // Don't forget to change the firestore rules if you change anything in createClient

    const createClient = () => {

        db.collection("CompagnyMeta")
        .doc()
        .set({
            Compagny: communityName.toLocaleLowerCase(),
            CommunityName: communityName, 
            Logo: logo,
            ID: id,
            VerificationMethode: "Admin",
            Timestamp: timestamp,
            Impacthub: true
        })
        .then(() => {
            db.collection('Admins')
            .doc()
            .set({
                Compagny: communityName.toLocaleLowerCase(),
                Email: 'info@deccos.nl',
                Photo: 'https://firebasestorage.googleapis.com/v0/b/deccos-app.appspot.com/o/ProfilePhotos%2Ffoto-gijs350.jpg?alt=media&token=0e8e886f-2384-4f4c-b5de-a14fa7376135',
                UserID: '6a8bf-08c3-a1ad-d04d-231ebe51dc60',
                UserName: 'Gijs van Beusekom'
            })
            .then(() => {
                db.collection('Admins')
                .doc()
                .set({
                    Compagny: communityName.toLocaleLowerCase(),
                    Email: 'info@deccos.nl',
                    Photo: 'https://firebasestorage.googleapis.com/v0/b/deccos-app.appspot.com/o/ProfilePhotos%2Ffoto-gijs350.jpg?alt=media&token=0e8e886f-2384-4f4c-b5de-a14fa7376135',
                    UserID: id,
                    UserName: `${forname} ${surname}`
                })
                .then(() => {
                    db.collection('Colors')
                    .doc()
                    .set({
                        Background: '#edf4fd',
                        Topbar: '#FFFFFF',
                        TopBarIcons: '#2F2C41',
                        ID: uuid(),
                        Compagny: communityName.toLocaleLowerCase()
                    })
                    .then(() => {
                        db.collection('Stakeholders')
                        .doc()
                        .set({
                            ID: uuid(),
                            Compagny: communityName.toLocaleLowerCase(),
                            Name: ''
                        })
                        .then(() => {
                            db.collection('Groups')
                            .doc()
                            .set({
                                ID: uuid(),
                                Compagny: communityName.toLocaleLowerCase(),
                                MemberList: firebase.firestore.FieldValue.arrayUnion(id),
                                Room: 'Impact HQ'
                            })
                            .then(() => {
                                setTimeout(() => {
                                    createUser()
                                },3000)
                            })
                        })
                    })
                })
            })
        })
    }

    const checkHandler = (e) => {

        e.preventDefault()

        if(password === passwordRepeat){
            ButtonClicked(e, 'laden...')
            createClient()
        } else {
            alert('De paswoorden zijn niet gelijk')
        }
    }

    const homeLink = () => {
        history.replace(`/`) 
        }

    return (
        <div>
             <header className="top-bar">
                <img src={deccosLogo} onClick={homeLink} className="top-bar-logo" alt="logo" />
            </header>
            <div className="new-client-container">
                <div className="card-header">
                    <h1 id='title-new-client'>Creëer je Deccos bedrijfsaccount</h1>
                    <p>Begin je impact managent avontuur.</p>
                    <ul>
                        <li>Je account blijft gratis zolang je wilt</li>
                        <li>Bepaal zelf wanneer en of je wilt upgraden</li>
                        <li>Je hebt geen creditcard of ander betaalgegegevens nodig</li>
                    </ul>
                </div>
                <form >
                    <p>Bedrijfsnaam*</p>
                    <input onChange={communityNameHandler} type="text" placeholder="Schrijf hier de bedrijfsnaam" />
                    <p>Logo</p>
                    <div id='new-client-logo-container'>
                        <img src={logo} alt="" />
                    </div>
                    <input className="input-classic" type="file" onChange={LogoHandler} />
                    <p>Voornaam*</p>
                    <input onChange={fornameHandler} type="text" placeholder="Schrijf hier je voornaam" />
                    <p>Achternaam</p>
                    <input onChange={surnameHandler} type="text" placeholder="Schrijf hier je achternaam" />
                    <p>Emailadres*</p>
                    <input onChange={emailHandler} type="email" placeholder="Schrijf hier je achternaam" />
                    <p>Wachtwoord*</p>
                    <input onChange={passwordHandler} type="password" placeholder="Schrijf hier je wachtwoord" />
                    <p>Herhaal je wachtwoord*</p>
                    <input onChange={passwordRepeatHandler} type="password" placeholder="Herhaal hier je wachtwoord" />
                    <div className="button-container-margin-top new-client-button-container">
                        <button onClick={checkHandler}>Aanmaken</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default NewClient
