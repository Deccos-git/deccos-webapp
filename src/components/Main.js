import AllActivity from './allActivity/AllActivity';
import Start from './Start';
import Goals from './goals/Goals';
import AddGoal from './goals/AddGoal';
import { Switch, Route } from "react-router-dom";
import Search from './topbar/Search';
import Register from "./Register";
import Profile from "./Profile";
import "../CSS/main.css";
import GoalDetail from "./goals/GoalDetail";
import AddArticle from "./AddArticle";
import { client } from '../hooks/Client';
import NewClient from './NewClient';
import Introductions from './Introductions';
import News from './News';
import Events from './Events';
import Group from './Group';
import Notifications from './Notifications';
import ChatGroups from './ChatGroups';
import PublicProfile from './PublicProfile';
import Settings from './Settings';
import Analytics from './Analytics'
import Members from './Members';
import ArticleDetail from './ArticleDetail';
import MessageDetail from './MessageDetail';
import ChatRoom from './ChatRoom';
import { useFirestoreID, useFirestore } from '../firebase/useFirestore';
import Auth from '../firebase/Auth';
import Login from './Login';
import ChannelSettings from './ChannelSettings';
import AddEvent from './AddEvent';
import AddNews from './AddNews';
import GroupSettings from './GroupSettings';
import GroupLanding from './GroupLanding';
import Channel from './Channel';
import ChannelDetail from './ChannelDetail';
import GoalSettings from './goals/GoalSettings';
import WelcomeSettings from './WelcomeSettings';
import KnowLedgeCentre from './KnowledgeCentre'
import AddChannelItem from './AddChannelItem'
import ChannelSettingsDetail from './ChannelSettingsDetail';
import EventDetail from './EventDetail';
import NewsDetail from './NewsDetail';

const Main = () => {

    const auth = Auth()

    let id = ""

    if(auth.ID != undefined){
        id = auth.ID
    }

    const compagnies = useFirestore("CompagnyMeta")
    const routes = useFirestoreID("Route", id)
    const groups = useFirestore("Groups")

    return (
        <div className="main">
            <Switch>
                <Route path={`/${client}/Login`}>
                    <Login/>
                </Route>
                <Route path={`/${client}/Register`}>
                    <Register/>
                </Route>
                {routes && routes.map(route => (
                <>
                {compagnies && compagnies.map(compagny => (
                <>
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
                <Route path={`/${client}/KnowledgeCentre`}>
                    <KnowLedgeCentre/>
                </Route>
                <Route path={`/${client}/AddChannelItem`}>
                    <AddChannelItem route={route}/>
                </Route>
                <Route path={`/${client}/AddGoal`}>
                    <AddGoal/>
                </Route>
                <Route path={`/${client}/Search`}>
                    <Search/>
                </Route>
                <Route path={`/${client}/Profile`}>
                    <Profile authO={auth}/>
                </Route>
                <Route path={`/${client}/GoalDetail`}>
                    <GoalDetail route={route} auth={auth}/>
                </Route>
                <Route path={`/${client}/ChannelDetail`}>
                    <ChannelDetail route={route} auth={auth}/>
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
                    <News route={route}/>
                </Route>
                <Route path={`/${client}/Events`}>
                    <Events route={route}/>
                </Route>
                <Route path={`/${client}/EventDetail`}>
                    <EventDetail route={route} auth={auth}/>
                </Route>
                <Route path={`/${client}/NewsDetail`}>
                    <NewsDetail route={route} auth={auth}/>
                </Route>
                {groups && groups.map(group => (
                <>
                <Route path={`/${client}/Group`}>
                    <Group group={group} route={route} auth={auth}/>
                </Route>
                </>
                ))}
                <Route path={`/${client}/Notifications`}>
                    <Notifications auth={auth}/>
                </Route>
                <Route path={`/${client}/ChatsGroups`}>
                    <ChatGroups auth={auth} route={route} />
                </Route>
                <Route path={`/${client}/PublicProfile`}>
                    <PublicProfile route={route} auth={auth}/>
                </Route>
                <Route path={`/${client}/Settings`}>
                    <Settings compagny={compagny}/>
                </Route>
                <Route path={`/${client}/Analytics`}>
                    <Analytics/>
                </Route>
                <Route path={`/${client}/Members`}>
                    <Members/>
                </Route>
                <Route path={`/${client}/ArticleDetail`}>
                    <ArticleDetail route={route} auth={auth}/>
                </Route>
                <Route path={`/${client}/MessageDetail`}>
                    <MessageDetail route={route} auth={auth}/>
                </Route>
                <Route path={`/${client}/ChatRoom`}>
                    <ChatRoom route={route} auth={auth}/>
                </Route>
                <Route path={`/${client}/ChannelSettings`}>
                    <ChannelSettings route={route}/>
                </Route>
                <Route path={`/${client}/ChannelSettingsDetail`}>
                    <ChannelSettingsDetail route={route}/>
                </Route>
                <Route path={`/${client}/AddEvent`}>
                    <AddEvent/>
                </Route>
                <Route path={`/${client}/AddNews`}>
                    <AddNews/>
                </Route>
                <Route path={`/${client}/GroupSettings`}>
                    <GroupSettings compagny={compagny} auth={auth}/>
                </Route>
                <Route path={`/${client}/WelcomeSettings`}>
                    <WelcomeSettings compagny={compagny} auth={auth}/>
                </Route>
                <Route path={`/${client}/GroupLanding`}>
                    <GroupLanding route={route} auth={auth}/>
                </Route>
                <Route path={`/${client}/Channel`}>
                    <Channel route={route} auth={auth}/>
                </Route>
                <Route path={`/${client}/GoalSettings`}>
                    <GoalSettings />
                </Route>
                </>
                ))}
                </>
                ))}
            </Switch>
             
        </div>
    )
}

export default Main
