import LeftSideBarAuthProfile from "../LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "../LeftSideBarAuthProfileFullScreen";
import RightSideBar from "../rightSideBar/RightSideBar"
import MenuStatus from "../../hooks/MenuStatus";
import Location from "../../hooks/Location"
import { useFirestoreID,   useFirestoreQuestionnaireFields } from "../../firebase/useFirestore";
import { useEffect, useState } from "react"
import printIcon from '../../images/icons/print-icon.png'

const QuestionnaireSettingsDetail = () => {

    const menuState = MenuStatus()
    const route = Location()[3]

    const questionnaires = useFirestoreID('Questionnaires', route)

    const QuestionnaireField = ({questionnaire}) => {

        return(
            <div>
            {questionnaire && questionnaire.Fields.map(field => (
                <Fields field={field}/>
            ))}
            </div>
        )
    }

    const Fields = ({field}) => {

        const fields = useFirestoreQuestionnaireFields(field)

        return(
            <div>
                {fields && fields.map(field => (
                    <Field field={field}/>
                ))}
            </div>
        )

    }

    const Field = ({field}) => {

        const [range, setRange] = useState(0)

        const start = field.ReachStart
        const end = field.ReachEnd

        useEffect(() => {

        if(field.Type === 'scale'){
            const range = (start, end) => {
                return Array(end - start + 1).fill().map((_, idx) => start + idx)
            }
    
            const result = range(start, end)
              
            setRange(result)
        }

        }, [field])

        if(field.Type === 'paragraph'){
            return (
                <div className='question-container' key={field.ID}>
                    <h2>{field.Question}</h2>
                    <textarea name="" id="" cols="30" rows="10" placeholder='Geef hier uw antwoord'></textarea>
                </div>
            )
            } else if(field.Type === 'scale'){
                return (
                    <div className='question-container' key={field.ID}>
                        <h2>{field.Question}</h2>
                        <div id='scale-container'>
                            {field.ReachStartLable}
                            {range && range.map(btn => (
                                <div id='question-type-label-container'>
                                        <input type="radio" value={btn} name={field.Question} />
                                        <label htmlFor={btn}>{btn}</label>
                                </div>
                            ))}
                            {field.ReachEndLabel}
                        </div>
                    </div>
                )
            } else {
                return null
        }

    }

    const printQuestionnaire = () => {
        window.print()
    }


  return (
     <div className="main">
        <LeftSideBarAuthProfile />
        <LeftSideBarAuthProfileFullScreen/>
        <div className="profile profile-auth-profile" style={{display: menuState}}>
            <div className="settings-inner-container">
                <div className="divider card-header">
                    <h1 id='card-header-title'>Instelligen van vragenlijst</h1>
                    {questionnaires && questionnaires.map(questionnaire => (
                        <div key={questionnaire.ID}>
                            <h2>{questionnaire.Title}</h2>
                        </div>
                    ))}
                </div>
                <div className='divider'>
                    {questionnaires && questionnaires.map(questionnaire => (
                        <QuestionnaireField questionnaire={questionnaire}/>
                    ))}
                </div>
                <div id='print-questionnaire-container'>
                    <img src={printIcon} alt="" onClick={printQuestionnaire} />
                    <p onClick={printQuestionnaire}>Print vragenlijst</p>
                </div>
            </div>
        </div>
        <RightSideBar />
    </div>
  )
}

export default QuestionnaireSettingsDetail