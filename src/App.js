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
import NotApproved from './components/NotApproved'
import { DndProvider } from 'react-dnd'
import { HTML5Backend }  from 'react-dnd-html5-backend'
import { client } from './hooks/Client';
import MultipleAccounts from './components/MultipleAccounts';


function App() {

  const [online, setOnline] = useState(false)
  const [approved, setApproved] = useState(true)
  const [compagny, setCompagny] = useState("")

  useEffect(() => {
    auth.onAuthStateChanged(User => {
      if(User){
        setOnline(true)

        db.collection("Users")
        .where("Compagny", "==", client)
        .where("Email", "==", User.email)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const approved = doc.data().Approved
            const compagny = doc.data().Compagny

            setCompagny(compagny)

            if(approved === false && compagny === client){
              setApproved(false)
              
            } else if (approved === true && compagny === client){
              setApproved(true)
            } 
          })
        })
      } else if (User === null) {
        setOnline(false)
      }
    })
  }, [])

    const AuthRedirect = () => {
      if(online === false){
        return <LoginRegister/>
      } else if (online === true && approved === true && compagny === client) {
        
        return ( 
        <AuthProvider>
        <MenuProvider>
        <DndProvider backend={HTML5Backend}>
          <>
          <Topbar />
          <Main/>
          <BottomBar/>
          </>
        </DndProvider>
        </MenuProvider>
        </AuthProvider>
        )
      } else if (online === true && approved === false && compagny === client){
        return <NotApproved/>
      } else if (online === true && compagny != client){
        return <MultipleAccounts/>
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
    variants={variants}>
      <Router>
        <AuthRedirect />
      </Router>
    </motion.div>
  );
}

export default App;