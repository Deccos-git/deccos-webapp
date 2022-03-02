import RightSideBar from "../rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "../LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "../LeftSideBarAuthProfileFullScreen";
import MenuStatus from "../../hooks/MenuStatus";
import { db } from "../../firebase/config.js"
import { useState, useEffect } from "react";
import {useFirestore, useFirestoreImpactInstruments, useFirestoreOutputQuestionnaireFields } from "../../firebase/useFirestore"
import { client } from "../../hooks/Client"
import deleteIcon from '../../images/icons/delete-icon.png'
import settingsIcon from '../../images/icons/settings-icon.png'
import { useHistory } from "react-router-dom";
import plusIcon from '../../images/icons/plus-icon.png'
import { Link } from "react-router-dom";

const MilestoneSettings = () => {
    const [color, setColor] = useState('')

    const menuState = MenuStatus()
    const history = useHistory()

    const milestones = useFirestore('Milestones')
    const colors = useFirestore('Colors')

    useEffect(() => {
        colors && colors.forEach(color => {
            const background = color.Background 

            setColor(background)
        })

    },[colors])

    const Instruments = ({milestone}) => {
        const instruments = useFirestoreImpactInstruments(milestone.ID) 
        
        return(
            <div className='output-instrument-inner-container'>
                <h4>Interne instrumenten</h4>
                {instruments && instruments.map(instrument => (
                    <p data-id={instrument.ID} onClick={instrumentDetailLink}>{instrument.Output.Output}</p>
                ))}
                <img className='add-instrument-button' src={plusIcon} data-id={milestone.ID} alt="" onClick={addInstrument} />
            </div>
        )
    }

    const QuestionnairyFields= ({milestone}) => {

        const questionnaireFields = useFirestoreOutputQuestionnaireFields(milestone.ID)

        console.log(questionnaireFields)

        return(
            <div className='output-instrument-inner-container'>
                <h4>Vragen</h4>
                {questionnaireFields && questionnaireFields.map(field => (
                    <p data-id={field.ID} onClick={fieldDetailLink}>{field.Question}</p>
                ))}
                <img className='add-instrument-button' src={plusIcon} data-id={milestone.ID} alt="" onClick={addInstrument} />
            </div>
        )

    }

    const addInstrument = (e) => {

        const ID = e.target.dataset.id

        history.push(`/${client}/AddInstrument/${ID}`)

    }

    const instrumentDetailLink = (e) => {

        const ID = e.target.dataset.id

        history.push(`/${client}/InstrumentDetail/${ID}`)
    }

    const fieldDetailLink = (e) => {
        const ID = e.target.dataset.id

        history.push(`/${client}/QuestionnaireFieldDetail/${ID}`)
    }

    const milestoneLink = (e) => {

        const ID = e.target.dataset.id

        history.push(`/${client}/MilstoneDetail/${ID}`)

    }

    const deleteMilestone = (e) => {

        const docid = e.target.dataset.docid

        db.collection('Milestones')
        .doc(docid)
        .delete()
    }

  return (
    <div className="main">
        <LeftSideBarAuthProfile />
        <LeftSideBarAuthProfileFullScreen/>
        <div className="profile profile-auth-profile" style={{display: menuState}}>
            <div className="card-header">
                <h1>Mijlpalen</h1>
                <p>Verander de instellingen van de mijlpalen</p>
            </div>
            <div className='divider'>
                <h2>Mijlpaal toevoegen</h2>
                <Link to={`/${client}/AddMilestone`} ><img id="plus-icon-goal-settings" src={plusIcon} alt="" /></Link>
            </div>
            <div>
                <h2>Mijlpalen</h2>
                {milestones && milestones.map(milestone => (
                    <div id="output-container" key={milestone.ID} style={{backgroundColor: color}}>
                        <h3><b>{milestone.Title}</b></h3>
                        <h4>Meetinstrumenten</h4>
                            <div className='output-instrument-container'>
                                <Instruments milestone={milestone}/>
                                <QuestionnairyFields milestone={milestone}/>
                            </div>
                        <div className='icon-container-activities'>
                            <img src={settingsIcon} alt="" className="userrole-users-delete-button" data-id={milestone.ID} onClick={milestoneLink}/>
                            <img src={deleteIcon} alt="" className="userrole-users-delete-button" data-docid={milestone.docid} onClick={deleteMilestone} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
        <RightSideBar />
    </div>
  )
}

export default MilestoneSettings