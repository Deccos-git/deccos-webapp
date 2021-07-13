import { Link } from "react-router-dom";
import { client } from '../../hooks/Client';
import Auth from "../../firebase/Auth"


const ProfilePhoto = () => {

    const doc = Auth()
    let photo = ""

    const Photo = () => {
        if(doc){

            photo = doc.Photo

            return photo
        } else {
            photo = 'https://firebasestorage.googleapis.com/v0/b/deccos-app.appspot.com/o/dummy-profile-photo.jpeg?alt=media&token=1cdeec17-7408-4a8e-a0da-e2e131649df4'
        }   
    }

    const profilePhoto = Photo()

    return (
        <div className="profile-photo">
            <Link to={`/${client}/Profile`}><img src={profilePhoto} alt="" /></Link>
        </div>
    )
}

export default ProfilePhoto

