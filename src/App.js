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
import { SavedProvider } from './StateManagment/SavedIcon';
import NotApproved from './components/NotApproved'
import { client } from './hooks/Client';
import MultipleAccounts from './components/MultipleAccounts';
import Colors from "./hooks/Colors";
import Footer from './components/Footer';

function App() {

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
    >
      <Router>
        <AuthProvider>
          <MenuProvider>
            <SavedProvider>
              <>
                <Topbar />
                <Main/>
                <BottomBar/>
                <Footer/>
              </>
            </SavedProvider>
          </MenuProvider>
        </AuthProvider>
      </Router>
    </motion.div>
  );
}

export default App;