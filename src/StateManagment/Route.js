import { useState, createContext } from "react"

export const Route = createContext()

export const RouteProvider = (props) => {
    const [route, setRoute] = useState("")

    return(
        <Route.Provider value={[route, setRoute]}>
            {props.children}
        </Route.Provider>

    )
}