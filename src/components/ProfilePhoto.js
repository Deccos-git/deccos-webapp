import photoGijs from '../images/foto-gijs350.jpg'
import { client } from '../hooks/Client';

import { Link } from "react-router-dom";

const ProfilePhoto = () => {
    return (
        <div id="profilePhoto">
            <Link to={`/${client}/Profile`}><img src={photoGijs} alt="" /></Link>
        </div>
    )
}

export default ProfilePhoto
