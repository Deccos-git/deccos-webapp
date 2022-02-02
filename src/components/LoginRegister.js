import Login from "./Login"
import Register from "./Register"
import { useState } from "react"
import { useFirestore } from "../firebase/useFirestore"
import NewUserIcon from '../images/icons/new-user-icon.png'
import DoorIcon2 from '../images/icons/door-icon-2.png'
import Colors from "../hooks/Colors";

const LoginRegister = () => {

    const [form, setForm] = useState("Login")

    const compagnies = useFirestore("CompagnyMeta")
    const colors = Colors()

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
        <header className="top-bar" style={{backgroundColor: colors.TopBarColor}}>
            <a href={`${website}`}><img src={logo} className="top-bar-logo" alt="logo" /></a>
        </header>
        <div className="main-login-register" style={{backgroundColor: colors.BackgroundColor}}>
             <div className="left-side-bar-login-register">
                <div className="channel-div-login-register">
                    <div className="channel-inner-div-login-register">
                        <div className='login-register-container' onClick={loginHandler}>
                            <img src={DoorIcon2} alt=""/>
                            <p>Login</p>
                        </div>
                        <div className='login-register-container' onClick={registerHandler}>
                            <img src={NewUserIcon} alt=""/>
                            <p>Account maken</p>
                        </div>
                    </div>
                </div>
            </div>
            <FormToggle />
        </div>
        </div>
    )
}

export default LoginRegister
