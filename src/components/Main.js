import { useHistory } from "react-router-dom";
import { auth } from "../firebase/config";
import { client } from '../hooks/Client';
import AllActivity from './AllActivity';
import Start from './Start';
import Goals from './Goals';
import AddGoal from './AddGoal';
import GoalView from './GoalView';
import { Switch, Route } from "react-router-dom";
import Search from './Search';
import Login from './Login';
import Register from "./Register";
import Profile from "./Profile";
import "../CSS/main.css";

const Main = () => {

    const history = useHistory();

    auth.onAuthStateChanged(User =>{
      if(!User){
        history.push(`/${client}/Login`)
      } else {
        history.push(`/${client}/Start`) 
      }
    })

    return (
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
                <Route path={`/${client}/Goal`}>
                    <GoalView/>
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
            </Switch>
        </div>
    )
}

export default Main
