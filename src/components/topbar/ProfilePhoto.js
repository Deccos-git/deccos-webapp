import { Link } from "react-router-dom";
import { client } from '../../hooks/Client';
import Auth from "../../firebase/Auth"


const ProfilePhoto = () => {

    const doc = Auth()

    let photo = ""

    if(doc != undefined){
        photo = doc.Photo
    }

    return (
        <div className="profile-photo">
            <Link to={`/${client}/Profile`}><img src={photo} alt="" /></Link>
        </div>
    )
}

export default ProfilePhoto

