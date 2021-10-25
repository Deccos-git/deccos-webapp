import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "./LeftSideBarAuthProfileFullScreen";
import RightSideBar from "./rightSideBar/RightSideBar"
import MenuStatus from "../hooks/MenuStatus";
import Location from "../hooks/Location"
import { useState, useContext, useEffect } from 'react'
import { db } from "../firebase/config";
import { useFirestoreChatsGroups } from "../firebase/useFirestore";
import { client } from "../hooks/Client";

const Subscriptions = () => {
    const [channels, setChannels] = useState('')
    const [channelMembers, setChannelMembers] = useState('')
    const [groupMembers, setGroupMembers] = useState('')

    const route = Location()[3]
    const menuState = MenuStatus()

    const groups = useFirestoreChatsGroups("Groups", route)

    const authChannels = async () => {

        const channelArray = []

        await db.collection('Channels')
        .where('Compagny', '==', client)
        .where('Members', 'array-contains', route)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                channelArray.push(doc.data())
            })  
        })

        return channelArray
    }

    useEffect(() => {
        authChannels().then((channels) => {
            setChannels(channels)
        })
    }, [])

    const leaveChannel = (e) => {

        const id = e.target.dataset.id
        const members = e.target.dataset.members

        setChannelMembers(members)

        

    }

    const leaveGroup = (e) => {

        const id = e.target.dataset.id
        const members = e.target.dataset.members

        
    }

    return (
        <div className="main">
            <LeftSideBarAuthProfile />
            <LeftSideBarAuthProfileFullScreen/>
             <div className="profile profile-auth-profile" style={{display: menuState}}>
                <div className="settings-inner-container">
                    <h1>Abonnementen</h1>
                </div>
                <div className='divider'>
                    <h2>Kanalen</h2>
                    {channels && channels.map(channel => (
                        <div className='subscription-container channel-container' key={channel.ID}>
                            <h3>{channel.Name}</h3>
                            <p data-members={channel.Members} data-id={channel.ID} onClick={leaveChannel}>Verlaten</p>
                        </div>
                    ))}
                </div>
                <div className='divider'>
                    <h2>Groepen</h2>
                    {groups && groups.map(group => (
                        <div className='subscription-container channel-container' key={group.ID}>
                            <h3>{group.Room}</h3>
                            <p data-members={group.MemberList} data-id={group.ID} onClick={leaveGroup}>Verlaten</p>
                        </div>
                    ))}
                </div>
             </div>
             <RightSideBar />
        </div>
    )
}

export default Subscriptions
