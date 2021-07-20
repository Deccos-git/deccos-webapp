import RightSideBar from "./rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import { db, bucket } from "../firebase/config.js"
import {useFirestore } from "../firebase/useFirestore"
import firebase from 'firebase'
import { useState } from "react";
import { Editor } from '@tinymce/tinymce-react';
import { useRef } from 'react';

const Settings = () => {

    const [logo, setLogo] = useState("")
    const [communityName, setCommunityName] = useState("")
    const [welcomeText, setWelcomeText] = useState("")

    const docs = useFirestore("CompagnyMeta")
    const editorRef = useRef(null);

    docs && docs.forEach(doc => {
    })

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

    const bodyHandler = (e) => {
        if (editorRef.current) {
            setWelcomeText(editorRef.current.getContent());
            }
    }

    const saveWelcomeText = () => {
        docs && docs.forEach(doc => {
            db.collection("CompagnyMeta")
            .doc(doc.docid)
            .update({
                WelcomeText: welcomeText
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
                <div className="divider">
                    <h4>Welkomstext aanpassen</h4>
                    {docs && docs.map(doc =>(
                    <Editor onChange={bodyHandler}
                        apiKey="dz1gl9k5tz59z7k2rlwj9603jg6xi0bdbce371hyw3k0auqm"
                        initialValue={doc.WelcomeText}
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
                    ))}
                    <div className="button-container">
                        <button onClick={saveWelcomeText}>Opslaan</button>
                    </div>
                </div >
            </div>
            ))}
            <RightSideBar />
        </div>
    )
}

export default Settings
