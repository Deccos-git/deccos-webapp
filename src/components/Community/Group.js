import LeftSideBar from "../LeftSideBar"
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import RightSideBarGroup from "../rightSideBar/RightSideBarGroup"
import { useFirestoreID, useFirestoreSubscriptions } from "../../firebase/useFirestore"
import { useContext, useState, useEffect } from 'react';
import { Auth } from '../../StateManagment/Auth';
import Location from "../../hooks/Location"
import MenuStatus from "../../hooks/MenuStatus";
import { useHistory } from "react-router-dom"
import GroupChannel from './GroupChannel'
import { client } from '../../hooks/Client';
import ChatScreen from "./ChatScreen"
import ScrollToTop from "../../hooks/ScrollToTop";

const Group = () => {
    const [authO] = useContext(Auth)
    const [authID, setAuthID] = useState(null)
    const [channelDisplay, setChannelDisplay] = useState('none')
    const [chatDisplay, setChatDisplay] = useState('flex')
    const [tabChat, setTabChat] = useState('active-tab')
    const [channelChat, setChannelTab] = useState('not-active-tab')

    const menuState = MenuStatus()
    const route = Location()[3]
    const history = useHistory()
    ScrollToTop()
    
    const groups = useFirestoreID("Groups", route)
    const subscriptions = useFirestoreSubscriptions(authID)

    useEffect(() => {
        if(authO.ID != undefined){

            setAuthID(authO.ID)
        }
    },[authO])

    useEffect(() => {
        subscriptions && subscriptions.forEach(sub => {

            if(sub.UserID === authO.ID && sub.SubID === route && sub.Approved === false){

                history.push(`/${client}/GroupLanding/${route}`)
            } else if(sub.UserID === authO.ID && sub.SubID === route && sub.Approved === true) {
                return
            }
        })
    },[subscriptions])

    const showChat = () => {
        setChatDisplay('flex')
        setChannelDisplay('none')
        setTabChat('active-tab')
        setChannelTab('not-active-tab')
    }

    const showChannel = () => {
        setChatDisplay('none')
        setChannelDisplay('flex')
        setTabChat('not-active-tab')
        setChannelTab('active-tab')
    }

    return (
        <div className="main">
            <LeftSideBar />
            <LeftSideBarFullScreen/>
            {groups && groups.map(group => (
            <div className="group-outer-container" key={group.ID} style={{display: menuState}}>
                <div className="group-container">
                    <div className="chat-header">
                        <h1>{group.Room}</h1>
                        <div className='group-navigation-container'>
                            <p className={tabChat} onClick={showChat}>Chat</p>
                            <p className={channelChat} onClick={showChannel}>Kanaal</p>
                        </div>
                    </div>
                    <div className='tab-container' style={{display: chatDisplay}}>
                        <ChatScreen group={group}/>
                    </div>
                    <div className='tab-container' style={{display: channelDisplay}}>
                        <GroupChannel />
                    </div>
                </div>
                <RightSideBarGroup group={group} route={route} /> 
            </div>
            ))}
        </div>
    )
}

export default Group