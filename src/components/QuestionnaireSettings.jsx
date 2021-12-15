import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "./LeftSideBarAuthProfileFullScreen";
import RightSideBar from "./rightSideBar/RightSideBar"
import MenuStatus from "../hooks/MenuStatus";
import { client } from "../hooks/Client"
import { useHistory } from "react-router-dom";
import uuid from 'react-uuid';
import { db, timestamp } from "../firebase/config.js"
import { useFirestore } from "../firebase/useFirestore"

const QuestionnaireSettings = () => {

    const menuState = MenuStatus()
    const history = useHistory()
    const id = uuid()

    const questionnaires = useFirestore('Questionnaires')

    const newQuestionnaire = () => {

        db.collection('Questionnaires')
        .doc()
        .set({
            ID: id,
            Timestamp: timestamp,
            Compagny: client,
        })
        .then(() => {
            history.push(`/${client}/AddQuestionnaire/${id}`)
        })
    }

    const questionnaireLink = (e) => {

        const ID = e.target.dataset.id

        history.push(`/${client}/AddQuestionnaire/${ID}`)
    }

    return (
        <div className="main">
        <LeftSideBarAuthProfile />
        <LeftSideBarAuthProfileFullScreen/>
        <div className="profile profile-auth-profile" style={{display: menuState}}>
            <div className="settings-inner-container">
                <div className="divider card-header">
                    <h1>Vragenlijsten</h1>
                    <p>Meet je impact bij je stakeholders</p>
                </div>
                <div className="divider">
                    <h2>Vragenlijsten</h2>
                    {questionnaires && questionnaires.map(questionnaire => (
                        <div className='events-signups-container'>
                            <h3>{questionnaire.Title}</h3>
                            <button className='button-simple' data-id={questionnaire.ID} onClick={questionnaireLink}>Bekijk</button>
                        </div>
                    ))}

                </div>
                <div>
                    <button onClick={newQuestionnaire}>Nieuwe vragenlijst</button>
                </div>
            
            </div>
        </div>
        <RightSideBar />
        </div>
    )
}

export default QuestionnaireSettings
