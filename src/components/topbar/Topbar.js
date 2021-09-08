import Iconbar from '../topbar/Iconbar';
import ProfilePhoto from '../topbar/ProfilePhoto';
import '../../CSS/topbar.css';
import {useFirestore} from "../../firebase/useFirestore"
import Auth from '../../firebase/Auth';

const Topbar = () => {
    const docs  = useFirestore("CompagnyMeta")
    const auth = Auth()


    let logo = ""
    let website = ""

    docs && docs.map(doc => {
        logo = doc.Logo
        website = doc.Website
    })

    return (
        <header className="top-bar">
            <a href={`${website}`}><img src={logo} className="top-bar-logo" alt="logo" /></a>
            <Iconbar auth={auth} />
            <ProfilePhoto />
        </header>
    )
}

export default Topbar
