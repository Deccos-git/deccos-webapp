import '../CSS/middleBar.css';
import AllActivity from './AllActivity';
import Start from './Start';
import Goals from './Goals';
import AddGoal from './AddGoal';
import { client } from '../hooks/Client';
import { Switch, Route } from "react-router-dom";

const MiddleBar = () => {
    return (
        <div id="middle-bar">
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
            </Switch>
        </div>
    )
}

export default MiddleBar
