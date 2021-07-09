import React from "react";

const RouterContext = React.createContext({
    route: "",
    setRoute: () => {}
  });
  
  export default RouterContext;