import { auth, db, timestamp } from "./config";
import { client } from "../hooks/Client";
import uuid from 'react-uuid';

const Register = (email, password, userName) => {

    const id = uuid()

    auth
    .createUserWithEmailAndPassword(email, password, photo)
    .then(() => {
        db.collection("Users")
        .doc()
        .set({
            UserName: userName,
            Compagny: client,
            Timestamp: timestamp,
            Email: email,
            Photo: photo,
            Channels: []
        })
    })
    .then(() => {
        db.collection("AllActivity")
        .doc()
        .set({
            Title: userName,
            Type: "NewMember",
            Compagny: client,
            Timestamp: timestamp,
            ID: id
        }) 
    })
}

export default Register

