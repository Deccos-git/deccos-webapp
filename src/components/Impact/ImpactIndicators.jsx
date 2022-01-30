import RightSideBar from "../rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "../LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "../LeftSideBarAuthProfileFullScreen";
import MenuStatus from "../../hooks/MenuStatus";
import { db } from "../../firebase/config.js"
import { useState, useEffect } from "react";
import {useFirestore} from "../../firebase/useFirestore"

const ImpactIndicators = () => {
    const [questionniare, setQuestionniare] = useState('')
    const [goals, setGoals] = useState('')
    const [matches, setMatches] = useState('')
    const [members, setMembers] = useState('')
    const [docid, setDocid] = useState('')

    const menuState = MenuStatus()

    const impact= useFirestore("Impact")

    useEffect(() => {
        impact&& impact.forEach(imp => {
            setQuestionniare(imp.Questionnaires)
            setGoals(imp.Goals)
            setMatches(imp.Matches)
            setMembers(imp.Members)
            setDocid(imp.docid)
        })
    },[impact])

    // Set switch from database

    const questionnaireStatus = () => {
        if(questionniare === true){
            return 'checked'
        } else {
            return ''
        }
    }

    const goalsStatus = () => {
        if(goals === true){
            return 'checked'
        } else {
            return ''
        }
    }

    const matchesStatus = () => {
        if(matches === true){
            return 'checked'
        } else {
            return ''
        }
    }

    const membersStatus = () => {
        if(members === true){
            return 'checked'
        } else {
            return ''
        }
    }

    // Switches

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

      const ToggleSwitchGoals = () => {
        return (
          <div className="container">
            <div className="toggle-switch">
              <input type="checkbox" className="checkbox" defaultChecked={goalsStatus()}
                     name={'goals'} id={'goals'} onChange={toggleGoals} />
              <label className="label" htmlFor={'goals'}>
                <span className="inner"/>
                <span className="switch"/>
              </label>
            </div>
          </div>
        );
      };

      const ToggleSwitchMatches = () => {
        return (
          <div className="container">
            <div className="toggle-switch">
              <input type="checkbox" className="checkbox" defaultChecked={matchesStatus()}
                     name={'matches'} id={'matches'} onChange={toggleMatches} />
              <label className="label" htmlFor={'matches'}>
                <span className="inner"/>
                <span className="switch"/>
              </label>
            </div>
          </div>
        );
      };

      const ToggleSwitchMembers = () => {
        return (
          <div className="container">
            <div className="toggle-switch">
              <input type="checkbox" className="checkbox" defaultChecked={membersStatus()}
                     name={'members'} id={'members'} onChange={toggleMembers} />
              <label className="label" htmlFor={'members'}>
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

    const toggleGoals = (e) => {
        const setting = e.target.checked

        db.collection('Impact')
        .doc(docid)
        .update({
            Goals: setting
        })
    }

    const toggleMatches = (e) => {
        const setting = e.target.checked

        db.collection('Impact')
        .doc(docid)
        .update({
            Matches: setting
        })
    }

    const toggleMembers = (e) => {
        const setting = e.target.checked

        db.collection('Impact')
        .doc(docid)
        .update({
            Members: setting
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
                    <h4>Meetinstrumenten</h4>
                    <p>Bepaal via welke bronnen je impact wilt meten.</p>
                    <div className='functionality-container'>
                        <p>Resultaten van vragenlijsten</p>
                        <ToggleSwitchQuestionnaire/>
                    </div>
                    <div className='functionality-container'>
                        <p>Voortgang van doelen en activiteiten</p>
                        <ToggleSwitchGoals/>
                    </div>
                    <div className='functionality-container'>
                        <p>Aantal matches</p>
                        <ToggleSwitchMatches/>
                    </div>
                    <div className='functionality-container'>
                        <p>Aantal communityleden</p>
                        <ToggleSwitchMembers/>
                    </div>
                </div>
            </div>
            <RightSideBar />
        </div>
    )
}

export default ImpactIndicators
