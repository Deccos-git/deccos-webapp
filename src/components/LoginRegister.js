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

    let logo = ""
    let website = ""

    compagnies && compagnies.map(doc => {
        logo = doc.Logo
        website = doc.Website
    })

    return (
        <div>
        <header className="top-bar">
            <a href={`${website}`}><img src={logo} className="top-bar-logo" alt="logo" /></a>
        </header>
        <div className="main">
             <div className="left-side-bar">
                <div className="channel-div">
                    <div className="channel-inner-div">
                        <p onClick={loginHandler}>Login</p>
                        <p onClick={registerHandler}>Account maken</p>
                    </div>
                </div>
            </div>
            <FormToggle />
        </div>
        </div>
    )
}

export default LoginRegister
