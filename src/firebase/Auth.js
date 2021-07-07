import { auth, db } from "./config";
import { useState, useEffect } from 'react';

const Auth = () => {

    const [docs, setDocs] = useState("")
    useEffect(() => {
        const docArray = []
        const unsub = auth.onAuthStateChanged(User =>{
            if(User){
                db.collection("Users")
                .doc(User.uid)
                .get()
                .then(doc => {
                    docArray.push({...doc.data()})
                })
                setDocs(docArray)
            } else {
                return
            }
        })
        return () => unsub();
    }, [])
    return docs
}

export default Auth