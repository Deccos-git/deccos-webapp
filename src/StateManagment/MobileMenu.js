import { createContext, useState } from "react";

export const MobileMenu = createContext()

export const MenuProvider = (props) => {
    const [menu, setMenu] = useState("none")

    return(
        <MobileMenu.Provider value={[menu, setMenu]}>
            {props.children}
        </MobileMenu.Provider>
    )
}