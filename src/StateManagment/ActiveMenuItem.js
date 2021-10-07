import { createContext, useState } from "react";

export const ActiveMenu = createContext()

export const ActiveMenuProvider = (props) => {
    const [active, setActive] = useState("none")

    return(
        <ActiveMenu.Provider value={[active, setActive]}>
            {props.children}
        </ActiveMenu.Provider>
    )
}