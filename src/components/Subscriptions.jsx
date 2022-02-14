import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "./LeftSideBarAuthProfileFullScreen";
import RightSideBar from "./rightSideBar/RightSideBar"
import MenuStatus from "../hooks/MenuStatus";
import Location from "../hooks/Location"
import { useState, useEffect } from 'react'
import { db } from "../firebase/config";
import { useFirestoreChatsGroups, useFirestoreSubscriptions } from "../firebase/useFirestore";

const Subscriptions = () => {
    const [channelMembers, setChannelMembers] = useState('')
    const [groupMemberList, setGroupMemberList] = useState('')
    const [channels, setChannels] = useState('')
    const [groups, setGroups] = useState('')

    const route = Location()[3]
    const menuState = MenuStatus()

    const subscriptions = useFirestoreSubscriptions(route)

    useEffect(() => {

        const groupArray = []
        const channelArray = []

        subscriptions && subscriptions.forEach(sub => {
            if(sub.Type === 'Group'){
                groupArray.push(sub)
            }

            if(sub.Type === 'Channel'){
                channelArray.push(sub)
            }
        })

        setGroups(groupArray)
        setChannels(channelArray)

    }, [subscriptions])

    const unSub = (e) => {

        const id = e.target.dataset.id

        db.collection('Subscriptions')
        .doc(id)
        .delete()

    }



    return (
        <div className="main">
            <LeftSideBarAuthProfile />
            <LeftSideBarAuthProfileFullScreen/>
             <div className="profile profile-auth-profile" style={{display: menuState}}>
                <div className="settings-inner-container">
                    <h1>Lidmaatschappen</h1>
                </div>
                <div>
                    <h2>Groepen</h2>
                    {groups && groups.map(group => (
                        <div className='subscription-container channel-container' key={group.ID}>
                            <h3>{group.SubName}</h3>
                            <p data-id={group.docid} onClick={unSub}>Verlaten</p>
                        </div>
                    ))}
                </div>
             </div>
             <RightSideBar />
        </div>
    )
}

export default Subscriptions
