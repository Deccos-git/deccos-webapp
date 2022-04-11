import LeftSideBar from "../LeftSideBar";
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import RightSideBar from "../rightSideBar/RightSideBar"
import MenuStatus from "../../hooks/MenuStatus";
import { useFirestoreID, useFirestoreMessages, useFirestore} from "../../firebase/useFirestore"
import Location from "../../hooks/Location"
import { useHistory } from "react-router-dom";
import { client } from "../../hooks/Client"
import ArrowLeftIcon from '../../images/icons/arrow-left-icon.png'
import userIcon from '../../images/icons/user-icon.png'
import festiveIcon from '../../images/icons/festive-icon.png'
import Reaction from "../Community/Reaction"
import MessageBar from "../Community/MessageBar"
import { Auth } from '../../StateManagment/Auth';
import uuid from 'react-uuid';
import { db, timestamp } from "../../firebase/config.js"
import { useState, useEffect, useContext  } from 'react'
import ButtonClicked from "../../hooks/ButtonClicked";

const MilestoneDetail = () => {
    const [authO] = useContext(Auth)
    const [color, setColor] = useState('')

    const [headerPhoto, setHeaderPhoto] = useState('')
    const [title, setTitle] = useState(null)
    const [completed, setCompleted] = useState('')
    const [docid, setDocid] = useState('')

    const menuState = MenuStatus()
    const route = Location()[3]
    const options = { day: 'numeric', month: 'numeric', year: 'numeric'};
    const history = useHistory();

    const milestones = useFirestoreID('Milestones', route)
    const reactions = useFirestoreMessages("Messages", route )
    const banners = useFirestore('Banners')  
    const colors = useFirestore('Colors')

    useEffect(() => {
        colors && colors.forEach(color => {
            const background = color.Background 

            setColor(background)
        })

    },[colors])

    useEffect(() => {
        banners && banners.forEach(banner => {
            const header = banner.NewGoal
            setHeaderPhoto(header)
        })
      }, [banners])

    useEffect(() => {

        milestones && milestones.forEach(milestone => {
            setTitle(milestone.Title)
            setCompleted(milestone.Completed)
            setDocid(milestone.docid)
        })
    }, [milestones])

    const backToOverview = () => {

        history.push(`/${client}/Milestones`)

    }

    const titleHandler = (e) => {
        const title = e.target.value

        saveTitle(title)

    }

    const saveTitle = (title) => {

        db.collection('Milestones')
        .doc(docid)
        .update({
            Task: title,
            Title: title
        })
    }

    return (
         <div className="main">
        <LeftSideBar />
        <LeftSideBarFullScreen/>
        <div className="main-container" style={{display: menuState}}>
            <div className="previous-message-container" onClick={backToOverview}>
                <img src={ArrowLeftIcon} alt="" />
                <p>Mijlpaal overzicht</p>
            </div>
            <div className='page-header task-detail-header'>
                <input id='input-task-edit-title' type="text" defaultValue={title} onChange={titleHandler}/>
                {milestones && milestones.map(milestone => (
                <div className='task-detail-container'>
                    <div className='task-detail-inner-container'>
                        <div>
                            <h3>Gecreerd op</h3>
                            <p>{milestone.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                        </div>
                    </div>
                </div>
            ))}
            </div>
            <h2>Berichten</h2>
            <MessageBar/>
            <div className="reaction-area">
                {reactions && reactions.map(reaction => (
                    <Reaction message={reaction}/>
                ))}
            </div>
        </div>
        <RightSideBar />
        </div>
    )
}

export default MilestoneDetail