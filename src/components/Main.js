import AllActivity from './allActivity/AllActivity';
import Start from './Start';
import Goals from './goals/Goals';
import AddGoal from './goals/AddGoal';
import { Switch, Route } from "react-router-dom";
import Search from './topbar/Search';
import Login from './Login';
import Register from "./Register";
import Profile from "./Profile";
import "../CSS/main.css";
import GoalDetail from "./goals/GoalDetail";
import KnowledgeCentre from "./KnowledgeCentre";
import AddArticle from "./AddArticle";
import AuthRedirect from '../hooks/AuthRedirect';
import { client } from '../hooks/Client';
import NewClient from './NewClient';
import Introductions from './Introductions';
import News from './News';
import Events from './Events';
import Group from './Group';
import Notifications from './Notifications';
import Chat from './Chat';
import ChatGroups from './ChatGroups';
import PublicProfile from './PublicProfile';
import Settings from './Settings';
import Analytics from './Analytics'
import Members from './Members';
import ArticleDetail from './ArticleDetail';
import MessageDetail from './MessageDetail';
import ChatRoom from './ChatRoom';
import { useFirestoreID } from '../firebase/useFirestore';
import Auth from '../firebase/Auth';

const Main = () => {

    const auth = Auth()

    console.log(auth)

    // AuthRedirect()
    let id = ""

    if(auth.ID != undefined){
        id = auth.ID
    }

    console.log(id)

    const routes = useFirestoreID("Route", id)

    console.log(routes)

    return (
        <div className="main">
            {routes && routes.map(route => (
            <Switch>
                <Route exact path={`/${client}/`}>
                    <AllActivity/>
                </Route>
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
                    <GoalDetail route={route}/>
                </Route>
                <Route path={`/${client}/KnowledgeCentre`}>
                    <KnowledgeCentre/>
                </Route>
                <Route path={`/${client}/AddArticle`}>
                    <AddArticle/>
                </Route>
                <Route path={`/${client}/NewClient`}>
                    <NewClient/>
                </Route>
                <Route path={`/${client}/Introductions`}>
                    <Introductions/>
                </Route>
                <Route path={`/${client}/News`}>
                    <News/>
                </Route>
                <Route path={`/${client}/Events`}>
                    <Events/>
                </Route>
                <Route path={`/${client}/Group`}>
                    <Group/>
                </Route>
                <Route path={`/${client}/Notifications`}>
                    <Notifications/>
                </Route>
                <Route path={`/${client}/Chats`}>
                    <Chat/>
                </Route>
                <Route path={`/${client}/ChatsGroups`}>
                    <ChatGroups/>
                </Route>
                <Route path={`/${client}/PublicProfile`}>
                    <PublicProfile route={route}/>
                </Route>
                <Route path={`/${client}/Settings`}>
                    <Settings/>
                </Route>
                <Route path={`/${client}/Analytics`}>
                    <Analytics/>
                </Route>
                <Route path={`/${client}/Members`}>
                    <Members/>
                </Route>
                <Route path={`/${client}/ArticleDetail`}>
                    <ArticleDetail/>
                </Route>
                <Route path={`/${client}/MessageDetail`}>
                    <MessageDetail/>
                </Route>
                <Route path={`/${client}/ChatRoom`}>
                    <ChatRoom route={route}/>
                </Route>
            </Switch>
             ))}
        </div>
    )
}

export default Main
