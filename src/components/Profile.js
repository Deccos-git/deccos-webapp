import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "./LeftSideBarAuthProfileFullScreen";
import { db, bucket, auth } from "../firebase/config.js"
import {useFirestore } from "../firebase/useFirestore"
import firebase from 'firebase'
import { useHistory } from "react-router";
import { client } from '../hooks/Client';
import { useState, useContext, useEffect } from 'react';
import { Auth } from '../StateManagment/Auth';
import MenuStatus from "../hooks/MenuStatus";
import externalLinkIcon from '../images/icons/external-link-icon.png'
import ButtonClicked from '../hooks/ButtonClicked'

const Profile = () => {

    const [ authO ] = useContext(Auth)
    const [forName, setForName] = useState(authO.ForName)
    const [surName, setSurName] = useState(authO.SurName)
    const [userCompagnies, setUserCompagnies] = useState(null)

    const docs = useFirestore("CompagnyMeta")
    const history = useHistory()
    const menuState = MenuStatus()

    useEffect(() => {
      const compagnies = authO.Compagny 

      setUserCompagnies(compagnies)

    }, [authO]);
  
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

            savePhoto(downloadURL)

                })
            })
        })
    }

    const savePhoto = (photo) => {
        auth.onAuthStateChanged(User =>{
            if(User){
                db.collection("Users")
                .doc(User.uid)
                .update({
                    Photo: photo
                })
            }
        })
    }

    const logOut = () => {
        auth.signOut()
        .then(() => {
            history.push(`/`)
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

    const forNameHandler = (e) => {
        const forName = e.target.value

        setForName(forName)
    }

    const surNameHandler = (e) => {
        const surName = e.target.value

        setSurName(surName)
    }

    const saveUserName = (e) => {

        ButtonClicked(e, 'Opgeslagen')

        db.collection("Users")
        .doc(authO.Docid)
        .update({
            ForName: forName,
            SurName: surName,
            UserName: `${forName} ${surName}`
        })
    }

    const linkUserCompagny = (e) => {
        const compagny = e.target.dataset.compagny 

        history.push(`/${compagny}`)

        window.location.reload()
    }

    return (
        <div className="main">
            <LeftSideBarAuthProfile />
            <LeftSideBarAuthProfileFullScreen/>
                <div className="main-container" style={{display: menuState}}>
                    <div className="profile-inner-container">
                        <div className="card-header">
                            <h1>Account instellingen</h1>
                            <img id="profile-header-photo" src={authO.Photo} alt="" />
                            <h2>{authO.UserName}</h2>
                            <p>Verander de instellingen van je profiel</p>
                        </div>
                        <div className="divider account-status">
                            <h2>Uitloggen</h2>
                            <button id="log-out-button" onClick={logOut}>Uitloggen</button>
                        </div >
                        <div className="divider">
                            <h2>Schermnaam aanpassen</h2>
                            <h5>Voornaam</h5>
                            <input className="input-classic" type="text" defaultValue={authO.ForName} onChange={forNameHandler}/>
                            <h5>Achternaam</h5>
                            <input className="input-classic" type="text" defaultValue={authO.SurName} onChange={surNameHandler}/>
                            <div className="button-container">
                                <button className="button-simple" onClick={saveUserName}>Opslaan</button>
                            </div>
                        </div >
                        <div className="divider">
                            <h2>Profielfoto aanpassen</h2>
                            <div className="photo-container-profile">
                                <img id="adjust-photo-profile" src={authO.Photo} alt="" />
                            </div>
                            <input className="input-classic" type="file" onChange={changePhoto} />
                        </div >
                        <div className='divider'>
                            {userCompagnies > 0}{
                                <>
                                    <h2>Mijn organisaties</h2>
                                    <div>
                                        {userCompagnies && userCompagnies.map(compagny => (
                                            <div className='user-compagnies-container'>
                                                <p id='user-compagny' data-compagny={compagny} onClick={linkUserCompagny} >{compagny}</p>
                                                <img src={externalLinkIcon} alt="" data-compagny={compagny} onClick={linkUserCompagny} />
                                            </div>
                                        ))}
                                    </div>
                                </>
                            }
                        </div>
                        <div className="divider account-status">
                            <h2>Account verwijderen</h2>
                            <button id="delete-account-button" onClick={deleteAccount}>Verwijderen</button>
                        </div >
                    </div>
                </div>
        </div>
    )
}

export default Profile
