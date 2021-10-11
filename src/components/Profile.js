import RightSideBar from "./rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "./LeftSideBarAuthProfileFullScreen";
import { db, bucket, auth } from "../firebase/config.js"
import {useFirestore } from "../firebase/useFirestore"
import firebase from 'firebase'
import { useHistory } from "react-router";
import { client } from '../hooks/Client';
import { Editor } from '@tinymce/tinymce-react';
import { useRef, useState, useContext } from 'react';
import { Auth } from '../StateManagment/Auth';
import MenuStatus from "../hooks/MenuStatus";

const Profile = () => {

    const [authO, setAuthO] = useContext(Auth)
    const [body, setBody] = useState("")
    const [forName, setForName] = useState(authO.ForName)
    const [surName, setSurName] = useState(authO.SurName)

    const docs = useFirestore("CompagnyMeta")
    const history = useHistory()
    const editorRef = useRef(null);
    const menuState = MenuStatus()

    const bodyHandler = (e) => {
        if (editorRef.current) {
            setBody(editorRef.current.getContent());
            }
    }

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
            history.push(`/${client}/Login`)
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

    const saveUserName = () => {
        db.collection("Users")
        .doc(auth.Docid)
        .update({
            ForName: forName,
            SurName: surName,
            UserName: `${forName} ${surName}`
        })
    }

    const saveAboutMe = () => {
        db.collection("Users")
        .doc(auth.Docid)
        .update({
            About: body
        })
    }

    return (
        <div className="main">
            <LeftSideBarAuthProfile />
            <LeftSideBarAuthProfileFullScreen/>
                <div className="profile profile-auth-profile" style={{display: menuState}}>
                    <div className="profile-inner-container">
                        <div className="card-header">
                            <h1>Account instellingen</h1>
                            <img id="profile-header-photo" src={authO.Photo} alt="" />
                            <h2>{authO.UserName}</h2>
                            <p>Verander de instellingen van je profiel</p>
                        </div>
                        <div className="divider account-status">
                            <h4>Uitloggen</h4>
                            <button id="log-out-button" onClick={logOut}>Uitloggen</button>
                        </div >
                        <div className="divider">
                            <h4>Schermnaam aanpassen</h4>
                            <h5>Voornaam</h5>
                            <input className="input-classic" type="text" placeholder={authO.ForName} onChange={forNameHandler}/>
                            <h5>Achternaam</h5>
                            <input className="input-classic" type="text" placeholder={authO.SurName} onChange={surNameHandler}/>
                            <div className="button-container">
                                <button className="button-simple" onClick={saveUserName}>Opslaan</button>
                            </div>
                        </div >
                        <div className="divider">
                            <h4>Profielfoto aanpassen</h4>
                            <div className="photo-container-profile">
                                <img id="adjust-photo-profile" src={authO.Photo} alt="" />
                            </div>
                            <input className="input-classic" type="file" onChange={changePhoto} />
                        </div >
                        <div className="divider">
                            <h4>Over mij</h4>
                            <Editor onChange={bodyHandler}
                            apiKey="dz1gl9k5tz59z7k2rlwj9603jg6xi0bdbce371hyw3k0auqm"
                            initialValue={authO.About}
                            onInit={(evt, editor) => editorRef.current = editor}
                            init={{
                            height: 500,
                            menubar: false,
                            plugins: [
                                'advlist autolink lists link image charmap print preview anchor',
                                'searchreplace visualblocks code fullscreen',
                                'insertdatetime media table paste code help'
                            ],
                            toolbar: 'undo redo | formatselect | ' +
                            'bold italic backcolor | alignleft aligncenter ' +
                            'alignright alignjustify | bullist numlist outdent indent | ' +
                            'removeformat | help',
                            content_style: 'body { font-family: Raleway, sans-serif; font-size:14px; color: gray }'
                            }}
                            />
                            <div className="button-container">
                                <button className="button-simple" onClick={saveAboutMe}>Opslaan</button>
                            </div>
                        </div>
                        <div className="divider account-status">
                            <h4>Account verwijderen</h4>
                            <button id="delete-account-button" onClick={deleteAccount}>Verwijderen</button>
                        </div >
                    </div>
                </div>
            <RightSideBar />
        </div>
    )
}

export default Profile
