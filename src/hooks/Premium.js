import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { client } from "../hooks/Client";

const Premium = () => {
    const [premium, setPremium] = useState("")

    const getPremium = () => {

        const unsub = db.collection("CompagnyMeta")
                .where("CompagnyID", "==", client)
                .onSnapshot(querySnapshot => {
                    querySnapshot.forEach (doc => {
                        const premium = doc.data().Premium
                    setPremium(premium)
                })
            })
                return () => unsub();   
    }   

    useEffect(() => {
        getPremium()
    }, [])

  return (
    premium
  )
}

export default Premium

