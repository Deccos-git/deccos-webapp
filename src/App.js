import Topbar from './components/Topbar';
import Main from './components/Main';
import { motion } from "framer-motion"
import { BrowserRouter as Router } from "react-router-dom";

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
