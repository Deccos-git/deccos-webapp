import Topbar from './components/topbar/Topbar';
import BottomBar from './components/BottomBar';
import Main from './components/Main';
import { motion } from "framer-motion"
import { BrowserRouter as Router } from "react-router-dom";
import LoginRegister from './components/LoginRegister';
import { auth, db } from './firebase/config';
import { useState, useEffect } from 'react';
import {AuthProvider} from './StateManagment/Auth';
import { MenuProvider } from './StateManagment/MobileMenu';
import { ColorProvider } from './StateManagment/Colors';
import NotApproved from './components/NotApproved'
import { client } from './hooks/Client';
import MultipleAccounts from './components/MultipleAccounts';
import Colors from "./hooks/Colors";
import Footer from './components/Footer';

function App() {

  const [online, setOnline] = useState(false)
  const [approved, setApproved] = useState(true)
  const [compagny, setCompagny] = useState("")
  const [authO, setAuthO] = useState('')

  const colors = Colors()

  useEffect(() => {
    auth.onAuthStateChanged(User => {
      if(User){
        setOnline(true)

        db.collection("Users")
        .where("Compagny", "array-contains", client)
        .where("Email", "==", User.email)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const approved = doc.data().Approved
            const compagny = doc.data().Compagny
            const data = doc.data()

            setAuthO(data)

            setCompagny(compagny)

            if(approved === false && compagny.includes(client)){
              setApproved(false)
              
            } else if (approved === true && compagny.includes(client)){
              setApproved(true)
            } 
          })
        })
      } else if (User === null) {
        setOnline(false)
      }
    })
  }, [])

  console.log(authO)
  console.log(compagny)

    const AuthRedirect = () => {
      if(online === false){
        return <LoginRegister/>
      } else if (online === true && approved === true && compagny.includes(client)) {
        
        return ( 
        <AuthProvider>
        <MenuProvider>
        <ColorProvider>
          <>
          <Topbar />
          <Main/>
          <BottomBar/>
          <Footer/>
          </>
        </ColorProvider>
        </MenuProvider>
        </AuthProvider>
        )
      } else if (online === true && approved === false && compagny.includes(client)){
        return <NotApproved/>
      } else if (online === true && !compagny.includes(client)){
        return (
        <AuthProvider>
          <MultipleAccounts authO={authO}/>
        </AuthProvider>
        )
      }
    }

    const updateUserOnlineInStatus = (status) => {
      auth.onAuthStateChanged(User =>{
        if(User){
          db.collection("Users")
          .doc(User.uid)
          .update({
            Online: status
          })
        }
      })
    }
  
    const checkOnlineStatus = () => {
        if(navigator.onLine){
          updateUserOnlineInStatus(true)
        } else if (!navigator.onLine) {
          updateUserOnlineInStatus(false)
        }
    }

    checkOnlineStatus()

  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  return (
    <motion.div 
    className="App"
    initial="hidden"
    animate="visible"
    variants={variants}
    style={{backgroundColor: colors.BackgroundColor}}>
      <Router>
        <AuthRedirect />
      </Router>
    </motion.div>
  );
}

export default App;