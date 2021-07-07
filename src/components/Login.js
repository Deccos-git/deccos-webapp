import { useState } from 'react';
import { Link } from "react-router-dom";
import { client } from '../hooks/Client';
import { auth } from '../firebase/config';

const Login = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const emailHandler = (e) => {
        const email = e.target.value
        setEmail(email)
    }

    const passwordHandler = (e) => {
        const password = e.target.value
        setPassword(password)
    }

    const loginHandler = () => {
        auth.signInWithEmailAndPassword(email, password)
    }

    return (
        <div className="main">
            <div className="login-container">
            <h2>Login</h2>
                <form>
                    <p>Email</p>
                    <input onChange={emailHandler} type="text" placeholder="Schrijf hier je emailadres" />
                    <p>Wachtwoord</p>
                    <input onChange={passwordHandler} type="text" placeholder="Schrijf hier je wachtwoord" />
                    <button onClick={loginHandler}>Login</button>
                </form>
                <div className="button-container">
                    <Link to={`/${client}/Register`}><h3>Nog geen account? Meld je <u>hier</u> aan</h3></Link>
                </div>
            </div>
        </div>
    )
}

export default Login
