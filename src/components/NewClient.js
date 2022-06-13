import { useState } from 'react';
import { auth, db, timestamp } from "../firebase/config";
import uuid from 'react-uuid';
import { bucket } from '../firebase/config';
import firebase from 'firebase'
import spinnerRipple from '../images/spinner-ripple.svg'
import { useHistory } from "react-router-dom";
import ButtonClicked from "../hooks/ButtonClicked";
import dummyPhoto from '../images/Design/dummy-photo.jpeg'
import checkIcon from '../images/icons/check-icon.png'
import dummyLogo from '../images/dummy-logo.png'
import deccosLogo from '../images/deccos-logo.png'
import Modal from 'react-modal';
import ScrollToTop from "../hooks/ScrollToTop";

const NewClient = () => {
    const [communityName, setCommunityName] = useState("")
    const [modalOpen, setModalOpen] = useState(false);
    const [logo, setLogo] = useState(dummyLogo)
    const [loader, setLoader] = useState('none')
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordRepeat, setPasswordRepeat] = useState("")
    const [forname, setForname] = useState("")
    const [surname, setSurname] = useState("")
    const [photo, setPhoto] = useState(dummyPhoto)
    const [error, setError] = useState(false)

    const history = useHistory();
    const id = uuid()
    ScrollToTop()
    Modal.setAppElement('#root');

    const modalStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
        },
      };


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

    const userID = uuid()
    
    auth.createUserWithEmailAndPassword(email, password)
    .then((cred) => {
        db.collection("Users")
        .doc(cred.user.uid)
        .set({
            UserName: `${forname} ${surname}`,
            ForName: forname,
            SurName: surname,
            Compagny: firebase.firestore.FieldValue.arrayUnion(id),
            Timestamp: timestamp,
            Email: email,
            ID: userID,
            Photo: photo,
            Approved: false,
            Deleted: false,
            Docid: cred.user.uid,
        })
    })
    .then(() => {
        sendVerificationEmail(userID)
        setModalOpen(true)
    })
    .catch((err) => {
        alert(err)
    })
}

    // Don't forget to change the firestore rules if you change anything in createClient

    const createClient = async () => {
 
        await db.collection("CompagnyMeta")
        .doc()
        .set({
            Compagny: communityName,
            CommunityName: communityName, 
            Logo: logo,
            CompagnyID: id,
            Timestamp: timestamp,
            Impacthub: true,
            ImpactBanner: 'https://firebasestorage.googleapis.com/v0/b/deccos-app.appspot.com/o/ImpactHeaderDefault.png?alt=media&token=5d11c139-431d-4c66-84d1-23878e3ad460'
        })
        
        await db.collection('Admins')
        .doc()
        .set({
            Compagny: communityName.toLocaleLowerCase(),
            CompagnyID: id,
            Email: 'info@deccos.nl',
            Photo: photo,
            UserID: id,
            UserName: `${forname} ${surname}`
        })
           
        await db.collection('Stakeholders')
        .doc()
        .set({
            ID: uuid(),
            Compagny: communityName.toLocaleLowerCase(),
            Name: '',
            CompagnyID: id,
        })
        
        await db.collection('Groups')
        .doc()
        .set({
            ID: uuid(),
            Compagny: communityName.toLocaleLowerCase(),
            MemberList: firebase.firestore.FieldValue.arrayUnion(id),
            Room: 'Impact HQ',
            CompagnyID: id,
        })
        
        sendEmail()
                    
                    
        setTimeout(() => {
            console.log('create user')
            createUser()
        },3000)
                   
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

    const sendEmail = async () => {

        console.log('email send')
        await db.collection("Email").doc().set({
            to: "info@deccos.nl",
            cc: "info@deccos.nl",
            message: {
            subject: `Nieuwe klant op Deccos.`,
            html: `Nieuwe klant op Deccos: </br></br>
    
                Naam: ${forname} ${surname}.</br></br>
                Email: ${email}.</br></br>
                Bedrijf: ${communityName}.</br></br>
                `,
            Gebruikersnaam: `${forname} ${surname}`,
            Emailadres: email,
            Type: "New client"
              }     
          }); 
    }

    const sendVerificationEmail = async (userID) => {

        console.log('verification email send')
        await db.collection("Email").doc().set({
            to: email,
            cc: "info@Deccos.nl",
            message: {
            subject: `Verificeer je Deccos account.`,
            html: `Hallo ${forname} ${surname}, </br></br>

                Welkom bij Deccos. Via deze link kun je je account verificeren:<br><br>

                Klik <a href="https://deccos.co/NotApproved/${userID}">hier</a> om je account te verificeren.<br><br>
                
                Vriendelijke groet, </br></br>
                Het Deccos team </br></br>
                <img src="${deccosLogo}" width="100px">
                `,
            Gebruikersnaam: `${forname} ${surname}`,
            Emailadres: email,
            Type: "New client"
              }     
          }); 
    }

    const closeModal = () => {
        setModalOpen(false);
      }

    const closeVerificationModal = () => {
        window.location.href = 'https://deccos.nl'; 
    }

    return (
        <div>
            <div className="new-client-container">
                <div className="card-header">
                    <h1 id='title-new-client'>Creëer je Deccos bedrijfsaccount</h1>
                    <p id='sub-title-new-client'>Begin je impact managent avontuur.</p>
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
                    <input onChange={emailHandler} type="email" placeholder="Schrijf hier je emailadres" />
                    <p>Wachtwoord*</p>
                    <input onChange={passwordHandler} type="password" placeholder="Schrijf hier je wachtwoord" />
                    <p>Herhaal je wachtwoord*</p>
                    <input onChange={passwordRepeatHandler} type="password" placeholder="Herhaal hier je wachtwoord" />
                    <div className="button-container-margin-top new-client-button-container">
                        <button onClick={checkHandler}>Aanmaken</button>
                    </div>
                </form>
            </div>
            <Modal
            isOpen={modalOpen}
            onRequestClose={closeModal}
            style={modalStyles}
            contentLabel="Upload banner"
            >
            <img src={checkIcon} alt="" />
            <p><b>Je account is succelvol aangemaakt!</b></p>
            <p>Voordat je aan de slag kan moet je account worden geverifieerd. </p>
            <p>Er is een verificatie email gestuurd naar {email}.</p>
            <div className='button-container-margin-top'>
                <button onClick={closeVerificationModal}>Sluiten</button>
            </div>
            </Modal>
        </div>
    )
}

export default NewClient
