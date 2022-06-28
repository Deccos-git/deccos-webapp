import { Link } from "react-router-dom";
import { client } from '../../hooks/Client';
import { useContext } from 'react';
import { Auth } from '../../StateManagment/Auth';
import { MobileMenu } from '../../StateManagment/MobileMenu';

const ProfilePhoto = () => {
    const [authO] = useContext(Auth)
    const [menu, setMenu] = useContext(MobileMenu)

    const changeMenuStatus = () => {
        setMenu("none")
    }

    return (
        <div className="profile-photo">
            <Link onClick={changeMenuStatus} to={`/${client}/Profile`}>
                <div id='photo-container-topbar'>
                    <img src={authO.Photo} alt="" />
                    <p>{authO.ForName}</p>
                </div>
                
                </Link>
        </div>
    )
}

export default ProfilePhoto

