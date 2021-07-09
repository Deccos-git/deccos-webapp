import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./RightSideBar"
import Auth from "../firebase/Auth"

const Profile = () => {

    const doc = Auth()

    return (
        <div className="main">
            <LeftSideBar />
                <div className="profile">
                    <h2>{doc.UserName}</h2>
                </div>

            <RightSideBar />
        </div>
    )
}

export default Profile
