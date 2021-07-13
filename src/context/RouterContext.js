import { createContext } from "react";

const RouterContext = createContext({
    route: "",
    setRoute: () => {}
  });
  
  export default RouterContext;