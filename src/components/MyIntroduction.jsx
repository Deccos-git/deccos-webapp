import LeftSideBarPublicProfile from "./LeftSideBarPublicProfile";
import RightSideBar from "./rightSideBar/RightSideBar"
import Location from "../hooks/Location"
import { useFirestoreIntroductions } from "../firebase/useFirestore";

const MyIntroduction = () => {

    const route = Location()[3]

    console.log(route)

   const introductions = useFirestoreIntroductions("Introductions", route)

   console.log(introductions)
    
    return (
        <div className="main">
             <LeftSideBarPublicProfile />
            {introductions && introductions.map(introduction => (
                <div className="list introductions-list">
                    <p>{introduction.Body}</p>
                </div>
            ))}
             <RightSideBar />
        </div>
    )
}

export default MyIntroduction
