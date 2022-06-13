import { createContext, useState, useEffect } from "react";
import { db } from "../firebase/config";
import { client } from "../hooks/Client";

export const Premium = createContext()

export const PremiumProvider = (props) => {
    const [premium, setPremium] = useState("")

    const getPremium = () => {

        const unsub = db.collection("CompagnyMeta")
                .where("Compagny", "==", client)
                .onSnapshot(querySnapshot => {
                    querySnapshot.forEach (doc => {
                        console.log(doc)
                    setPremium({...doc.data(), docid: doc.id})
                })
            })
                return () => unsub();   
    }   

    useEffect(() => {
        getPremium()
    }, [])

    return(
        <Premium.Provider value={[premium]}>
            {props.children}
        </Premium.Provider>
    )
}