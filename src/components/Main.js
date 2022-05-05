import AllActivity from './allActivity/AllActivity';
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
import { client } from '../hooks/Client';
import Notifications from './Notifications';
import ChatGroups from './Community/ChatGroups';
import Settings from './Settings';
import Members from './Members';
import MessageDetail from './Community/MessageDetail';
import ChatRoom from './Community/ChatRoom';
import Login from './Login';
import GoalSettings from './ProjectManagement/GoalSettings';
import LeftSideBarFullScreen from './LeftSideBarFullScreen'
import UserRoles from './UserRoles';
import Registrations from './Registrations';
import GoalSettingsDetail from './ProjectManagement/GoalSettingsDetail';
import ProfileSettings from './ProfileSettings';
import NotApproved from './NotApproved';
import ActivitySettings from './ActivitySettings'
import TaskSettings from './ProjectManagement/TaskSettings'
import Activities from './Activities'
import ActivityDetail from './ActivityDetail'
import ActivityGoal from './ActivityGoal'
import TaskDetail from './ProjectManagement/TaskDetail'
import Tasks from './ProjectManagement/Tasks'
import QuestionnaireSettings from './Impact/QuestionnaireSettings';
import AddQuestionnaire from './Impact/AddQuestionnaire';
import SendQuestionnaire from './Impact/SendQuestionnaire';
import Stakeholders from './Impact/Stakeholders';
import ImpactIndicators from './Impact/ImpactIndicators';
import ImpactProgress from './Impact/ImpactProgress';
import QuestionnaireAnalysis from './Impact/QuestionnaireAnalysis';
import Impacthub from './Impact/Impacthub';
import Likes from './Community/Likes';
import Instruments from './Impact/Instruments';
import AddInstrument from './Impact/AddInstrument';
import InstrumentDetail from './Impact/InstrumentDetail';
import CreateQuestionnaire from './Impact/CreateQuestionnaire';
import QuestionnaireSettingsDetail from './Impact/QuestionnaireSettingsDetail';
import Milestones from './ProjectManagement/Milestones';
import AddMilestone from './ProjectManagement/AddMilestone';
import MilestoneSettingsDetail from './ProjectManagement/MilestoneSettingsDetail';
import MilestoneSettings from './ProjectManagement/MilestoneSettings';
import MilestoneDetail from './ProjectManagement/MilestoneDetail';
import OutputSettings from './Impact/OutputSettings';
import OutputSettingsDetail from './Impact/OutputSettingsDetail';
import AddOutput from './Impact/AddOutput';
import SROI from './Impact/SROI';
import AddSROI from './Impact/AddSROI';
import Project from './ProjectManagement/Project';
import Introduction from './Wizard/Introduction'
import GoalTitle from './Wizard/GoalTitle';
import ProblemAnalysis from './Impact/ProblemAnalysis';
import ProblemAnalysisDetail from './Impact/ProblemAnalyseDetail';
import Explainer from './Wizard/Explainer';
import PublicProfile from './PublicProfile'

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
                    <ImpactProgress/>
                </Route>
                <Route path={`/${client}/AllActivity`}>
                    <AllActivity/>
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
                <Route path={`/${client}/OutputSettings`}>
                    <OutputSettings/>
                </Route>
                <Route path={`/${client}/OutputSettingsDetail`}>
                    <OutputSettingsDetail/>
                </Route>
                <Route path={`/${client}/AddOutput`}>
                    <AddOutput/>
                </Route>
                <Route path={`/${client}/MilestoneSettings`}>
                    <MilestoneSettings/>
                </Route>
                <Route path={`/${client}/MilestoneDetail`}>
                    <MilestoneDetail/>
                </Route>
                <Route path={`/${client}/AddMilestone`}>
                    <AddMilestone/>
                </Route>
                <Route path={`/${client}/MilstoneSettingsDetail`}>
                    <MilestoneSettingsDetail/>
                </Route>
                <Route path={`/${client}/Milestones`}>
                    <Milestones/>
                </Route>
                <Route path={`/${client}/Project`}>
                    <Project/>
                </Route>
                <Route path={`/${client}/LeftSideBarFullScreen`}>
                    <LeftSideBarFullScreen/>
                </Route>
                <Route path={`/${client}/ImpactIndicators`}>
                    <ImpactIndicators/>
                </Route>
                <Route path={`/${client}/Instruments`}>
                    <Instruments/>
                </Route>
                <Route path={`/${client}/AddInstrument`}>
                    <AddInstrument/>
                </Route>
                <Route path={`/${client}/InstrumentDetail`}>
                    <InstrumentDetail/>
                </Route>
                <Route path={`/${client}/ImpactProgress`}>
                    <ImpactProgress/>
                </Route>
                <Route path={`/${client}/SROI`}>
                    <SROI/>
                </Route>
                <Route path={`/${client}/AddSROI`}>
                    <AddSROI/>
                </Route>
                <Route path={`/${client}/Impacthub`}>
                    <Impacthub/>
                </Route>
                <Route path={`/${client}/AddGoal`}>
                    <AddGoal/>
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
                <Route path={`/${client}/QuestionnaireSettings`}>
                    <QuestionnaireSettings/>
                </Route>
                <Route path={`/${client}/QuestionnaireSettingsDetail`}>
                    <QuestionnaireSettingsDetail/>
                </Route>
                <Route path={`/${client}/AddQuestionnaire`}>
                    <AddQuestionnaire/>
                </Route>
                <Route path={`/${client}/CreateQuestionnaire`}>
                    <CreateQuestionnaire/>
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
                <Route path={`/${client}/UserRoles`}>
                    <UserRoles/>
                </Route>
                <Route path={`/${client}/Registrations`}>
                    <Registrations/>
                </Route>
                <Route path={`/${client}/Notifications`}>
                    <Notifications/>
                </Route>
                <Route path={`/${client}/ChatsGroups`}>
                    <ChatGroups/>
                </Route>
                <Route path={`/${client}/Settings`}>
                    <Settings/>
                </Route>
                <Route path={`/${client}/Members`}>
                    <Members/>
                </Route>
                <Route path={`/${client}/Likes`}>
                    <Likes/>
                </Route>
                <Route path={`/${client}/MessageDetail`}>
                    <MessageDetail/>
                </Route>
                <Route path={`/${client}/ChatRoom`}>
                    <ChatRoom/>
                </Route> 
                <Route path={`/${client}/GoalSettings`}>
                    <GoalSettings />
                </Route>
                <Route path={`/${client}/GoalSettingsDetail`}>
                    <GoalSettingsDetail />
                </Route>
                <Route path={`/${client}/Introduction`}>
                    <Introduction />
                </Route>
                <Route path={`/${client}/GoalTitle`}>
                    <GoalTitle />
                </Route>
                <Route path={`/${client}/ProblemAnalysis`}>
                    <ProblemAnalysis />
                </Route>
                <Route path={`/${client}/ProblemAnalysisDetail`}>
                    <ProblemAnalysisDetail />
                </Route>
                <Route path={`/${client}/Explainer`}>
                    <Explainer />
                </Route>
                <Route path={`/${client}/PublicProfile`}>
                    <PublicProfile />
                </Route>
            </Switch>
        </div>
    )
}

export default Main
