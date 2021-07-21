import Login from "./Login"
import Register from "./Register"
import { useState } from "react"
import { useFirestore } from "../firebase/useFirestore"

const LoginRegister = () => {

    const [form, setForm] = useState("Login")

    const compagnies = useFirestore("CompagnyMeta")

    const loginHandler = () => {
        setForm("Login")
    }

    const registerHandler = () => {
        setForm("Register")
    }

    const FormToggle = () => {
        if(form === "Login"){
            return <Login />
        } else if (form === "Register"){
            return <Register />
        }
    }

    return (
        <div className="main">
             <div className="left-side-bar">
                {compagnies && compagnies.map(compagny => (
                    <div className="channel-div">
                        <h3>{compagny.CommunityName}</h3>
                        <div className="channel-inner-div">
                            <p onClick={loginHandler}>Login</p>
                            <p onClick={registerHandler}>Register</p>
                        </div>
                     </div>
                    ))}
            </div>
            <FormToggle />
        </div>
    )
}

export default LoginRegister
