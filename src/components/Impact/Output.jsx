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

const Output = () => {
    const [color, setColor] = useState('')

    const menuState = MenuStatus()
    const history = useHistory()

    const outputs = useFirestore('Outputs')
    const colors = useFirestore('Colors')

    useEffect(() => {
        colors && colors.forEach(color => {
            const background = color.Background 

            setColor(background)
        })

    },[colors])

    const outputLink = (e) => {

        const ID = e.target.dataset.id

        history.push(`/${client}/OutputDetail/${ID}`)

    }

    const deleteOutput = (e) => {

        const docid = e.target.dataset.docid

        db.collection('Outputs')
        .doc(docid)
        .delete()
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

    const Instruments = ({output}) => {
        const instruments = useFirestoreImpactInstruments(output.ID) 
        
        return(
            <div className='output-instrument-inner-container'>
                <h4>Interne instrumenten</h4>
                {instruments && instruments.map(instrument => (
                    <p data-id={instrument.ID} onClick={instrumentDetailLink}>{instrument.Output.Output}</p>
                ))}
                <img className='add-instrument-button' src={plusIcon} data-id={output.ID} alt="" onClick={addInstrument} />
            </div>
        )
    }

    const QuestionnairyFields= ({output}) => {

        const questionnaireFields = useFirestoreOutputQuestionnaireFields(output.ID)

        console.log(questionnaireFields)

        return(
            <div className='output-instrument-inner-container'>
                <h4>Vragen</h4>
                {questionnaireFields && questionnaireFields.map(field => (
                    <p data-id={field.ID} onClick={fieldDetailLink}>{field.Question}</p>
                ))}
                <img className='add-instrument-button' src={plusIcon} data-id={output.ID} alt="" onClick={addInstrument} />
            </div>
        )

    }

  return (
    <div className="main">
            <LeftSideBarAuthProfile />
            <LeftSideBarAuthProfileFullScreen/>
            <div className="profile profile-auth-profile" style={{display: menuState}}>
                <div className="card-header">
                    <h1>Output</h1>
                    <p>Verander de instellingen van de impact outputs</p>
                </div>
                <div className='divider'>
                    <h2>Output toevoegen</h2>
                    <Link to={`/${client}/AddOutput`} ><img id="plus-icon-goal-settings" src={plusIcon} alt="" /></Link>
                </div>
                <div>
                    <h2>Outputs</h2>
                    {outputs && outputs.map(output => (
                        <div id="output-container" key={output.ID} style={{backgroundColor: color}}>
                            <h3><b>{output.Title}</b></h3>
                            <p>{output.Type}</p>
                            <h4>Meetinstrumenten</h4>
                            <div className='output-instrument-container'>
                                <Instruments output={output}/>
                                <QuestionnairyFields output={output}/>
                            </div>
                            {/* <p id='number-indicators-output'>{numberOfIndicators(output)} indicatoren</p> */}
                            <div className='icon-container-activities'>
                                <img src={settingsIcon} alt="" className="userrole-users-delete-button" data-id={output.ID} onClick={outputLink}/>
                                <img src={deleteIcon} alt="" className="userrole-users-delete-button" data-docid={output.docid} onClick={deleteOutput} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <RightSideBar />
        </div>
  )
}

export default Output