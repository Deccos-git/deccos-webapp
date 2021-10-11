import { createContext, useState, useEffect } from "react";
import { db, auth } from "../firebase/config";
import { client } from "../hooks/Client";

export const Auth = createContext()

export const AuthProvider = (props) => {
    const [authO, setAuthO] = useState("")

    const getUserID = async () => {

        await  auth.onAuthStateChanged(User =>{
            if(User){
                const unsub = db.collection("Users")
                .where("Compagny", "==", client)
                .where("Email", "==", User.email)
                .onSnapshot(querySnapshot => {
                    querySnapshot.forEach (doc => {
                    setAuthO(doc.data())
                })
            })

                return () => unsub();
                
            } else {
                return
            }
        })
    }   

    useEffect(() => {
        getUserID()
    }, [])

    return(
        <Auth.Provider value={[authO]}>
            {props.children}
        </Auth.Provider>
    )
}