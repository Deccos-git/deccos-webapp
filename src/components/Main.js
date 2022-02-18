import AllActivity from './allActivity/AllActivity';
import Start from './Community/Start';
import Goals from './ProjectManagement/Goals';
import AddGoal from './ProjectManagement/AddGoal';
import { Switch, Route } from "react-router-dom";
import Search from './Search';
import Register from "./Register";
import Profile from "./Profile";
import "../CSS/main.css";
import "../CSS/matching.css";
import "../CSS/community.css";
import "../CSS/impact.css";
import "../CSS/projectManagement.css";
import GoalDetail from "./ProjectManagement/GoalDetail";
import AddArticle from "./Community/AddArticle";
import { client } from '../hooks/Client';
import NewClient from './NewClient';
import Introductions from './Community/Introductions';
import News from './Community/News';
import Events from './Community/Events';
import Group from './Community/Group';
import Notifications from './Notifications';
import ChatGroups from './Community/ChatGroups';
import PublicProfile from './PublicProfile';
import Settings from './Settings';
import Analytics from './Analytics'
import Members from './Members';
import ArticleDetail from './Community/ArticleDetail';
import MessageDetail from './Community/MessageDetail';
import ChatRoom from './Community/ChatRoom';
import Login from './Login';
import ChannelSettings from './Community/ChannelSettings';
import AddEvent from './Community/AddEvent';
import AddNews from './Community/AddNews';
import GroupSettings from './Community/GroupSettings';
import GroupLanding from './Community/GroupLanding';
import Channel from './Community/Channel';
import ChannelDetail from './Community/ChannelDetail';
import GoalSettings from './ProjectManagement/GoalSettings';
import WelcomeSettings from './Community/WelcomeSettings';
import KnowLedgeCentre from './Community/KnowledgeCentre'
import AddChannelItem from './Community/AddChannelItem'
import AddGroupChannelItem from './Community/AddGroupChannelItem'
import ChannelSettingsDetail from './Community/ChannelSettingsDetail';
import EventDetail from './Community/EventDetail';
import NewsDetail from './Community/NewsDetail';
import Measures from './Measures';
import LeftSideBarFullScreen from './LeftSideBarFullScreen'
import MyIntroduction from './MyIntroduction';
import MyMessages from './MyMessages';
import MyGroups from './MyGroups';
import MyEvents from './MyEvents';
import MyContributions from './MyContributions';
import UserRoles from './UserRoles';
import Registrations from './Registrations';
import GoalSettingsDetail from './ProjectManagement/GoalSettingsDetail';
import GroupSettingsDetail from './Community/GroupSettingsDetail';
import ProfileSettings from './ProfileSettings';
import AboutMe from './AboutMe';
import NotApproved from './NotApproved';
import MyChannels from './MyChannels'
import Subscriptions from './Subscriptions'
import ActivitySettings from './ActivitySettings'
import TaskSettings from './ProjectManagement/TaskSettings'
import Activities from './Activities'
import ActivityDetail from './ActivityDetail'
import ActivityGoal from './ActivityGoal'
import TaskDetail from './ProjectManagement/TaskDetail'
import Tasks from './ProjectManagement/Tasks'
import EventSignups from './Community/EventSignups';
import QuestionnaireSettings from './Impact/QuestionnaireSettings';
import AddQuestionnaire from './Impact/AddQuestionnaire';
import SendQuestionnaire from './Impact/SendQuestionnaire';
import Stakeholders from './Impact/Stakeholders';
import ImpactIndicators from './Impact/ImpactIndicators';
import ImpactProgress from './Impact/ImpactProgress';
import MatchCategories from './Matching/MatchCategories';
import AddMatchItem from './Matching/AddMatchItem'
import MatchItems from './Matching/MatchItems';
import MatchItemDetail from './Matching/MatchItemDetail';
import Matches from './Matching/Matches';
import MatchDetail from './Matching/MatchDetail';
import MatchProfileFields from './Matching/MatchProfileFields';
import RoadMap from './Matching/Roadmap';
import QuestionnaireAnalysis from './Impact/QuestionnaireAnalysis';
import Impacthub from './Impact/Impacthub';
import Likes from './Community/Likes';
import Output from './Impact/Output';
import AddActivity from './Impact/AddActivity';
import AddOutput from './Impact/AddOutput';

