import LeftSideBarPublicProfile from "./LeftSideBarPublicProfile";
import RightSideBar from "./rightSideBar/RightSideBar"
import Location from "../hooks/Location"
import { useFirestoreContributions } from "../firebase/useFirestore";

const MyContributions = () => {

    const route = Location()[3]

    const contributions = useFirestoreContributions("Contributions", "RecieverID", route)
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };


    return (
        <div className="main">
        <LeftSideBarPublicProfile />
        <div className="card-overview">
           {contributions && contributions.map(contribution => (
               <div className="list introductions-list my-message" key={contribution.ID}>
                   <p>Bijdrage geleverd aan doel:</p>
                   <h3>{contribution.GoalName}</h3>
                   <p>{contribution.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
               </div>
           ))}
       </div>
        <RightSideBar />
   </div>
    )
}

export default MyContributions
