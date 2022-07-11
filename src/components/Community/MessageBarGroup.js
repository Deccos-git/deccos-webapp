import plusIcon from '../../images/icons/plus-icon.png'
import sendIcon from '../../images/icons/send-icon.png'
import spinnerRipple from '../../images/spinner-ripple.svg'
import { db, bucket } from "../../firebase/config.js"
import { useState, useContext, useEffect } from 'react';
import { client, type } from "../../hooks/Client"
import uuid from 'react-uuid';
import { useFirestoreID, useFirestore } from "../../firebase/useFirestore"
import firebase from 'firebase';
import { Auth } from '../../StateManagment/Auth'
import Location from "../../hooks/Location"

const MessageBarGroup = () => {
    const [authO] = useContext(Auth)
    const [Message, setMessage] = useState("")
    const [fileDisplay, setFileDisplay] = useState("none")
    const [progressBar, setProgressBar] = useState("")
    const [members, setMembers] = useState('')

    const route = Location()[3]
    const timestamp = firebase.firestore.Timestamp.fromDate(new Date())
    
    const id = uuid()
    const compagny = useFirestore("CompagnyMeta")
    const groups = useFirestoreID("Groups", route)
    const chats = useFirestoreID("Chats", route)

    useEffect(() => {
        groups && groups.forEach(group => {
            setMembers(group.Members)
        })
    }, [groups])

    useEffect(() => {
        chats && chats.forEach(chat => {
            setMembers(chat.MemberList)
        })
    }, [groups])

    const MessageInput = (e) => {
        const input = e.target.value

        setMessage(input)
    }
    
    const submitMessage = () => {

        db.collection("Messages")
        .doc()
        .set({
            Type: "Message",
            Message: Message,
            Timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
            ParentID: route,
            ID: id,
            Likes: 0,
            CompagnyID: client,
            User: authO.UserName,
            UserPhoto: authO.Photo,
            Email: authO.Email,
            Channel: 'Chat',
            Read: [authO.ID],
            UserID: authO.ID
        })
        .then(() => {
            setMessage("")
        })
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
