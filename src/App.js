import Topbar from './components/topbar/Topbar';
import BottomBar from './components/BottomBar';
import Main from './components/Main';
import { motion } from "framer-motion"
import { BrowserRouter as Router } from "react-router-dom";
import LoginRegister from './components/LoginRegister';
import { auth, db } from './firebase/config';
import { useState } from 'react';
import { RouteProvider } from './StateManagment/Route';
import {AuthProvider} from './StateManagment/Auth';

function App() {

  const [online, setOnline] = useState(false)

    auth.onAuthStateChanged(User =>{
      if(User != null){
        setOnline(true)
      } else if (User === null) {
        setOnline(false)
      }
    })

    const AuthRedirect = () => {
      if(online === false){
        return <LoginRegister/>
      } else if (online === true) {
        
        return ( 
        <AuthProvider>
        <RouteProvider>
          <>
          <Topbar />
          <Main/>
          <BottomBar/>
          </>
        </RouteProvider>
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
    variants={variants}>
      <Router>
        <AuthRedirect />
      </Router>
    </motion.div>
  );
}

export default App;