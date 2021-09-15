import Iconbar from '../topbar/Iconbar';
import ProfilePhoto from '../topbar/ProfilePhoto';
import '../../CSS/topbar.css';
import {useFirestore} from "../../firebase/useFirestore"
import menuIcon from '../../images/icons/menu-icon.png'
import { useHistory } from "react-router-dom";
import { client } from '../../hooks/Client';
import { useContext } from 'react';
import { MobileMenu } from '../../StateManagment/MobileMenu';

const Topbar = () => {
    const [menu, setMenu] = useContext(MobileMenu)
    const docs  = useFirestore("CompagnyMeta")
    const history = useHistory();

    let logo = ""
    let website = ""
    let sideBar = ""

    docs && docs.map(doc => {
        logo = doc.Logo
        website = doc.Website
    })

    const showLeftSideBar = () => {
        if(menu === false){
            setMenu(true)
            history.push(`/${client}/LeftSideBarFullScreen`)    
        } else if (menu === true){
            setMenu(false)
            history.goBack()
        }
    }

    return (
        <header className="top-bar">
            <div className="left-side-bar-toggle">
                <img src={menuIcon} alt="" onClick={showLeftSideBar} />
            </div>
            <a href={`${website}`}><img src={logo} className="top-bar-logo" alt="logo" /></a>
            <div className="iconbar-external-container">
                <Iconbar/>
            </div>
            <ProfilePhoto />
        </header>
    )
}

export default Topbar
