import { useState } from "react"
import { db, timestamp, bucket} from "../../firebase/config"
import plusIcon from '../../images/icons/plus-icon.png'
import sendIcon from '../../images/icons/send-icon.png'
import { client } from "../../hooks/Client"
import { useContext } from "react"
import uuid from 'react-uuid';
import firebase from "firebase"
import { useLocation } from "react-router-dom"
import { Auth } from '../../StateManagment/Auth';
import Location from "../../hooks/Location"

const ReactionBar = ({message}) => {
    const [authO] = useContext(Auth)

    const [reaction, setReaction] = useState("")
    const [fileDisplay, setFileDisplay] = useState("none")
    
    const id = uuid()
    const location = useLocation()
    const localRoute = `${Location()[2]}/${Location()[3]}` 
    
    const reactionHandler = (e) => {

        const reaction = e.target.value

        setReaction(reaction)
    }

    const submitReaction = () => {

        db.collection("Messages")
        .doc()
        .set({
            Type: "Reaction",
            ParentID: message.ID,
            Message: reaction,
            Likes: 0,
            Compagny: client,
            Timestamp: timestamp,
            PrevPath: location.pathname,
            User: authO.UserName,
            UserPhoto: authO.Photo,
            Email: authO.Email,
            ID: uuid(),
            Thread: [],
            Read: [authO.ID],
            UserID: authO.ID,
            UserDocID: authO.Docid,
            Contributions: [],
            Public: true
        })
        .then(() => {
            setReaction("")
        })
        .then(() => {
            db.collection("Notifications")
            .doc()
            .set({
                MessageID: message.ID,
                ParentID: message.ID,
                MessageBody: message.Message,
                Route: localRoute,
                Reaction: reaction,
                Timestamp: timestamp,
                SenderID: authO.ID,
                SenderName: authO.UserName,
                SenderPhoto: authO.Photo,
                Email: authO.Email,
                RecieverID: message.UserID,
                Header:`${authO.UserName} heeft gereageerd op jouw bericht`,
                SubHeader:``,
                Read: false,
                ID: uuid(),
                Compagny: client,
                Type: "Reaction"
            })
        })
        .then(() => {
            window.location.reload(false)
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

        console.log(fileType)

        const storageRef = bucket.ref(`/${client}_${authO.ID}/` + file.name);
        const uploadTask = storageRef.put(file)

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

            if(fileType[0] === "image"){
                setReaction(
                    `
                    <img style="width:80%" src="${downloadURL}">
                    `
                    )
            } else if(fileType[0] === "video"){
                setReaction(
                    `
                <video width="90%" height="90%" controls autoplay muted>
                    <source src="${downloadURL}">
                </video>
                `
                )
            } else if(fileType[0] === "application"){
                setReaction(
                `
                <embed src="${downloadURL}" width="90% height="90%"></embed>
                `
                )
            } else {
                setReaction(downloadURL)
            }
                })
            })
        })
    }

    return (
        <div>
            <div className="reaction-bar-container">
                <img src={plusIcon} alt="" onClick={toggleFile} />
                <textarea type="text" placeholder="Schrijf hier je reactie" value={reaction} onChange={reactionHandler} />
                <img src={sendIcon} alt="" onClick={submitReaction} />
            </div>
            <div>
                <input onChange={insertFile} type="file" style={{display: fileDisplay}} />
            </div>
        </div>
    )
}

export default ReactionBar
