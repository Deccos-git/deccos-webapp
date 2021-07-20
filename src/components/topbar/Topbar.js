import Iconbar from '../topbar/Iconbar';
import ProfilePhoto from '../topbar/ProfilePhoto';
import '../../CSS/topbar.css';
import {useFirestore} from "../../firebase/useFirestore"

const Topbar = () => {
    const docs  = useFirestore("CompagnyMeta")

    let logo = ""
    let website = ""

    docs && docs.map(doc => {
        logo = doc.Logo
        website = doc.Website
    })

    return (
        <header className="top-bar">
            <a href={`${website}`}><img src={logo} className="top-bar-logo" alt="logo" /></a>
            <Iconbar />
            <ProfilePhoto />
        </header>
    )
}

export default Topbar
