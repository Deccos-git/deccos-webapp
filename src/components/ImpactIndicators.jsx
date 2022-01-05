import RightSideBar from "./rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "./LeftSideBarAuthProfileFullScreen";
import MenuStatus from "../hooks/MenuStatus";
import { db } from "../firebase/config.js"
import { useState, useEffect } from "react";
import {useFirestore} from "../firebase/useFirestore"
import uuid from 'react-uuid';
import { client } from "../hooks/Client";

const ImpactIndicators = () => {
    const [questionniare, setQuestionniare] = useState('')
    const [docid, setDocid] = useState('')

    const menuState = MenuStatus()

    const impact= useFirestore("Impact")

    useEffect(() => {
        impact&& impact.forEach(imp => {
            setQuestionniare(imp.Questionnaire)
            setDocid(imp.docid)
        })
    },[impact])

    const questionnaireStatus = () => {
        if(questionniare === true){
            return 'checked'
        } else {
            return ''
        }
    }

    const ToggleSwitchQuestionnaire = () => {
        return (
          <div className="container">
            <div className="toggle-switch">
              <input type="checkbox" className="checkbox" defaultChecked={questionnaireStatus()}
                     name={'questionnaire'} id={'questionnaire'} onChange={toggleQuestionnaire} />
              <label className="label" htmlFor={'questionnaire'}>
                <span className="inner"/>
                <span className="switch"/>
              </label>
            </div>
          </div>
        );
      };

        // Save setting to database

    const toggleQuestionnaire = (e) => {
        const setting = e.target.checked

        db.collection('Impact')
        .doc(docid)
        .update({
            Questionnaires: setting
        })
    }

    

    return (
       <div className="main">
            <LeftSideBarAuthProfile />
            <LeftSideBarAuthProfileFullScreen/>
            <div className="profile profile-auth-profile" style={{display: menuState}}>
                <div className="card-header">
                    <h1>Impact meetinstrumenten</h1>
                    <p>Verander de instellingen van de impact meetinstrumenten</p>
                </div>
                <div>
                    <h2>Meetinstrumenten</h2>
                    <div className='functionality-container'>
                        <p>Resultaten van vragenlijsten</p>
                        <ToggleSwitchQuestionnaire/>
                    </div>
                </div>
            </div>
            <RightSideBar />
        </div>
    )
}

export default ImpactIndicators
