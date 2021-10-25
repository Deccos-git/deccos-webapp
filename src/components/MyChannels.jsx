import LeftSideBarPublicProfile from "./LeftSideBarPublicProfile";
import LeftSideBarPublicProfileFullScreen from "./LeftSideBarPublicProfileFullScreen";
import RightSideBar from "./rightSideBar/RightSideBar"
import Location from "../hooks/Location"
import { client } from "../hooks/Client";
import { useHistory } from "react-router-dom";
import MenuStatus from "../hooks/MenuStatus";
import { useState, useContext, useEffect } from 'react'
import { db } from "../firebase/config";


const MyChannels = () => {
    const [channels, setChannels] = useState('')

    const route = Location()[3]
    const history = useHistory()
    const menuState = MenuStatus()

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

    const linkToChannel = (e) => {

        const link = e.target.dataset.link
        const id = e.target.dataset.id

        console.log(link)

        history.push(`/${client}/${link}/${id}`)

    }

    return (
        <div className="main">
        <LeftSideBarPublicProfile />
        <LeftSideBarPublicProfileFullScreen/>
        <div className="card-overview" style={{display: menuState}}>
            <div className="page-header">
                <h1>Mijn groepen</h1>
            </div>
            {channels && channels.map(channel => (
                <div className="list introductions-list my-message" data-id={channel.ID} data-link={channel.Link} onClick={linkToChannel}>
                    <h2>{channel.Name}</h2>
                    <p>Aantal leden: {channel.Members.length}</p>
                </div>
            ))}
            
        </div>
            <RightSideBar />
        </div>
    )
}

export default MyChannels
