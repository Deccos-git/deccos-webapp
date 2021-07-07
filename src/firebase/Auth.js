import { auth, db } from "./config";
import { useState, useEffect } from 'react';

const Auth = () => {

    const [docs, setDocs] = useState("")
    useEffect(() => {
        const unsub = auth.onAuthStateChanged(User =>{
            if(User){
                db.collection("Members")
                .doc(User.uid)
                .get()
                const docArray = []
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