import '../CSS/middleBar.css';
import AllActivity from './AllActivity';
import Start from './Start';
import Goals from './Goals';
import AddGoal from './AddGoal';
import GoalView from './GoalView';
import { client } from '../hooks/Client';
import { Switch, Route } from "react-router-dom";
import Search from './Search';
import Login from './Login';

const MiddleBar = () => {
    return (
        <div id="main">
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
            </Switch>
        </div>
    )
}

export default MiddleBar
