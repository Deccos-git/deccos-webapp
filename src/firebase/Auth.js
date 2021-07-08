import { auth, db } from "./config";
import { useState, useEffect } from 'react';

const Auth = (collection) => {

    const [docs, setDocs] = useState("")
    useEffect(() => {
        const docArray = []
        const unsub = auth.onAuthStateChanged(User =>{
            if(User){
                db.collection(collection)
                .doc(User.uid)
                .get()
                .then(doc => {
                    docArray.push({...doc.data()})
                    const username = doc.data().UserName
                    console.log(`Auth: ${username}`)
                })
                setDocs(docArray)
            } else {
                return
            }
        })
        return () => unsub();
    }, [collection])
    return docs
}

export default Auth