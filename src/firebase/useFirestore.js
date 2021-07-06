import { db } from "./firebase.js"
import { client } from '../hooks/Client';
import { useState, useEffect } from 'react';

console.log(client)

const useFirestore = (collection) => {

    const [docs, setDocs] = useState("")

    useEffect(() => {
        const unsub = db.collection(collection)
        .where("Compagny", "==", client)
        .onSnapshot(querySnapshot => {
            let bodyArray = []
            querySnapshot.forEach(doc => {
                bodyArray.push({...doc.data(), docid: doc.id})
            })
            setDocs(bodyArray)
        })
        
        return () => unsub();

    }, [collection])  

    return docs
};

export default useFirestore