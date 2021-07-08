import { Link } from "react-router-dom";
import { client } from '../hooks/Client';

const ProfilePhoto = () => {
    return (
        <div className="profile-photo">
            <Link to={`/${client}/Profile`}>Photo</Link>
        </div>
    )
}

export default ProfilePhoto

