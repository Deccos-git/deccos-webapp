import Iconbar from './Iconbar';
import ProfilePhoto from './ProfilePhoto';
import '../CSS/topbar.css';
import { Link } from "react-router-dom";
import {useFirestore} from "../firebase/useFirestore"
import { client } from '../hooks/Client';

const Topbar = () => {
    const docs  = useFirestore("CompagnyMeta")

    let logo = ""

    docs && docs.map(doc => {
        logo = doc.Logo
    })

    return (
        <header className="top-bar">
            <Link to={`/${client}/AllActivity`}><img src={logo} className="top-bar-logo" alt="logo" /></Link>
            <Iconbar />
            <ProfilePhoto />
        </header>
    )
}

export default Topbar
