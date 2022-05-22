import { useState } from 'react';
import { client } from '../hooks/Client';
import { auth, db } from '../firebase/config';
import { useHistory } from "react-router-dom";
import Modal from 'react-modal';
import ButtonClicked from '../hooks/ButtonClicked'

const Login = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [modalOpen, setModalOpen] = useState(false)
    const [emailReset, setEmailReset] = useState('')
    const [errorReset, setErrorReset] = useState('')
    const [succesReset, setSuccesReset] = useState('')

    const history = useHistory();
    Modal.setAppElement('#root');

    const modalStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-10%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          height: 'auto'
        },
      };

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
            if(client != ''){
                history.push(`/${client}/ImpactProgress`)
            } else {
                history.push(`/MultipleAccounts`)
            }
           
        })
    }

    const resetPasswordModal = () => {

        setModalOpen(true)

    }

    const closeModal = () => {
        setModalOpen(false);
    }

    const emailResetHandler = (e) => {
        const email = e.target.value 

        setEmailReset(email)
    }

    const resetPassword = (e) => {

        ButtonClicked(e, 'Verzonden')

        auth.sendPasswordResetEmail(emailReset)
        .then(() => {
            setSuccesReset(`Er is een email verstuurd naar ${emailReset} waarmee je je wachtwoord kunt resetten.`)
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            if(errorCode === 'auth/user-not-found'){
                setErrorReset('Dit emailaders is niet bekend. Probeer een ander emailadres of stuur een mailtje naar info@deccos.nl')
                resetResetButton(e)
            } else if (errorCode === ''){

            }
        });
    }

    const resetResetButton = (e) => {
        setTimeout(() => {
            e.target.innerText = 'Verzenden' 
            e.target.style.borderColor = 'green'
            e.target.style.color = 'green'
        }, 3000)
    }

    return (
        <div>
            <div className="login-container">
                <h1>Login</h1>
                <form id="login-form">
                    <p>Email</p>
                    <input onChange={emailHandler} type="email" placeholder="Schrijf hier je emailadres" />
                    <p>Wachtwoord</p>
                    <input onChange={passwordHandler} type="password" placeholder="Schrijf hier je wachtwoord" />
                    <p id='password-reset-button-modal' onClick={resetPasswordModal}>Wachtwoord vergeten?</p>
                    <Modal
                        isOpen={modalOpen}
                        onRequestClose={closeModal}
                        style={modalStyles}
                        contentLabel="Upload file"
                    >
                        <h2>Reset wachtwoord</h2>
                        <p>Jouw emailadres</p>
                        <input type="text" placeholder='Schrijf hier je emailadres' onChange={emailResetHandler}/>
                        <p id='error-message-reset-password'>{errorReset}</p>
                        <p id='succes-message-password-reset'>{succesReset}</p>
                        <button id='button-reset-password' onClick={resetPassword}>Versturen</button>
                    </Modal>
                    <div className="button-container button-login">
                        <button onClick={loginHandler}>Login</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login
