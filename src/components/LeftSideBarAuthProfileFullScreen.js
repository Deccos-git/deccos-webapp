import '../CSS/leftSideBar.css';
import { Link } from "react-router-dom";
import { client } from '../hooks/Client';
import ArrowLeftIcon from '../images/icons/arrow-left-icon.png'
import { Auth } from '../StateManagment/Auth';
import { useState , useEffect, useContext} from 'react';
import { db } from '../firebase/config';
import { MobileMenu } from '../StateManagment/MobileMenu';
import { useFirestore, useFirestoreSubscriptionsNotApproved } from "../firebase/useFirestore"
import HomeIcon from '../images/icons/home-icon.png'
import SettingsIcon from '../images/icons/settings-icon.png'
import GroupIcon from '../images/icons/group-icon.png'
import UserIcon from '../images/icons/user-icon.png'
import RoleIcon from '../images/icons/rol-icon.png'

const LeftSideBarAuthProfile = () => {
    const [authO] = useContext(Auth)
    const [menu, setMenu] = useContext(MobileMenu)
    const [admin, setAdmin] = useState(false)

    const admins = useFirestore('Admins')

    console.log(menu)

    useEffect(() => {
        admins && admins.forEach(admin => {
            if(admin.UserID === authO.ID){
                setAdmin(true)
            }
        })
    }, [admins])

    const changeMenuStatus = () => {
        setMenu("none")
    }

    const Admin = () => {
        if(admin){
            return <div>
                        <h3>Admin</h3>
                        <div className="channel-inner-div">
                            <div className='activity-meta-title-container'>
                                <img src={SettingsIcon} alt="" />
                                <Link activeClassName='active' to={`/${client}/Settings`} onClick={changeMenuStatus}>Algemeen</Link>
                            </div>
                            <div className='activity-meta-title-container'>
                                <img src={GroupIcon} alt="" />
                                <Link activeClassName='active' to={`/${client}/Members`} onClick={changeMenuStatus}>Leden</Link>
                            </div>
                            <div className='activity-meta-title-container'>
                                <img src={RoleIcon} alt="" />
                                <Link activeClassName='active' to={`/${client}/UserRoles`} onClick={changeMenuStatus}>Gebruikersrollen</Link>
                            </div>
                        </div>
                    </div>
        } else {
            return null
        }
    }


    return (
        <div className="left-sidebar-container-mobile" style={{display: menu}}>
            <div className="left-side-bar-full-screen">
                <div className="channel-div">
                    <div className="channel-inner-div">
                        <Link to={`/${client}/ImpactProgress`} onClick={changeMenuStatus}>
                            <div className='activity-meta-title-container'>
                                <img src={HomeIcon} alt="" />
                                <p id='mobile-menu-home-link'>Home</p>
                            </div>
                        </Link>
                    </div>
                    <Admin/>
                    <h3>Mijn account</h3>
                    <div className="channel-inner-div">
                        <div className='activity-meta-title-container'>
                            <img src={UserIcon} alt="" />
                            <Link to={`/${client}/Profile`} onClick={changeMenuStatus}>Account instellingen</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LeftSideBarAuthProfile
