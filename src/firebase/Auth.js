import { auth, db } from "./config";
import { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { client } from '../hooks/Client';

const Auth = () => {

    const [docs, setDocs] = useState("")

    const history = useHistory();

    const getUserID = async () => {

        await  auth.onAuthStateChanged(User =>{
            if(User){
                db.collection("Users")
                .doc(User.uid)
                .onSnapshot(doc => {
                    setDocs(doc.data())
                })
            } else {
                history.push(`/${client}/Register`)
            }
        })
    }   

    useEffect(() => {
        getUserID()
    }, [])

    return docs 

}

 

export default Auth