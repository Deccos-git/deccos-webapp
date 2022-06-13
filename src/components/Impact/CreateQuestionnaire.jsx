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
import ButtonClicked from "../../hooks/ButtonClicked";
import ScrollToTop from "../../hooks/ScrollToTop";

const CreateQuestionnaire = () => {
    const [fields, setFields] = useState([])
    const [title, setTitle] = useState('')

    const menuState = MenuStatus()
    ScrollToTop()

    const questionnaireFields = useFirestore('QuestionnaireFields')

    const fieldHandler = (e) => {

        const field = e.target.dataset.id
        
        setFields([...fields, field])
    }

    const titleHandler = (e) => {
        const title = e.target.value 

        setTitle(title)
    }

    const saveQuestionnaire = (e) => {

        ButtonClicked(e, 'Opgeslagen')

        db.collection('Questionnaires')
        .doc()
        .set({
            Title: title,
            ID: uuid(),
            Fields: fields,
            Timestamp: timestamp,
            Compagny: client
        })
    }

  return (
    <div className="main">
        <LeftSideBarAuthProfile />
        <LeftSideBarAuthProfileFullScreen/>
        <div className="profile profile-auth-profile" style={{display: menuState}}>
            <div className="settings-inner-container">
                <div className="divider card-header">
                    <h1>Creeer een vragenlijsten</h1>
                    <p>Meet je impact bij je stakeholders</p>
                </div>
                <div>
                    <h2>Selecteer een titel</h2>
                    <input type="text" placeholder='Schrijf hier de titel van je vragenlijst' onChange={titleHandler}/>
                </div>
                <div className='divider'>
                    <h2>Selecteer vragen</h2>
                    {questionnaireFields && questionnaireFields.map(field => (
                        <div className='create-questionnaire-field-container' key={field.ID}>
                            <input type="radio" id={field.Question} data-id={field.ID} onChange={fieldHandler} />
                            <label htmlFor={field.Question} >{field.Question}</label>
                            <p>Type: {field.Type}</p>
                        </div>
                    ))}
                </div>
                <div>
                    <button onClick={saveQuestionnaire}>Opslaan</button>
                </div>
            </div>
        </div>
        <RightSideBar />
    </div>
  )
}

export default CreateQuestionnaire