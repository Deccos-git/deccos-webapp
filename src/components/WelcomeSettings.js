import RightSideBar from "./rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import { useState } from "react";
import { db } from "../firebase/config";
import { Editor } from '@tinymce/tinymce-react';
import { useRef } from 'react';
import firebase from 'firebase'
import { bucket } from '../firebase/config';

const WelcomeSettings = ({compagny, auth}) => {
    const [welcomeText, setWelcomeText] = useState("")
    const [ruleOne, setRuleOne] = useState("")
    const [ruleTwo, setRuleTwo] = useState("")
    const [ruleThree, setRuleThree] = useState("")
    const [ruleFour, setRuleFour] = useState("")

    const editorRef = useRef(null);
   

    const bodyHandler = (e) => {
        if (editorRef.current) {
            setWelcomeText(editorRef.current.getContent());
            }
    }

    const banner = compagny.WelcomeHeader

    const saveWelcomeText = (e) => {

        e.target.innerHTML = "Opgeslagen"
        e.target.className = "button-clicked"

        db.collection("CompagnyMeta")
        .doc(compagny.docid)
        .update({
            WelcomeText: welcomeText
        })
    }

    const ruleOneHandler = (e) => {
        const ruleOne = e.target.value

        setRuleOne(ruleOne)
    }

    const ruleTwoHandler = (e) => {
        const ruleTwo = e.target.value

        setRuleTwo(ruleTwo)
    }

    const ruleThreeHandler = (e) => {
        const ruleThree = e.target.value

        setRuleThree(ruleThree)
    }

    const ruleFourHandler = (e) => {
        const ruleFour = e.target.value

        setRuleFour(ruleFour)
    }

    const rulesArray = [
        ruleOne,
        ruleTwo,
        ruleThree,
        ruleFour
    ]

    const saveRules = (e) => {

        e.target.innerHTML = "Opgeslagen"
        e.target.className = "button-clicked"

        db.collection("CompagnyMeta")
        .doc(compagny.docid)
        .update({
            Rules: rulesArray
        })
    }

    const photoHandler = (e) => {
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
            console.log('File available at', downloadURL)

            saveBanner(downloadURL)

                })
            })
        })
    }

    const saveBanner = (banner) => {
        db.collection("CompagnyMeta")
        .doc(compagny.docid)
        .update({
            WelcomeHeader: banner
        })
    }

    return (
        <div className="main">
            <LeftSideBarAuthProfile />
            <div className='profile'>
                <div className="divider card-header">
                    <h2>Welkom instellingen</h2>
                    <p>Pas de instellingen van de welkomspagina van je community</p>
                </div>
                <div className="divider">
                    <h4>Welkomsbanner aanpassen</h4>
                    <img id="welcome-banner" src={banner} alt="" />
                    <input className="input-classic" onChange={photoHandler} type="file" />
                </div>
                <div className="divider">
                    <h4>Welkomstext aanpassen</h4>
                    <Editor onChange={bodyHandler}
                        apiKey="dz1gl9k5tz59z7k2rlwj9603jg6xi0bdbce371hyw3k0auqm"
                        initialValue={compagny.WelcomeText}
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
                    <div className="button-container button-container-top">
                        <button className="button-simple" onClick={saveWelcomeText}>Opslaan</button>
                    </div>
                </div >
                <div className="divider">
                    <h4>Community regels aanpassen</h4>
                    <div className="rule-input-container">
                        <p>1.</p>
                        <input type="text" placeholder={compagny.Rules[0]} onChange={ruleOneHandler}/>
                    </div>
                    <div className="rule-input-container">
                        <p>2.</p>
                        <input type="text" placeholder={compagny.Rules[1]} onChange={ruleTwoHandler}/>
                    </div>
                    <div className="rule-input-container">
                        <p>3.</p>
                        <input type="text" placeholder={compagny.Rules[2]} onChange={ruleThreeHandler}/>
                    </div>
                    <div className="rule-input-container">
                        <p>4.</p>
                        <input type="text" placeholder={compagny.Rules[3]} onChange={ruleFourHandler}/>
                    </div>
                    <div className="button-container button-container-top">
                        <button className="button-simple" onClick={saveRules}>Opslaan</button>
                    </div>
                </div>
            </div>
            <RightSideBar/>
        </div>
    )
}

export default WelcomeSettings
