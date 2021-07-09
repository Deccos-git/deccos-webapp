import { useState, createContext } from "react";

export const FirestoreContext = createContext()

export const FirestoreProvider = () => {
    const [docs, setDocs] = useState("")
}