import Topbar from './components/topbar/Topbar';
import Main from './components/Main';
import { motion } from "framer-motion"
import { BrowserRouter as Router } from "react-router-dom";
import Login from './components/Login';
import { auth } from './firebase/config';
import { useState } from 'react';

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
      if(online === true){
        return <><Topbar/><Main/> </>
      } else {
        return <Login/>
      }
    }

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
