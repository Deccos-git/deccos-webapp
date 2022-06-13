import { createContext, useState } from "react";

export const SavedIcon = createContext()

export const SavedProvider = (props) => {
    const [saved, setSaved] = useState("none")

    return(
        <SavedIcon.Provider value={[saved, setSaved]}>
            {props.children}
        </SavedIcon.Provider>
    )
}