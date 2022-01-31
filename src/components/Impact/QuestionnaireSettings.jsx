import LeftSideBarAuthProfile from "../LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "../LeftSideBarAuthProfileFullScreen";
import RightSideBar from "../rightSideBar/RightSideBar"
import MenuStatus from "../../hooks/MenuStatus";
import { client } from "../../hooks/Client"
import { useHistory } from "react-router-dom";
import uuid from 'react-uuid';
import { db, timestamp } from "../../firebase/config.js"
import { useFirestore } from "../../firebase/useFirestore"
import sendIcon from '../../images/icons/send-icon.png'
import editIcon from '../../images/icons/edit-icon.png'
import { useState } from 'react';

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

    const sendQuestionnaire = (e) => {

        const ID = e.target.dataset.id
        const key = e.target.dataset.key

        history.push(`/${client}/SendQuestionnaire/${ID}/${key}`)
    }

    const Responses = ({questionnaire}) => {

        const [length, setLength] = useState(0)

        const id = questionnaire.ID 

        db.collection('QuestionnairesFilled')
        .where('Compagny', '==', client)
        .where('QuestionnaireID', '==', id)
        .get()
        .then(querySnapshot => {

            const length = querySnapshot.size

            setLength(length)
           
        })

        if(length !== 0){
            return <p id='responses-count' data-id={questionnaire.ID} onClick={showResponses}>Bekijk {length} responses</p>
        } else {
            return null
        }


    }

    const showResponses = (e) => {

        const id = e.target.dataset.id 

        history.push(`/${client}/QuestionnaireAnalysis/${id}`)

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
                        <div className='impact-questionnaires-container'>
                            <h3>{questionnaire.Title}</h3>
                            <div id='impact-questionnaire-icon-container'>
                                <Responses questionnaire={questionnaire}/>
                                <img src={sendIcon} alt="" data-key={questionnaire.Key} data-id={questionnaire.ID} onClick={sendQuestionnaire} />
                                <img src={editIcon} alt="" data-id={questionnaire.ID} onClick={questionnaireLink}/>
                            </div>
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
