import { useState, createContext, useEffect } from "react";
import { client } from '../hooks/Client';
import { db } from "../firebase/config.js"

export const AllActivityContext = createContext()
export const CompagnyContext = createContext()

export const AllActivityProvider = props => {
    const [allActivity, setAllActivity] = useState("")

    useEffect( () => {
        const unsub = db.collection("AllActivity")
        .where("Compagny", "==", client)
        .onSnapshot(querySnapshot => {
            let docArray = []
            querySnapshot.forEach(doc => {
                docArray.push({...doc.data(), docid: doc.id})
            })
            setAllActivity(docArray)
        })
        
        return () => unsub();

    }, []) 

    return (
        <AllActivityContext.Provider value={[allActivity, setAllActivity]}>
            {props.children}
        </AllActivityContext.Provider>
    ) 
}

export const CompagnyProvider = props => {
    const [compagny, setCompagny] = useState("")

    useEffect( () => {
        const unsub = db.collection("CompagnyMeta")
        .where("Compagny", "==", client)
        .onSnapshot(querySnapshot => {
            let docArray = []
            querySnapshot.forEach(doc => {
                docArray.push({...doc.data(), docid: doc.id})
            })
            setCompagny(docArray)
        })
        
        return () => unsub();

    }, []) 

    return (
        <CompagnyContext.Provider value={[compagny, setCompagny]}>
            {props.children}
        </CompagnyContext.Provider>
    ) 
}