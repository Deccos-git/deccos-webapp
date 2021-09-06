import { useState } from 'react';
import { Link } from "react-router-dom";
import { client } from '../hooks/Client';
import { auth, db } from '../firebase/config';
import { useHistory } from "react-router-dom";
import { useFirestore } from '../firebase/useFirestore';

const Login = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const history = useHistory();
    const routes = useFirestore("Route")

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
            console.log(err)
            if(err){
                alert(err)
            } else {
                return
            }
        })
        .then(() => {
            auth.onAuthStateChanged(User =>{
                if(User){
                    db.collection("Users")
                    .doc(User.uid)
                    .get()
                    .then(doc => {
                        const id = doc.data().ID

                        updateRoute(id)

                    })
                    .then(() => {
                        history.push(`/${client}/AllActivity`)
                    })
                }
            })
        })
    }

    let routeid = ""

    routes && routes.forEach(route => {
        routeid = route.docid
    })

    const updateRoute = (id) => {
        db.collection("Route")
        .doc(routeid)
        .update({
            ID: id
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
