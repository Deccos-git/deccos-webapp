import { useState, useEffect } from 'react';
import { auth, db, timestamp } from "../firebase/config";
import { client } from "../hooks/Client";
import uuid from 'react-uuid';
import firebase from 'firebase'
import { useFirestore, useFirestoreAdmins } from '../firebase/useFirestore.js';
import { bucket } from '../firebase/config';
import spinnerRipple from '../images/spinner-ripple.svg'
import dummyPhoto from '../images/Design/dummy-photo.jpeg'
import { useHistory } from "react-router-dom"

const RegisterUser = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordRepeat, setPasswordRepeat] = useState("")
    const [forname, setForname] = useState("")
    const [surname, setSurname] = useState("")
    const [photo, setPhoto] = useState(dummyPhoto)
    const [loader, setLoader] = useState("")
    const [communityNameDB, setCommunityNameDB] = useState("")
    const [logoDB, setLogoDB] = useState("")
    const [adminEmail, setAdminEmail] = useState('')

    const id = uuid()
    const history = useHistory()
    
    const compagny = useFirestore("CompagnyMeta")
    const admins = useFirestoreAdmins('Admins')

    useEffect(() => {
        compagny && compagny.forEach(comp => {
            setCommunityNameDB(comp.CommunityName)
            setLogoDB(comp.Logo)
        })
    }, [compagny])

    useEffect(() => {
        const adminArray = []
        admins && admins.forEach(admin => {
            adminArray.push(admin.Email)
        })
        setAdminEmail(adminArray)
    }, [admins])

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
        e.target.innerText = "Aangemeld"

        if(password === passwordRepeat){
            registerHandler()
        } else {
            alert('De paswoorden zijn niet gelijk')
        }
    }

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
                Compagny: firebase.firestore.FieldValue.arrayUnion(client),
                Timestamp: timestamp,
                Email: email,
                Photo: photo,
                ID: id,
                Approved: false,
                Deleted: false,
                Docid: cred.user.uid,
            })
        })
        .then(() => {
            compagny && compagny.forEach(comp => {
                if(comp.VerificationMethode === "Admin"){
                    verificationEmailAdmin(email, forname, surname, communityNameDB, logoDB)
                    emailToAdminAdmin(forname, surname, communityNameDB)
                } else if(comp.VerificationMethode === "Email"){
                    verificationEmailEmail(email, forname, surname, communityNameDB, logoDB)
                    emailToAdminEmail(forname, surname, communityNameDB)
                }
            })
        })
        .then(() => {
            history.push(`/${client}/NotApproved/1`)
        })
        .catch(err => {
            if(err){
                alert(err)
                return
            }
            
        })
    }

    const emailToAdminAdmin = (forname, surname, communityName) => {
        db.collection("Email").doc().set({
            to: adminEmail,
            cc: "info@Deccos.nl",
            from: 'info@deccos.nl',
            replyTo: 'info@deccos.nl',
            message: {
            subject: `Iemand heeft zich aangemeld voor ${communityName}`,
            html: `
                Iemand heeft zich aangemeld voor jullie community. <br><br>

                Naam: ${forname} ${surname}. <br><br>

                Dit lidmaatschap moet door een beheerder worden geverificeerd.<br><br>

                <a href='https://deccos.co/${client}/Registrations'>Klik hier</a> om de alle openstaande aanvragen te beheren.<br><br>
                
                `,
            Gebruikersnaam: `${forname} ${surname}`,
            Emailadres: adminEmail,
            Type: "Verification mail email"
              }     
          });
    }

    const verificationEmailAdmin = (email, forname, surname, communityName, logo) => {
        db.collection("Email").doc().set({
            to: email,
            cc: "info@Deccos.nl",
            from: 'info@deccos.nl',
            replyTo: 'info@deccos.nl',
            message: {
            subject: `Je account wordt geverifieerd door een beheerder `,
            html: `Hallo ${forname} ${surname}, </br></br>
                Om ervoor te zorgen dat onze community een prettige omgeving blijft
                worden alle aanmeldingen geverifieerd door een beheerder. <br><br>

                Zodra onze beheerder je account heeft bekeken en goedgekeurd ontvang je een mail.<br><br>

                Vanaf dan kun je inloggen met je email en wachtwoord<br><br>
                
                Vriendelijke groet, </br></br>
                ${communityName} </br></br>
                <img src="${logo}" width="100px">`,
            Gebruikersnaam: `${forname} ${surname}`,
            Emailadres: email,
            Type: "Verification mail"
              }     
          });
    }

    const verificationEmailEmail = (email, forname, surname, communityName, logo) => {
        console.log(email)
        db.collection("Email").doc().set({
            to: email,
            from: 'info@deccos.nl',
            replyTo: 'info@deccos.nl',
            cc: "info@Deccos.nl",
            message: {
            subject: `Verificeer je account `,
            html: `Hallo ${forname} ${surname}, </br></br>
                Je hebt je aangemeld voor ${communityName} <br><br>

                Klik <a href="https://deccos.co/${client}/NotApproved/${id}">hier</a> om je account te verificeren.<br><br>
                
                Vriendelijke groet, </br></br>
                ${communityName} </br></br>
                <img src="${logo}" width="100px">`,
            Gebruikersnaam: `${forname} ${surname}`,
            Emailadres: email,
            Type: "Verification mail"
              }     
          });
    }

    const emailToAdminEmail = (forname, surname, communityName) => {
        console.log(adminEmail)
        db.collection("Email").doc().set({
            to: adminEmail,
            cc: "info@Deccos.nl",
            from: 'info@deccos.nl',
            replyTo: 'info@deccos.nl',
            message: {
            subject: `Iemand heeft zich aangemald voor ${communityName}`,
            html: `
                Iemand heeft zich aangemeld voor jullie community. <br><br>

                Naam: ${forname} ${surname}. <br><br>

                <a href='https://deccos.co/${client}/Members'>Klik hier</a> om de alle leden te beheren.<br><br>
                
                `,
            Gebruikersnaam: `${forname} ${surname}`,
            Emailadres: adminEmail,
            Type: "Verification mail admin"
              }     
          });
    }

    return (
        <div className="main">
            <div className="login-container">
                <h2>Account maken</h2>
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
                <div className="button-container-register">
                    <button onClick={checkHandler}>Aanmelden</button>
                </div>
            </div>
        </div>
    )
}

export default RegisterUser
