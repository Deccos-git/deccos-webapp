import { useState } from 'react';
import { auth, db, timestamp } from "../firebase/config";
import { client } from "../hooks/Client";
import uuid from 'react-uuid';
import firebase from 'firebase'
import { useFirestore } from '../firebase/useFirestore.js';
import { bucket } from '../firebase/config';
import spinnerRipple from '../images/spinner-ripple.svg'



const RegisterUser = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordRepeat, setPasswordRepeat] = useState("")
    const [forname, setForname] = useState("")
    const [surname, setSurname] = useState("")
    const [photo, setPhoto] = useState("")
    const [loader, setLoader] = useState("")

    const id = uuid()
    const compagny = useFirestore("CompagnyMeta")

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

    const photoHandler = (e) => {
        setLoader(spinnerRipple)

        const photo = e.target.files[0]

        const storageRef = bucket.ref("/ProfilePhotos/" + photo.name);
        const uploadTask = storageRef.put(photo)

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
            setLoader(downloadURL)

                })
            })
        })
    }

    const checkHandler = (e) => {
        e.preventDefault()

        if(password === passwordRepeat){
            registerHandler()
        } else {
            alert('De paswoorden zijn niet gelijk')
        }
    }

    const memberMap = {
        UserName: `${forname} ${surname}`,
        Photo: photo,
        ID: id
    }

    let banner = ""
    let docid = ""

    compagny && compagny.forEach(comp => {
        banner = comp.ActivityBanner.NewMember
        docid = comp.docid
    })

    const registerHandler = () => {
    
        auth
        .createUserWithEmailAndPassword(email, password)
        .then((cred) => {
            db.collection("Users")
            .doc(cred.user.uid)
            .set({
                UserName: `${forname} ${surname}`,
                ForName: forname,
                SurName: surname,
                Compagny: client,
                Timestamp: timestamp,
                Email: email,
                Photo: photo,
                Channels: [],
                ID: id,
                Description: ""
            })
        })
        .catch(err => {
            if(err){
                alert(err)
                return
            }
            
        })
        .then(() => {
            db.collection("AllActivity")
            .doc()
            .set({
                Title: `Welkom ${forname}!`,
                Type: "NewMember",
                Compagny: client,
                ButtonText: "Bekijk profiel",
                Timestamp: timestamp,
                ID: id,
                Banner: banner,
                Description: 'is lid geworden van de community',
                Link: `/${client}/PublicProfile`,
                User: `${forname} ${surname}`,
                UserPhoto: photo,
            }) 
        })
        .then(() => {
            db.collection("CompagnyMeta")
            .doc(docid)
            .update({
                Members: firebase.firestore.FieldValue.arrayUnion(memberMap)
            }) 
        })
        .then(() => {
            db.collection("Route")
            .doc()
            .set({
                ID: id
            })
        })
    }

    return (
        <div className="login-container">
            <h2>Register</h2>
            <form>
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
                <p>Profielfoto</p>
                <input onChange={photoHandler} type="file" />
                <div className="spinner-container">
                    <img src={loader} alt="" />
                </div>
            </form>
            <div className="button-container">
                <button onClick={checkHandler}>Aanmelden</button>
            </div>
            
        </div>
    )
}

export default RegisterUser
