import notificationsIcon from '../../images/icons/notifications-icon.png'
import chatIcon from '../../images/icons/chat-icon.png'
import searchIcon from '../../images/icons/Search-icon.png'
import { client } from '../../hooks/Client';

import { Link } from "react-router-dom";

const Iconbar = () => {
    return (
        <div className="icon-bar">
            <Link to={`/${client}/Notifications`}><img src={notificationsIcon} alt="" /></Link>
            <Link to={`/${client}/ChatsGroups`}><img src={chatIcon} alt="" /></Link>
            <Link to={`/${client}/Search`}><img src={searchIcon} alt="" /></Link>
        </div>
    )
}

export default Iconbar
