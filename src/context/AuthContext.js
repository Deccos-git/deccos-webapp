import { createContext } from "react";
import { auth, db } from "../firebase/config";
import { useState, useEffect } from 'react';

const AuthContext = () => {

    const authArray = []

        auth.onAuthStateChanged(User =>{
            if(User){
            const unsub = db.collection("Users")
            .doc(User.uid)
            .get()
            .then(doc => {
                authArray.push(doc.data())
            })

            return () => unsub();
        }
    })

    console.log(authArray)

    return authArray 

}

export  default AuthContext
