import RightSideBar from ".././rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from ".././LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from ".././LeftSideBarAuthProfileFullScreen";
import MenuStatus from "../../hooks/MenuStatus";
import { useState, useEffect, useContext } from "react";
import { Colors } from "../../StateManagment/Colors";
import { db, timestamp } from "../../firebase/config";
import uuid from 'react-uuid';
import { client } from "../../hooks/Client"
import {useFirestoreMatchRoadmaps} from "../../firebase/useFirestore"
import deleteIcon from '../../images/icons/delete-icon.png'

const RoadMap = () => {
    const [colors] = useContext(Colors)

    const [title, setTitle] = useState('')
    const [position, setPosition] = useState('')

    const menuState = MenuStatus()

    const matchRoadmaps = useFirestoreMatchRoadmaps()


    const titleHandler = (e) => {
        const title = e.target.value

        setTitle(title)
    }

    const positionHandler = (e) => {
        const position = e.target.value

        setPosition(position)
    }

    const saveStep = () => {

        db.collection('MatchRoadmaps')
        .doc()
        .set({
            Title: title,
            Position: position,
            ID: uuid(),
            Compagny: client,
            Timestamp: timestamp
        })
    }

    const deleteStep = (e) => {
        const id = e.target.dataset.id 

        db.collection('MatchRoadmaps')
        .doc(id)
        .delete()

    }

    return (
        <div className="main" style={{backgroundColor:colors.Background}}>
            <LeftSideBarAuthProfile />
            <LeftSideBarAuthProfileFullScreen/>
            <div className="profile profile-auth-profile" style={{display: menuState}}>
                <div className="card-header">
                    <h1>Stappenplan</h1>
                    <p>Voeg een stappenplan toe aan de matches</p>
                </div>
                <div className='divider'>
                    <h4>Stappen</h4>
                    {matchRoadmaps && matchRoadmaps.map(map => (
                    <div className='roadmap-container' key={map.ID}>
                        <div id='roadmap-inner-container'>
                            <p>{map.Position}</p>
                            <p className='categorie-title'>{map.Title}</p>
                            <img src={deleteIcon} alt="" data-id={map.docid} onClick={deleteStep} />
                        </div>
                    </div>
                    ))}
                </div>
                <div className='divider'>
                    <h4>Voeg een stap toe</h4>
                    <p>Titel</p>
                    <input type="text" placeholder='Geef je stap een titel' onChange={titleHandler} />
                    <p>Positie</p>
                    <input type="number" placeholder='Geef je stap een positie' onChange={positionHandler}/>
                    <div>
                        <button className='button-simple' onClick={saveStep}>Opslaan</button>
                    </div>
                </div>
            </div>
            <RightSideBar />
        </div>
    )
}

export default RoadMap
