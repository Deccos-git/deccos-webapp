import { useHistory } from "react-router-dom";
import { auth } from "../firebase/config";
import { client } from '../hooks/Client';
import AllActivity from './AllActivity';
import Start from './Start';
import Goals from './Goals';
import AddGoal from './AddGoal';
import { Switch, Route } from "react-router-dom";
import Search from './Search';
import Login from './Login';
import Register from "./Register";
import Profile from "./Profile";
import "../CSS/main.css";
import { AllActivityProvider } from "../context/FirestoreContext"
import { CompagnyProvider } from "../context/FirestoreContext"
import { useState } from "react";
import GoalDetail from "./GoalDetail";
import RouterContext from '../context/RouterContext'
import KnowledgeCentre from "./KnowledgeCentre";
import AddArticle from "./AddArticle";

const Main = () => {

    const [routerID, setRouterID] = useState("")
    const value = { routerID, setRouterID };

    console.log(routerID)

    const history = useHistory();

    auth.onAuthStateChanged(User =>{
      if(!User){
        history.push(`/${client}/Login`)
      } else {
        history.push(`/${client}/Start`) 
      }
    })

    return (
        <RouterContext.Provider value={value}>
        <CompagnyProvider>
        <AllActivityProvider>
        <div className="main">
            <Switch>
                <Route path={`/${client}/AllActivity`}>
                    <AllActivity/>
                </Route>
                <Route path={`/${client}/Start`}>
                    <Start/>
                </Route>
                <Route path={`/${client}/Goals`}>
                    <Goals/>
                </Route>
                <Route path={`/${client}/AddGoal`}>
                    <AddGoal/>
                </Route>
                <Route path={`/${client}/Search`}>
                    <Search/>
                </Route>
                <Route path={`/${client}/Login`}>
                    <Login/>
                </Route>
                <Route path={`/${client}/Register`}>
                    <Register/>
                </Route>
                <Route path={`/${client}/Profile`}>
                    <Profile/>
                </Route>
                <Route path={`/${client}/GoalDetail`}>
                    <GoalDetail/>
                </Route>
                <Route path={`/${client}/KnowledgeCentre`}>
                    <KnowledgeCentre/>
                </Route>
                <Route path={`/${client}/AddArticle`}>
                    <AddArticle/>
                </Route>
            </Switch>
        </div>
        </AllActivityProvider>
        </CompagnyProvider>
        </RouterContext.Provider>
    )
}

export default Main
