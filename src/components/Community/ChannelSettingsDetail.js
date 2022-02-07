import RightSideBar from "../rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "../LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "../LeftSideBarAuthProfileFullScreen";
import deleteIcon from '../../images/icons/delete-icon.png'
import { useState, useEffect } from "react";
import uuid from 'react-uuid';
import { db } from "../../firebase/config";
import { useFirestoreID, useFirestoreChannelItems } from "../../firebase/useFirestore";
import { client } from '../../hooks/Client';
import { useHistory } from "react-router-dom"
import Location from "../../hooks/Location"
import ListLayout from '../../images/Design/list-mockup.png'
import CardLayout from '../../images/Design/card-mockup.png'
import MenuStatus from "../../hooks/MenuStatus";
import plusIcon from '../../images/icons/plus-icon.png'

const ChannelSettingsDetail = () => {
    const [channelName, setChannelName] = useState("")
    const [channelLayout, setChannelLayout] = useState("")
    const [channelBannerLayout, setChannelBannerLayout] = useState("")
    const [channelItemsList, setChannelItemsList] = useState('')

    const route = Location()[3]
    const menuState = MenuStatus()

    const channels = useFirestoreID("Channels", route)
    const history = useHistory()
    const channelItemsKnowledgeCentre = useFirestoreChannelItems('KnowledgeCentre', route)
    const channelItemsEvents = useFirestoreChannelItems('Events', route)
    const channelItemsNews = useFirestoreChannelItems('News', route)
    const channelItems = useFirestoreChannelItems('ChannelItems', route)

    // Set channel items to an array

    const itemsArray = []

    channelItemsKnowledgeCentre && channelItemsKnowledgeCentre.forEach(item => {
        itemsArray.push(item)
    })

    channelItemsEvents && channelItemsEvents.forEach(item => {
        itemsArray.push(item)
    })

    channelItemsNews && channelItemsNews.forEach(item => {
        itemsArray.push(item)
    })

    channelItems && channelItems.forEach(item => {
        itemsArray.push(item)
    })

    const nameHandler = (e) => {
        const name = e.target.value

        setChannelName(name)
    }

    console.log(itemsArray)

    const saveName = () => {

        channels && channels.forEach(channel => {

            db.collection("Channels")
            .doc(channel.docid)
            .update({
                Name: channelName,
            })

        })
    }

    const deleteChannel = (e) => {
        const ID = e.target.dataset.id

        db.collection("Channels")
        .where("ID", "==", ID)
        .onSnapshot(querySnapshot => {
            querySnapshot.forEach(doc => {

                console.log(doc.id)
                db.collection("Channels")
                .doc(doc.id)
                .delete()
            })
        })  
        
        history.push(`/${client}/ChannelSettings`)
    }

    const selectListLayout = () => {
        setChannelLayout("list")
        setChannelBannerLayout("list-banner")
    }

    const selectCardLayout = () => {
        setChannelLayout("card")
        setChannelBannerLayout("card-banner")
    }

    const saveLayout = () => {
        channels && channels.forEach(channel => {

            db.collection("Channels")
            .doc(channel.docid)
            .update({
                Layout: channelLayout,
                BannerLayout: channelBannerLayout
            })

        })
    }

    const deleteItem = (e) => {
        const id = e.target.dataset.id
        const name = e.target.dataset.name

        let collection = ''

        if(name === 'Kenniscentrum'){
            collection = 'KnowledgeCentre'
        } else if(name === 'Nieuws'){
            collection = 'News'
        } else if(name === 'Events'){
            collection = 'Events'
        } else {
            collection = 'ChannelItems'
        }

        db.collection(collection)
        .doc(id)
        .delete()
    }

    const addItem = (e) => {

        const name = e.target.dataset.name
        const channelID = e.target.dataset.id

        if(name === 'Kenniscentrum'){
            history.push(`/${client}/AddArticle`)
        } else if(name === 'Nieuws'){
            history.push(`/${client}/AddNews`)
        } else if(name === 'Events'){
            history.push(`/${client}/AddEvent`)
        } else {
            history.push(`/${client}/AddChannelItem/${channelID}`)
        }

    }

    return (
        <div className="main">
            <LeftSideBarAuthProfile />
            <LeftSideBarAuthProfileFullScreen/>
            {channels && channels.map(channel => (
                <div className='profile profile-auth-profile' style={{display: menuState}}>
                    <div className="divider card-header">
                        <h2>{channel.Name} instellingen</h2>
                        <p>Pas de instellingen van het kanaal {channel.Name} aan</p>
                    </div>
                    <div className="divider">
                        <h3>Titel</h3>
                        <input className="input-classic" type="text" defaultValue={channel.Name} onChange={nameHandler}/>
                        <div className="button-container">
                            <button className="button-simple" onClick={saveName}>Opslaan</button>
                        </div>
                    </div>
                    <div className='divider'>
                        <h3>{channel.Name} items</h3>
                        {itemsArray && itemsArray.map(item => (
                            <div className='channel-container'>
                                <p>{item.Title}</p>
                                <img className="delete-channel" src={deleteIcon} data-name={item.Name} data-id={item.docid} onClick={deleteItem} />
                            </div>
                        ))}
                    </div>
                    <div className='divider'>
                        <h3>{channel.Name} item toevoegen</h3>
                        <img src={plusIcon} id='add-item-channel-settings-detail-button' alt="" data-name={channel.Name} data-id={channel.ID} onClick={addItem} />
                    </div>
                    {/* <div className="divider">
                        <h3>Layout</h3>
                        <div className="layout-container">
                            <div className="layout-inner-div" onClick={selectListLayout}>
                                <h5>Lijst</h5>
                                <img src={ListLayout} alt="" />
                            </div>
                            <div className="layout-inner-div" onClick={selectCardLayout}>
                                <h5>Kaart</h5>
                                <img src={CardLayout} alt="" />
                            </div>
                        </div>
                        <div className="button-container">
                            <button className="button-simple" onClick={saveLayout}>Opslaan</button>
                        </div>
                    </div> */}
                    <div className="divider">
                        <h3>{channel.Name} verwijderen</h3>
                        <img className="delete-channel" src={deleteIcon} data-id={channel.ID} onClick={deleteChannel} />
                    </div>
                </div>
            ))}
            <RightSideBar/>
        </div>
    )
}

export default ChannelSettingsDetail
