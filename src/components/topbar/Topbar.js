import Iconbar from '../topbar/Iconbar';
import ProfilePhoto from '../topbar/ProfilePhoto';
import '../../CSS/topbar.css';
import {useFirestore} from "../../firebase/useFirestore"
import menuIcon from '../../images/icons/menu-icon.png'
import menuOpenIcon from '../../images/icons/menu-open-icon.png'
import { useContext, useEffect, useState } from 'react';
import { MobileMenu } from '../../StateManagment/MobileMenu';
import { Colors } from "../../StateManagment/Colors";
import { client } from '../../hooks/Client';
import { useHistory } from "react-router"
import penIcon from '../../images/icons/pen-icon.png'
import dummyPhoto from '../../images/Design/dummy-photo.jpeg'
import dummyLogo from '../../images/dummy-logo.png'
import deccosLogo from '../../images/deccos-logo.png'

const Topbar = () => {
    const [colors] = useContext(Colors)
    const [menu, setMenu] = useContext(MobileMenu)
    const [icon, setIcon] = useState(menuIcon)
    const [settingsIcon, setSettingsIcon] = useState('none')
    const [logo, setLogo] = useState('')
    const [display, setDisplay] = useState('block')
    const [displayDeccosLogo, setDisplayDeccosLogo] = useState('none')

    const docs  = useFirestore("CompagnyMeta")

    const history = useHistory()

    const displayLogo = () => {

        if(client === '' || client === 'NewClient' || client === 'NotApproved'){
            setLogo(deccosLogo)
            setDisplay('none')
            setDisplayDeccosLogo('block')
        } else{
            return
        }

    }

    useEffect(() => {
        displayLogo()
    },[])

    useEffect(() => {
        docs && docs.map(doc => {
            setLogo(doc.Logo)
        })
    },[docs])

    const showLeftSideBar = () => {
        if(menu === "none"){
            setMenu("flex")
            setIcon(menuOpenIcon)
        } else if (menu === "flex"){
            setMenu("none")
            setIcon(menuIcon)
        }
    }

    const settingsLink = () => {

        history.push(`/${client}/Settings`)

    }

    const homeLink = () => {

        history.push(`/${client}/ImpactProgress`)

    }

    return (
        <header className="top-bar" style={{backgroundColor: colors.Topbar}}>
            <div className="left-side-bar-toggle">
                <img src={icon} alt="" onClick={showLeftSideBar} />
            </div>
            <div id='logo-subscription-container' style={{display: display}}>
                <div id='edit-logo-container' onMouseEnter={() => { setSettingsIcon('block')}} onMouseLeave={() => { setSettingsIcon('none')}}>
                    <img src={logo} className="top-bar-logo" alt="logo" onClick={homeLink}/>
                    <img id='edit-logo-button' src={penIcon} style={{display: settingsIcon}} onClick={settingsLink}/>
                </div>
            </div>
            <div id='logo-subscription-container' style={{display: displayDeccosLogo}}>
                <a href="https://deccos.nl/"><img src={logo} className="top-bar-logo" alt="logo"/></a>
            </div>
            <div style={{display: display}}>
                <Iconbar/>
            </div>
            <div style={{display: display}}>
                <ProfilePhoto />
            </div>
        </header>
    )
}

export default Topbar
