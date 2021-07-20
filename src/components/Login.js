import { useState } from 'react';
import { Link } from "react-router-dom";
import { client } from '../hooks/Client';
import { auth } from '../firebase/config';
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

        auth.signInWithEmailAndPassword(email, password)
        .catch(err => {
            if(err){
                alert(err)
            } else {
                window.location.reload()
            }  
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
                    <div className="button-container">
                        <button onClick={loginHandler}>Login</button>
                    </div>
                </form>
                <Link to={`/${client}/Register`}><h3>Nog geen account? Meld je <u>hier</u> aan</h3></Link>
            </div>
        </div>
    )
}

export default Login
