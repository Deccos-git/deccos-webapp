import LeftSideBar from "../LeftSideBar";
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import RightSideBar from "../rightSideBar/RightSideBar"
import MenuStatus from "../../hooks/MenuStatus";
import { useFirestoreID, useFirestoreMessages, useFirestore } from "../../firebase/useFirestore"
import Location from "../../hooks/Location"
import { useHistory } from "react-router-dom";
import { client } from "../../hooks/Client"
import ArrowLeftIcon from '../../images/icons/arrow-left-icon.png'
import userIcon from '../../images/icons/user-icon.png'
import Reaction from "../Community/Reaction"
import MessageBar from "../Community/MessageBar"
import { Auth } from '../../StateManagment/Auth';
import uuid from 'react-uuid';
import { db, timestamp } from "../../firebase/config.js"
import { useState, useEffect, useContext  } from 'react'
import ButtonClicked from "../../hooks/ButtonClicked";

const MilestoneDetail = () => {
    const [authO] = useContext(Auth)

    const [headerPhoto, setHeaderPhoto] = useState('')
    const [title, setTitle] = useState(null)
    const [completed, setCompleted] = useState('')
    const [activityID, setActivityID] = useState('')
    const [docid, setDocid] = useState('')
    const [currentAmount, setCurrentAmount] = useState('')

    const menuState = MenuStatus()
    const route = Location()[3]
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const history = useHistory();

    const milestones = useFirestoreID('Milestones', route)
    const reactions = useFirestoreMessages("Messages", route )
    const banners = useFirestore('Banners')  

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
            setActivityID(milestone.ActivityID)
            setDocid(milestone.docid)
        })
    }, [milestones])

    const taskCompleted = () => {
        if(completed === false){
            return 'Nee'
        } else if (completed === true){
            return 'Ja'
        }
    }

    const backToOverview = () => {

        history.push(`/${client}/Milestones`)

    }

    const activityLink = (e) => {

        const id = e.target.dataset.id

        history.push(`/${client}/ActivityDetail/${id}`)

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

    const currentAmountHandler = (e) => {
        const amount = e.target.value
        
        setCurrentAmount(amount)
        
    }

    const saveMilestoneStep = (e) => {

        ButtonClicked(e, 'Opgeslagen')

        const docid = e.target.dataset.docid
        const milestoneID = e.target.dataset.id
        const milestoneTitle = e.target.dataset.title

        db.collection('Milestones')
        .doc(docid)
        .update({
            CurrentAmount: currentAmount
        })
        .then(() => {
            db.collection('MilestoneSteps')
            .doc()
            .set({
                Compagny: client,
                Timestamp: timestamp,
                MilestoneID: milestoneID,
                MilestoneTitle: milestoneTitle,
                Step: currentAmount,
                ID: uuid()
            })
        })
        .then(() => {
            db.collection("AllActivity")
            .doc()
            .set({
                Title: `${milestoneTitle}. Gezette stap: ${currentAmount}`,
                Type: "NewMilestoneStep",
                Compagny: client,
                Timestamp: timestamp,
                ID: uuid(),
                Description: "heeft een nieuwe stap gezet richting een mijlpaal:",
                ButtonText: "Bekijk mijlpaal",
                User: authO.UserName,
                UserPhoto: authO.Photo,
                UserID: authO.ID,
                Banner: headerPhoto,
                Link: `MilestoneDetail/${milestoneID}`
            }) 
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
                            <h3>Afgerond</h3>
                            <p>{taskCompleted()}</p>
                        </div>
                        <div className='pointer'>
                            <h3>Activiteit</h3>
                            <p data-id={milestone.ActivityID} onClick={activityLink}>{milestone.Activity}</p>
                        </div>
                        <div>
                            <h3>Huidig aantal</h3>
                            <input className='activity-meta-title-description' type="number" defaultValue={milestone.CurrentAmount} onChange={currentAmountHandler} />
                            <button className='button-simple' data-title={milestone.Title} data-docid={milestone.docid} data-id={milestone.ID} onClick={saveMilestoneStep}>Opslaan</button>
                        </div>
                        
                        <div>
                            <h3>Vervaldatum</h3>
                            <p>{milestone.Deadline}</p>
                        </div>
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