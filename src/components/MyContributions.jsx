import LeftSideBarPublicProfile from "./LeftSideBarPublicProfile";
import LeftSideBarPublicProfileFullScreen from "./LeftSideBarPublicProfileFullScreen";
import RightSideBar from "./rightSideBar/RightSideBar"
import Location from "../hooks/Location"
import { useFirestoreContributions } from "../firebase/useFirestore";
import MenuStatus from "../hooks/MenuStatus";

const MyContributions = () => {

    const route = Location()[3]
    const menuState = MenuStatus()

    const contributions = useFirestoreContributions("Contributions", "RecieverID", route)
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };


    return (
        <div className="main">
        <LeftSideBarPublicProfile />
        <LeftSideBarPublicProfileFullScreen/>
        <div className="card-overview" style={{display: menuState}}>
            <div className="page-header">
                <h1>Mijn likes</h1>
            </div>
           {contributions && contributions.map(contribution => (
               <div className="list introductions-list my-message" key={contribution.ID}>
                   <div className="introduction-list-inner-container">
                    <p>Bijdrage geleverd aan doel:</p>
                    <h3>{contribution.GoalName}</h3>
                    <p>{contribution.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                   </div>
               </div>
           ))}
       </div>
        <RightSideBar />
   </div>
    )
}

export default MyContributions
