import Iconbar from '../topbar/Iconbar';
import ProfilePhoto from '../topbar/ProfilePhoto';
import '../../CSS/topbar.css';
import {useFirestore} from "../../firebase/useFirestore"
import menuIcon from '../../images/icons/menu-icon.png'
import menuOpenIcon from '../../images/icons/menu-open-icon.png'
import { useContext, useState } from 'react';
import { MobileMenu } from '../../StateManagment/MobileMenu';
import { Colors } from "../../StateManagment/Colors";
import { client } from '../../hooks/Client';
import { useHistory } from "react-router"

const Topbar = () => {
    const [colors] = useContext(Colors)
    const [menu, setMenu] = useContext(MobileMenu)
    const [icon, setIcon] = useState(menuIcon)

    const docs  = useFirestore("CompagnyMeta")

    const history = useHistory()

    let logo = ""
    let website = ""

    docs && docs.map(doc => {
        logo = doc.Logo
        website = doc.Website
    })

    const showLeftSideBar = () => {
        if(menu === "none"){
            setMenu("flex")
            setIcon(menuOpenIcon)
        } else if (menu === "flex"){
            setMenu("none")
            setIcon(menuIcon)
        }
    }

    const homeLink = () => {

        history.push(`/${client}/AllActivity`)

    }

    return (
        <header className="top-bar" style={{backgroundColor: colors.Topbar}}>
            <div className="left-side-bar-toggle">
                <img src={icon} alt="" onClick={showLeftSideBar} />
            </div>
            <a onClick={homeLink} target="_blank" ><img src={logo} className="top-bar-logo" alt="logo" /></a>
            <div className="iconbar-external-container">
                <Iconbar/>
            </div>
            <ProfilePhoto />
        </header>
    )
}

export default Topbar