const Main = () => {

    return (
        <div className="main">
            <Switch>
                <Route path={`/${client}/Login`}>
                    <Login/>
                </Route>
                <Route path={`/${client}/Register`}>
                    <Register/>
                </Route>
                <Route path={`/${client}/ProfileSettings`}>
                    <ProfileSettings/>
                </Route>
                <Route path={`/${client}/NotApproved`}>
                    <NotApproved/>
                </Route>
                <Route exact path={`/${client}/`}>
                    <AllActivity/>
                </Route>
                <Route path={`/${client}/AllActivity`}>
                    <AllActivity/>
                </Route>
                <Route path={`/${client}/Start`}>
                    <Start/>
                </Route>
                <Route path={`/${client}/AboutMe`}>
                    <AboutMe/>
                </Route>
                <Route path={`/${client}/Subscriptions`}>
                    <Subscriptions/>
                </Route>
                <Route path={`/${client}/Goals`}>
                    <Goals/>
                </Route>
                <Route path={`/${client}/Activities`}>
                    <Activities/>
                </Route>
                <Route path={`/${client}/ActivityGoal`}>
                    <ActivityGoal/>
                </Route>
                <Route path={`/${client}/ActivityDetail`}>
                    <ActivityDetail/>
                </Route>
                <Route path={`/${client}/Tasks`}>
                    <Tasks/>
                </Route>
                <Route path={`/${client}/TaskDetail`}>
                    <TaskDetail/>
                </Route>
                <Route path={`/${client}/ActivitySettings`}>
                    <ActivitySettings/>
                </Route>
                <Route path={`/${client}/TaskSettings`}>
                    <TaskSettings/>
                </Route>
                <Route path={`/${client}/MatchCategories`}>
                    <MatchCategories/>
                </Route>
                <Route path={`/${client}/AddMatchItem`}>
                    <AddMatchItem/>
                </Route>
                <Route path={`/${client}/MatchItems`}>
                    <MatchItems/>
                </Route>
                <Route path={`/${client}/MatchItemDetail`}>
                    <MatchItemDetail/>
                </Route>
                <Route path={`/${client}/MatchProfileFields`}>
                    <MatchProfileFields/>
                </Route>
                <Route path={`/${client}/Matches`}>
                    <Matches/>
                </Route>
                <Route path={`/${client}/MatchDetail`}>
                    <MatchDetail/>
                </Route>
                <Route path={`/${client}/RoadMap`}>
                    <RoadMap/>
                </Route>
                <Route path={`/${client}/KnowledgeCentre`}>
                    <KnowLedgeCentre/>
                </Route>
                <Route path={`/${client}/LeftSideBarFullScreen`}>
                    <LeftSideBarFullScreen/>
                </Route>
                <Route path={`/${client}/AddChannelItem`}>
                    <AddChannelItem/>
                </Route>
                <Route path={`/${client}/AddGroupChannelItem`}>
                    <AddGroupChannelItem/>
                </Route>
                <Route path={`/${client}/ImpactIndicators`}>
                    <ImpactIndicators/>
                </Route>
                <Route path={`/${client}/ImpactProgress`}>
                    <ImpactProgress/>
                </Route>
                <Route path={`/${client}/Impacthub`}>
                    <Impacthub/>
                </Route>
                <Route path={`/${client}/Output`}>
                    <Output/>
                </Route>
                <Route path={`/${client}/AddOutput`}>
                    <AddOutput/>
                </Route>
                <Route path={`/${client}/AddGoal`}>
                    <AddGoal/>
                </Route>
                <Route path={`/${client}/AddActivity`}>
                    <AddActivity/>
                </Route>
                <Route path={`/${client}/Search`}>
                    <Search/>
                </Route>
                <Route path={`/${client}/Profile`}>
                    <Profile/>
                </Route>
                <Route path={`/${client}/GoalDetail`}>
                    <GoalDetail/>
                </Route>
                <Route path={`/${client}/ChannelDetail`}>
                    <ChannelDetail/>
                </Route>
                <Route path={`/${client}/QuestionnaireSettings`}>
                    <QuestionnaireSettings/>
                </Route>
                <Route path={`/${client}/AddQuestionnaire`}>
                    <AddQuestionnaire/>
                </Route>
                <Route path={`/${client}/QuestionnaireAnalysis`}>
                    <QuestionnaireAnalysis/>
                </Route>
                <Route path={`/${client}/Stakeholders`}>
                    <Stakeholders/>
                </Route>
                <Route path={`/${client}/SendQuestionnaire`}>
                    <SendQuestionnaire/>
                </Route>
                <Route path={`/${client}/AddArticle`}>
                    <AddArticle/>
                </Route>
                <Route path={`/${client}/MyIntroduction`}>
                    <MyIntroduction/>
                </Route>
                <Route path={`/${client}/MyMessages`}>
                    <MyMessages/>
                </Route>
                <Route path={`/${client}/MyGroups`}>
                    <MyGroups/>
                </Route>
                <Route path={`/${client}/MyEvents`}>
                    <MyEvents/>
                </Route>
                <Route path={`/${client}/MyChannels`}>
                    <MyChannels/>
                </Route>
                <Route path={`/${client}/NewClient`}>
                    <NewClient/>
                </Route>
                <Route path={`/${client}/UserRoles`}>
                    <UserRoles/>
                </Route>
                <Route path={`/${client}/Registrations`}>
                    <Registrations/>
                </Route>
                <Route path={`/${client}/EventSignups`}>
                    <EventSignups/>
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
                <Route path={`/${client}/Measures`}>
                    <Measures/>
                </Route>
                <Route path={`/${client}/EventDetail`}>
                    <EventDetail/>
                </Route>
                <Route path={`/${client}/NewsDetail`}>
                    <NewsDetail/>
                </Route>
                <Route path={`/${client}/Group`}>
                    <Group/>
                </Route>
                <Route path={`/${client}/Notifications`}>
                    <Notifications/>
                </Route>
                <Route path={`/${client}/ChatsGroups`}>
                    <ChatGroups/>
                </Route>
                <Route path={`/${client}/PublicProfile`}>
                    <PublicProfile/>
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
                <Route path={`/${client}/Likes`}>
                    <Likes/>
                </Route>
                <Route path={`/${client}/ArticleDetail`}>
                    <ArticleDetail/>
                </Route>
                <Route path={`/${client}/MessageDetail`}>
                    <MessageDetail/>
                </Route>
                <Route path={`/${client}/ChatRoom`}>
                    <ChatRoom/>
                </Route>
                <Route path={`/${client}/ChannelSettings`}>
                    <ChannelSettings/>
                </Route>
                <Route path={`/${client}/ChannelSettingsDetail`}>
                    <ChannelSettingsDetail/>
                </Route>
                <Route path={`/${client}/AddEvent`}>
                    <AddEvent/>
                </Route>
                <Route path={`/${client}/AddNews`}>
                    <AddNews/>
                </Route>
                <Route path={`/${client}/GroupSettings`}>
                    <GroupSettings/>
                </Route>
                <Route path={`/${client}/GroupSettingsDetail`}>
                    <GroupSettingsDetail/>
                </Route>
                <Route path={`/${client}/WelcomeSettings`}>
                    <WelcomeSettings/>
                </Route>
                <Route path={`/${client}/GroupLanding`}>
                    <GroupLanding/>
                </Route>
                <Route path={`/${client}/Channel`}>
                    <Channel/>
                </Route>
                <Route path={`/${client}/GoalSettings`}>
                    <GoalSettings />
                </Route>
                <Route path={`/${client}/GoalSettingsDetail`}>
                    <GoalSettingsDetail />
                </Route>
            </Switch>
        </div>
    )
}

export default Main
