import { useFirestoreOpenSourceQuestionnnairesID, useFirestoreQuestionnaireFields } from "../../firebase/useFirestore"
import Location from "../../hooks/Location"
import ScrollToTop from "../../hooks/ScrollToTop";
import { useState, useEffect } from 'react';
import MenuStatus from "../../hooks/MenuStatus";
import LeftSideBar from "../LeftSideBar"
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import { NavLink, Link } from "react-router-dom";
import { client } from "../../hooks/Client";
import arrowLeft from '../../images/icons/arrow-left-icon.png'

const OpenSourceQuestionnaire = () => {
    const [title, setTitle ] = useState('')
    const [docid, setDocid ] = useState('')
    const [shortHand, setShortHand] = useState('')

    const route = Location()[3]
    ScrollToTop()
    const menuState = MenuStatus()

    const questionnaires = useFirestoreOpenSourceQuestionnnairesID(route)
    const questionnaireFields = useFirestoreQuestionnaireFields(route)

    console.log(questionnaires)

    useEffect(() => {
        questionnaires && questionnaires.forEach(questionnare => {
            setTitle(questionnare.Title)
            setDocid(questionnare.docid)
            setShortHand(questionnare.Shorthand)
        })
    }, [questionnaires])

    const QuestionnaireField = ({field}) => {

        const [range, setRange] = useState(null)

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
            return(
                <div className='question-type-display-container'>
                    <p className='question-display-title'>{field.Question}</p>
                    <p id='questionnaire-field-text'>Text antwoord</p>
                </div>
            )
        } else if(field.Type === 'scale'){
            return(
                <div className='question-type-display-container'>
                   <p className='question-display-title'>{field.Question}</p>
                   <div id='scale-container'>
                       {field.ReachStartLable}
                       {range && range.map(btn => (
                           <div id='question-type-label-container'>
                                <input type="radio" value={btn} />
                                <label htmlFor={btn}>{btn}</label>
                           </div>
                       ))}
                       {field.ReachEndLabel}
                   </div>
                </div>
            )
        }

    }

  return (
    <div className="main">
        <LeftSideBar />
        <LeftSideBarFullScreen/>
        <div className="main-container" style={{display: menuState}}>
            <div className="page-header">
                <h1>{title}</h1>
                <p>({shortHand})</p>
                <div className='wizard-sub-nav-introduction'>
                    <NavLink to={`/${client}/Questionnaires`} >
                        <div className='step-container'>
                            <p>Vragenlijsten</p>
                            <img src={arrowLeft} alt="" />
                        </div>
                    </NavLink>
                </div>
            </div>
            <div className='profile-no-background'>
                {questionnaireFields && questionnaireFields.map(field => (
                    <div key={field.ID}>
                        <QuestionnaireField field={field}/>
                    </div>
                ))}
            </div>
        </div> 
    </div>
  )
}

export default OpenSourceQuestionnaire