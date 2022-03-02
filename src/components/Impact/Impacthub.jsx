import RightSideBar from "../rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "../LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "../LeftSideBarAuthProfileFullScreen";
import MenuStatus from "../../hooks/MenuStatus";
import { db } from "../../firebase/config.js"
import { useState, useEffect } from "react";
import {useFirestore} from "../../firebase/useFirestore"

const Impacthub = () => {

    const [ID, setID] = useState('') 

    const menuState = MenuStatus()

    const compagnies = useFirestore('CompagnyMeta')
    const questionnaires = useFirestore('Questionnaires')

    useEffect(() => {
      compagnies && compagnies.forEach(compagny => {
          const ID = compagny.ID 

          setID(ID)
      })
    }, [compagnies]);
    
    const ToggleSwitch = ({questionnaire}) => {
        return (
          <div className="container">
            <div className="toggle-switch">
              <input type="checkbox" className="checkbox"
                     name={questionnaire.Title} id={questionnaire.Title} data-docid={questionnaire.docid} onChange={toggleQuestionnaire} />
              <label className="label" htmlFor={questionnaire.Title}>
                <span className="inner"/>
                <span className="switch"/>
              </label>
            </div>
          </div>
        );
      };

    const toggleQuestionnaire = (e) => {

        const check = e.target.checked
        const docid = e.target.dataset.docid

        db.collection('Questionnaires')
        .doc(docid)
        .update({
            Public: check
        })

    }
    
    return (
       <div className="main">
            <LeftSideBarAuthProfile />
            <LeftSideBarAuthProfileFullScreen/>
            <div className="profile profile-auth-profile" style={{display: menuState}}>
                <div className="card-header">
                    <h1>Impacthub</h1>
                    <p>Verander de instellingen voor de impacthub</p>
                </div>
                <div className='divider'>
                    <h2>Deel impactdashboard op impacthub</h2>
                </div>
                <div className='divider'>
                    <h2>Deel mijlpalen op impacthub</h2>
                </div>
                <div className='divider'>
                    <h2>Deel vragenlijsten op impacthub</h2>
                    {questionnaires && questionnaires.map(questionnaire => (
                        <div className='functionality-container' key={questionnaire.ID}>
                           <p>{questionnaire.Title}</p>
                           <ToggleSwitch questionnaire={questionnaire}/>
                        </div>
                    ))}
                </div>
                <div>
                    <a href={`https://deccos.nl/Impacthub/OrganisationDetail/${ID}`}><button>Naar impacthub</button></a>
                   
                </div>
            </div>
            <RightSideBar />
        </div>
    )
}

export default Impacthub
