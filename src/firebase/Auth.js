import { auth, db } from "./config";
import { useState, useEffect } from 'react';

const Auth = () => {

    const [docs, setDocs] = useState("")

    const getUserID = async () => {

        await  auth.onAuthStateChanged(User =>{
            if(User){
                db.collection("Users")
                .doc(User.uid)
                .get()
                .then(doc => {
                    setDocs(doc.data())
                })
            }
        })
    }   

    useEffect(() => {
        getUserID()
    }, [])

    return docs 
}

 

export default Auth