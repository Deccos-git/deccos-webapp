import { Link } from "react-router-dom";
import { client } from '../../hooks/Client';
import { useContext } from 'react';
import { Auth } from '../../StateManagment/Auth';


const ProfilePhoto = () => {
    const [authO] = useContext(Auth)

    return (
        <div className="profile-photo">
            <Link to={`/${client}/Profile`}><img src={authO.Photo} alt="" /></Link>
        </div>
    )
}

export default ProfilePhoto

