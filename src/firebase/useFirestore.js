import { db } from "./config.js"
import { useState, useEffect} from 'react';
import { client } from '../hooks/Client';

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

    }, [collection, id])  

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

const useFirestoreUser = (userID) => {

    const [docs, setDocs] = useState("")
    const docArray = []
    useEffect(() => {
        db.collection("Users")
        .doc(userID)
        .get()
        .then(doc => {
            docArray.push({...doc.data()})
        })
        setDocs(docArray)

    }, [userID])  

    return docs
};

export { useFirestore, useFirestoreID, useFirestoreTimestamp, useFirestoreUser}