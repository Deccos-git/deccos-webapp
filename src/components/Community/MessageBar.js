import plusIcon from '../../images/icons/plus-icon.png'
import sendIcon from '../../images/icons/send-icon.png'
import { db, timestamp, bucket } from "../../firebase/config.js"
import { useState, useEffect, useContext } from 'react';
import firebase from "firebase"
import { client } from "../../hooks/Client"
import uuid from 'react-uuid';
import { useFirestore } from "../../firebase/useFirestore"
import { useLocation } from "react-router-dom"
import { Auth } from '../../StateManagment/Auth';
import Location from "../../hooks/Location";
import { useHistory } from "react-router-dom";
import GetYearMonth from '../../hooks/GetYearMonth'

const MessageBar = () => {
    const [authO, setAuthO] = useContext(Auth)
    const [message, setMessage] = useState("")
    const [fileDisplay, setFileDisplay] = useState("none")
    const [progressBar, setProgressBar] = useState("")

    const route = Location()[3]
    const id = uuid()
    const chats = useFirestore("Chats", route)
    const location = useLocation()
    const history = useHistory()
    const getYearMonth = GetYearMonth()

    const MessageInput = (e) => {
        const input = e.target.value

        setMessage(input)
    }

    const submitMessage = () => {

        setMessage("")

        db.collection("Messages")
        .doc()
        .set({
            Type: "Message",
            Message: message,
            Timestamp: timestamp,
            ParentID: route,
            PrevPath: location.pathname,
            ID: id,
            Likes: 0,
            Compagny: client,
            User: authO.UserName,
            UserPhoto: authO.Photo,
            UserDocID: authO.Docid,
            Email: authO.Email,
            Thread: [],
            Read: [authO.ID],
            UserID: authO.ID,
            Contributions: [],
            Public: true
        })
        .then(() => {
            chats && chats.forEach(chat => {
                db.collection("Chats")
                .doc(chat.docid)
                .update({
                    NewMessages: "newMessages"
                })
            })
        })
        .then(() => {
            db.collection("Search")
            .doc()
            .set({
                Name: message,
                Compagny: client,
                Type: 'Reactie',
                Link: `MessageDetail/${id}`
            })
        })
        .then(() => {
            db.collection("MessageGraph")
            .where("Compagny", "==", client)
            .where("Month", "==", getYearMonth)
            .get()
            .then(querySnapshot => {
                if(querySnapshot.empty === false){
                    querySnapshot.forEach(doc => {

                        console.log("bestaat")

                        db.collection("MessageGraph")
                        .doc(doc.id)
                        .update({
                            Contributions: firebase.firestore.FieldValue.increment(1)
                        })
                    })
                } else if (querySnapshot.empty === true){
                    console.log("bestaat niet")
                    db.collection("MessageGraph")
                    .doc()
                    .set({
                        Month: getYearMonth,
                        Contributions: 1,
                        Compagny: client,
                        LastActive: timestamp,
                        ID: uuid(),
                    })
                } 
            })
        })

        setMessage("")
    }

    const toggleFile = () => {

        if(fileDisplay === "none"){
            setFileDisplay("block")
        } else {
            setFileDisplay("none")
        }

    }

    const insertFile = (e) => {
        const file = e.target.files[0]

        const fileType = file.type.split("/")

        setProgressBar("Bezig..")

        const storageRef = bucket.ref(`/${client}_${authO.ID}/` + file.name);
        const uploadTask = storageRef.put(file)

        uploadTask.then(() => {
          
            uploadTask.on('state_changed', snapshot => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(progress)
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
                setProgressBar("")

                if(fileType[0] === "image"){
                    setMessage(
                        `
                        <img style="width:80%" src="${downloadURL}">
                        `
                        )
                } else if(fileType[0] === "video"){
                    setMessage(
                        `
                        <video width="90%" height="90%" controls autoplay muted>
                            <source src="${downloadURL}">
                        </video>
                        `
                    )
                } else if(fileType[0] === "application"){
                    setMessage(
                        `
                        <embed src="${downloadURL}" width="90% height="90%"></embed>
                        `
                    )
                } else {
                    setMessage(downloadURL)
                }

                })
            })
        })
    }

    const profileLink = (e) => {
        const id = e.target.dataset.id

        history.push(`/${client}/PublicProfile/${id}`)
    }

    return (
        <div className="massage-container">
            <div>
                <img className="user-image" src={authO.Photo} alt="" data-id={authO.ID} onClick={profileLink} />
            </div>
            <div className="messagebar-outer-cointainer">
                <div className="messagebar-container">
                    <img src={plusIcon} alt=""  onClick={toggleFile} />
                    <textarea 
                    type="text" 
                    className="message-input" 
                    placeholder="Schrijf hier je bericht"
                    value = {message}
                    onChange={MessageInput}
                    /> 
                    <img src={sendIcon} alt="" onClick={submitMessage} /> 
                </div>
                <div>
                    <div>{progressBar}</div>
                    <input onChange={insertFile} type="file" style={{display: fileDisplay}} />
                </div>
            </div>
        </div>
    )
}

export default MessageBar
