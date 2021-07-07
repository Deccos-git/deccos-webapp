import { db } from "./config.js"
import { client } from '../hooks/Client';
import { useState, useEffect } from 'react';

const useFirestore = (collection) => {

    const [docs, setDocs] = useState("")

    useEffect(() => {
        const unsub = db.collection(collection)
        .where("Compagny", "==", client)
        .onSnapshot(querySnapshot => {
            let docArray = []
            querySnapshot.forEach(doc => {
                docArray.push({...doc.data(), docid: doc.id})
            })
            setDocs(docArray)
        })
        
        return () => unsub();

    }, [collection])  

    return docs
};

const useFirestoreID = (collection, id) => {

    const [docs, setDocs] = useState("")

    useEffect(() => {
        const unsub = db.collection(collection)
        .where("Compagny", "==", client)
        .where("ID", "==", id)
        .onSnapshot(querySnapshot => {
            let docArray = []
            querySnapshot.forEach(doc => {
                docArray.push({...doc.data(), docid: doc.id})
            })
            setDocs(docArray)
        })
        
        return () => unsub();

    }, [collection])  

    return docs
};

const useFirestoreTimestamp = (collection) => {

    const [docs, setDocs] = useState("")

    useEffect(() => {
        const unsub = db.collection(collection)
        .where("Compagny", "==", client)
        .orderBy("Timestamp", "desc")
        .onSnapshot(querySnapshot => {
            let docArray = []
            querySnapshot.forEach(doc => {
                docArray.push({...doc.data(), docid: doc.id})
            })
            setDocs(docArray)
        })
        
        return () => unsub();

    }, [collection])  

    return docs
};

export { useFirestore, useFirestoreID, useFirestoreTimestamp}