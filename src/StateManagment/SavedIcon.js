import { createContext, useState } from "react";

export const SavedIcon = createContext()

export const SavedProvider = (props) => {
    const [saved, setSaved] = useState("none")

    setTimeout(() => {
        setSaved('none')
    },3000)

    return(
        <SavedIcon.Provider value={[saved, setSaved]}>
            {props.children}
        </SavedIcon.Provider>
    )
}