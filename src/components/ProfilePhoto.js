import { client } from '../hooks/Client';
import Auth from '../firebase/Auth';
import { Link } from "react-router-dom";

const ProfilePhoto = () => {

   const docs = Auth()

    return (
        <div id="profilePhoto">
            {docs && docs.map(doc => (
                <Link to={`/${client}/Profile`}><img src={doc.Photo} alt="" key={doc.ID} /></Link>
            ))}
        </div>
    )
}

export default ProfilePhoto
