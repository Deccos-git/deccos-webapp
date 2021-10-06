import Topbar from './components/topbar/Topbar';
import BottomBar from './components/BottomBar';
import Main from './components/Main';
import { motion } from "framer-motion"
import { BrowserRouter as Router } from "react-router-dom";
import LoginRegister from './components/LoginRegister';
import { auth, db } from './firebase/config';
import { useState } from 'react';
import {AuthProvider} from './StateManagment/Auth';
import { MenuProvider } from './StateManagment/MobileMenu';
import NotApproved from './components/NotApproved'
import { DndProvider } from 'react-dnd'
import { HTML5Backend }  from 'react-dnd-html5-backend'

function App() {

  const [online, setOnline] = useState(false)
  const [approved, setApproved] = useState(true)

    auth.onAuthStateChanged(User =>{
      if(User != null){
        setOnline(true)
      } else if (User === null) {
        setOnline(false)
      }
    })

    auth.onAuthStateChanged(User => {
      if(User){
        db.collection("Users")
        .doc(User.uid)
        .get()
        .then(doc => {
            const approved = doc.data().Approved

            if(approved === false){
              setApproved(false)
              
            } else if (approved === true){
              setApproved(true)
            }
        })
      }
    })

    const AuthRedirect = () => {
      if(online === false){
        return <LoginRegister/>
      } else if (online === true && approved === true) {
        
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
      } else if (online === true && approved === false){
        return <NotApproved/>
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