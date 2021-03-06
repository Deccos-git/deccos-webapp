import RightSideBar from "../rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "../LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "../LeftSideBarAuthProfileFullScreen";
import { useState } from "react";
import { db } from "../../firebase/config";
import { Editor } from '@tinymce/tinymce-react';
import { useRef, useEffect } from 'react';
import firebase from 'firebase'
import { bucket } from '../../firebase/config';
import { useFirestore } from "../../firebase/useFirestore";
import { client } from "../../hooks/Client";
import MenuStatus from "../../hooks/MenuStatus";
import ScrollToTop from "../../hooks/ScrollToTop";

const WelcomeSettings = () => {
    const menuState = MenuStatus()
    ScrollToTop()

    useEffect(() => {
        db.collection("CompagnyMeta")
        .where("Compagny", "==", client)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {

                const ruleOne = doc.data().Rules[0]
                const ruleTwo = doc.data().Rules[1]
                const ruleThree = doc.data().Rules[2]
                const ruleFour = doc.data().Rules[3]

                setRuleOne(ruleOne)
                setRuleTwo(ruleTwo)
                setRuleThree(ruleThree)
                setRuleFour(ruleFour)

            })
        })
    }, [])

    const compagnies = useFirestore("CompagnyMeta")

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

    const saveWelcomeText = (e) => {

        e.target.innerHTML = "Opgeslagen"
        e.target.className = "button-clicked"

        compagnies && compagnies.forEach(compagny => {
            db.collection("CompagnyMeta")
            .doc(compagny.docid)
            .update({
                WelcomeText: welcomeText
            })
        })
    }

    const ruleOneHandler = (e) => {
        const rule = e.target.value

        setRuleOne(rule)
    }

    const ruleTwoHandler = (e) => {
        const rule = e.target.value

        setRuleTwo(rule)
    }

    const ruleThreeHandler = (e) => {
        const rule = e.target.value

        setRuleThree(rule)
    }

    const ruleFourHandler = (e) => {
        const rule = e.target.value

        setRuleFour(rule)
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

        compagnies && compagnies.forEach(compagny => {
            db.collection("CompagnyMeta")
            .doc(compagny.docid)
            .update({
                Rules: rulesArray
            })
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
        compagnies && compagnies.forEach(compagny => {
            db.collection("CompagnyMeta")
            .doc(compagny.docid)
            .update({
                WelcomeHeader: banner
            })
        })
    }

    return (
        <div className="main">
            <LeftSideBarAuthProfile />
            <LeftSideBarAuthProfileFullScreen/>
            {compagnies && compagnies.map(compagny => (
            <div className='profile profile-auth-profile' key={compagny.ID} style={{display: menuState}}>
                <div className="settings-inner-container">
                    <div className="divider card-header">
                        <h1>Welkom</h1>
                        <p>Pas de instellingen van de welkomspagina van {compagny.CommunityName}</p>
                    </div>
                    <div className="divider">
                        <h2>Welkomsbanner aanpassen</h2>
                        <img id="welcome-banner" src={compagny.WelcomeHeader} alt="" />
                        <input className="input-classic" onChange={photoHandler} type="file" />
                    </div>
                    <div className="divider">
                        <h2>Welkomstext aanpassen</h2>
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
                        <h2>Community regels aanpassen</h2>
                        <div className="rule-input-container">
                            <p>1.</p>
                            <input type="text" placeholder={ruleOne} onChange={ruleOneHandler}/>
                        </div>
                        <div className="rule-input-container">
                            <p>2.</p>
                            <input type="text" placeholder={ruleTwo} onChange={ruleTwoHandler}/>
                        </div>
                        <div className="rule-input-container">
                            <p>3.</p>
                            <input type="text" placeholder={ruleThree} onChange={ruleThreeHandler}/>
                        </div>
                        <div className="rule-input-container">
                            <p>4.</p>
                            <input type="text" placeholder={ruleFour} onChange={ruleFourHandler}/>
                        </div>
                        <div className="button-container button-container-top">
                            <button className="button-simple" onClick={saveRules}>Opslaan</button>
                        </div>
                    </div>
                </div>
            </div>
             ))}
            <RightSideBar/>
        </div>
    )
}

export default WelcomeSettings
