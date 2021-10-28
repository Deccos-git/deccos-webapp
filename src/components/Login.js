import { useState } from 'react';
import { client } from '../hooks/Client';
import { auth, db } from '../firebase/config';
import { useHistory } from "react-router-dom";

const Login = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const history = useHistory();

    const emailHandler = (e) => {
        const email = e.target.value
        setEmail(email)
    }

    const passwordHandler = (e) => {
        const password = e.target.value
        setPassword(password)
    }

    const loginHandler = (e) => {
        e.preventDefault()
        e.target.innerText = 'Inloggen'

        auth.signInWithEmailAndPassword(email, password)
        .catch(err => {
            console.log(err)
            if(err){
                alert(err)
            } else {
                return
            }
        })
        .then(() => {
            history.push(`/${client}/AllActivity`)
        })
    }

    return (
        <div className="main">
            <div className="login-container">
                <h2>Login</h2>
                <form id="login-form">
                    <p>Email</p>
                    <input onChange={emailHandler} type="email" placeholder="Schrijf hier je emailadres" />
                    <p>Wachtwoord</p>
                    <input onChange={passwordHandler} type="password" placeholder="Schrijf hier je wachtwoord" />
                    <div className="button-container button-login">
                        <button onClick={loginHandler}>Login</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login
