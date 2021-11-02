import { createContext, useState, useEffect } from "react";
import { db } from "../firebase/config";
import { client } from "../hooks/Client";

export const Colors = createContext()

export const ColorProvider = (props) => {
    const [colors, setColors] = useState("")

    const getColors = () => {

        const unsub = db.collection("Colors")
                .where("Compagny", "==", client)
                .onSnapshot(querySnapshot => {
                    querySnapshot.forEach (doc => {
                    setColors(doc.data())
                })
            })
                return () => unsub();   
    }   

    useEffect(() => {
        getColors()
    }, [])

    return(
        <Colors.Provider value={[colors]}>
            {props.children}
        </Colors.Provider>
    )
}