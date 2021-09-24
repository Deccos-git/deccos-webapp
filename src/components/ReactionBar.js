import { useState } from "react"
import { db, timestamp, bucket} from "../firebase/config"
import plusIcon from '../images/icons/plus-icon.png'
import sendIcon from '../images/icons/send-icon.png'
import { client } from "../hooks/Client"
import { useContext } from "react"
import uuid from 'react-uuid';
import firebase from "firebase"
import { useLocation } from "react-router-dom"
import { Auth } from '../StateManagment/Auth';

const ReactionBar = ({message}) => {
    const [authO] = useContext(Auth)

    const [reaction, setReaction] = useState("")
    const [fileDisplay, setFileDisplay] = useState("none")
    
    const id = uuid()
    const location = useLocation()
    
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
            Compagny: client,
            Timestamp: timestamp,
            PrevPath: location.pathname,
            User: authO.UserName,
            UserPhoto: authO.Photo,
            ID: id,
            Thread: [],
            Read: [authO.ID],
            UserID: authO.ID,
            Contributions: [],
            Public: true
        })
        .then(() => {
            db.collection("Messages")
            .doc(message.docid)
            .update({
                Thread: firebase.firestore.FieldValue.arrayUnion(id)
            })
        })
        .then(() => {
            setReaction("")
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

            setReaction(downloadURL)

                })
            })
        })
    }

    return (
        <div>
            <div className="reaction-bar-container">
                <img src={plusIcon} alt="" onClick={toggleFile} />
                <input type="text" placeholder="Schrijf hier je reactie" value={reaction} onChange={reactionHandler} />
                <img src={sendIcon} alt="" onClick={submitReaction} />
            </div>
            <div>
                <input onChange={insertFile} type="file" style={{display: fileDisplay}} />
            </div>
        </div>
    )
}

export default ReactionBar
