import Topbar from './components/Topbar';
import Main from './components/Main';
import { BrowserRouter as Router } from "react-router-dom";
import { motion } from "framer-motion"

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
    variants={variants}>
      <Router>
        <Topbar />
        <Main />
      </Router>
    </motion.div>
  );
}

export default App;
