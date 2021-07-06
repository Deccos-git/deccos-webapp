import analyticsIcon from '../images/icons/analytics-icon.png'
import groupIcon from '../images/icons/group-icon.png'
import settingsIcon from '../images/icons/settings-icon.png'
import notificationsIcon from '../images/icons/notifications-icon.png'
import chatIcon from '../images/icons/chat-icon.png'
import searchIcon from '../images/icons/Search-icon.png'
import { client } from '../hooks/Client';

import { Link } from "react-router-dom";

const Iconbar = () => {
    return (
        <div className="icon-bar">
            <Link to={`/${client}/Analytics`}><img src={analyticsIcon} alt="" /></Link>
            <Link to={`/${client}/Members`}><img src={groupIcon} alt="" /></Link>
            <Link to={`/${client}/Settings`}><img src={settingsIcon} alt="" /></Link>
            <Link to={`/${client}/Notifications`}><img src={notificationsIcon} alt="" /></Link>
            <Link to={`/${client}/Chats`}><img src={chatIcon} alt="" /></Link>
            <Link to={`/${client}/Search`}><img src={searchIcon} alt="" /></Link>
        </div>
    )
}

export default Iconbar
