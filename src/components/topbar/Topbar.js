import Iconbar from '../topbar/Iconbar';
import ProfilePhoto from '../topbar/ProfilePhoto';
import '../../CSS/topbar.css';
import {useFirestore, useFirestoreID} from "../../firebase/useFirestore"
import Auth from '../../firebase/Auth';
import menuIcon from '../../images/icons/menu-icon.png'
import { useHistory } from "react-router-dom";
import { client } from '../../hooks/Client';
import { useContext } from 'react';

const Topbar = () => {

    const docs  = useFirestore("CompagnyMeta")
    const auth = Auth()
    const history = useHistory();

    let logo = ""
    let website = ""
    let sideBar = ""

    docs && docs.map(doc => {
        logo = doc.Logo
        website = doc.Website
    })

    const showLeftSideBar = () => {

        history.push(`/${client}/LeftSideBarFullScreen`)

    }

    return (
        <header className="top-bar">
            <div className="left-side-bar-toggle">
                <img src={menuIcon} alt="" onClick={showLeftSideBar} />
            </div>
            <a href={`${website}`}><img src={logo} className="top-bar-logo" alt="logo" /></a>
            <div className="iconbar-external-container">
                <Iconbar auth={auth} />
            </div>
            <ProfilePhoto />
        </header>
    )
}

export default Topbar
