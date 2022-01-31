import LeftSideBarAuthProfile from "../LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "../LeftSideBarAuthProfileFullScreen";
import RightSideBar from "../rightSideBar/RightSideBar"
import MenuStatus from "../../hooks/MenuStatus";
import { client } from "../../hooks/Client"
import { useHistory } from "react-router-dom";
import uuid from 'react-uuid';
import { db, timestamp } from "../../firebase/config.js"
import { useFirestoreID, useFirestoreQuestionnairesFilled } from "../../firebase/useFirestore"
import sendIcon from '../../images/icons/send-icon.png'
import editIcon from '../../images/icons/edit-icon.png'
import { useState } from 'react';
import Location from "../../hooks/Location"

const QuestionnaireAnalysis = () => {
    const menuState = MenuStatus()
    const history = useHistory()
    const id = uuid()
    const route = Location()[3]
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    const questionnaires = useFirestoreID('Questionnaires', route)
    const responses = useFirestoreQuestionnairesFilled(route)

    const linkRespons = (e) => {
        const id = e.target.dataset.id 

        history.push(`/${client}/QuestionnairesRespons/${id}`)
    }


  return  <div className="main">
        <LeftSideBarAuthProfile />
        <LeftSideBarAuthProfileFullScreen/>
        <div className="profile profile-auth-profile" style={{display: menuState}}>
            <div className="settings-inner-container">
                <div className="divider card-header">
                    {questionnaires && questionnaires.map(questionnaire => (
                        <div>
                            <h1>Analyse van {questionnaire.Title}</h1>
                            <p>Analyseer de responses van {questionnaire.Title}</p>
                        </div>
                    ))}
                </div>
                <div className='divider'>
                    <h2>Analyseer vragenlijst</h2>
                </div>
                <div className='divider'>
                    <h2>Responses</h2>
                    {responses && responses.map(respons => (
                        <div id='respons-overview-container'>
                            <p>{respons.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                            <button className='button-simple' data-is={respons.ID} onClick={linkRespons}>Bekijk</button>
                        </div>
                    ))}

                </div>
            </div>
        </div>
        <RightSideBar />
        </div>
};

export default QuestionnaireAnalysis;
