import plusIcon from '../images/icons/plus-icon.png'
import sendIcon from '../images/icons/send-icon.png'
import spinnerRipple from '../images/spinner-ripple.svg'
import { db, timestamp, bucket } from "../firebase/config.js"
import { useState } from 'react';
import { client, type } from "../hooks/Client"
import uuid from 'react-uuid';
import { useFirestoreID, useFirestore } from "../firebase/useFirestore"
import firebase from 'firebase';
import { useContext } from 'react';
import { Auth } from '../StateManagment/Auth';
import Location from "../hooks/Location"

const MessageBarGroup = () => {
    const [authO] = useContext(Auth)
    const [Message, setMessage] = useState("")
    const [checkedMessage, setCheckedMessage] = useState("")
    const [fileDisplay, setFileDisplay] = useState("none")
    const [progressBar, setProgressBar] = useState("")

    const route = Location()[3]
    
    const id = uuid()
    const compagny = useFirestore("CompagnyMeta")
    const groups = useFirestoreID("Groups", route)

    const MessageInput = (e) => {
        const input = e.target.value

        setMessage(input)
    }

    let banner = ""

    compagny && compagny.forEach(comp => {
        banner = comp.ActivityBanner.NewMessage
    })
    
   const linkInText = () => {
    
    const urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
    const links = Message.match(urlRegex)

    if(links != null){

        const newText = Message.replace(links[0], `<a href="${links}", target="_blank">${links}</a>`)

        setCheckedMessage(newText)

    } else {
        setCheckedMessage(Message)
    }

   }

    const submitMessage = () => {

        linkInText()

        setTimeout(() => {
            console.log(checkedMessage)
            db.collection("Messages")
            .doc()
            .set({
                Type: "Message",
                Message: checkedMessage,
                Timestamp: timestamp,
                ParentID: route,
                ID: id,
                Compagny: client,
                User: authO.UserName,
                UserPhoto: authO.Photo,
                Email: authO.Email,
                Thread: [],
                Read: [authO.ID],
                UserID: authO.ID
            })
            .then(() => {
                groups && groups.forEach(group => {
                    db.collection("Groups")
                    .doc(group.docid)
                    .update({
                        Messages: firebase.firestore.FieldValue.increment(1)
                    })
                })
            })
            .then(() => {
                setMessage("")
            })
        }, 1000)
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
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
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


    return (
        <div className="messagebar-group-container">
            <div className="messagebar-group-inner-container" >
                <img src={plusIcon} alt=""  onClick={toggleFile}  />
                <textarea 
                type="text" 
                className="message-input" 
                placeholder="Schrijf hier je bericht"
                value = {Message}
                onChange={MessageInput}
                /> 
                <img src={sendIcon} alt="" onClick={submitMessage} /> 
            </div>
            <div>
                <div>{progressBar}</div>
                <input onChange={insertFile} type="file" style={{display: fileDisplay}} />
            </div>
        </div>
    )
}

export default MessageBarGroup
