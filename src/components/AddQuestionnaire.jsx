import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "./LeftSideBarAuthProfileFullScreen";
import RightSideBar from "./rightSideBar/RightSideBar"
import Location from "../hooks/Location"
import MenuStatus from "../hooks/MenuStatus";
import { useFirestoreID, useFirestoreQuestionnaireFields } from "../firebase/useFirestore"
import { useState, useEffect } from 'react';
import { db, timestamp } from "../firebase/config";
import { client } from "../hooks/Client";
import uuid from 'react-uuid';

const AddQuestionnaire = () => {
    const [title, setTitle ] = useState('Titel van vragenlijst')
    const [docid, setDocid ] = useState('')
    const [showParagraph, setShowParagraph] = useState('block')
    const [showScale, setShowScale] = useState('none')
    const [type, setType ] = useState('paragraph')
    const [question, setQuestion] = useState(null)
    const [reachStart, setReachStart] = useState(0)
    const [reachEnd, setReachEnd] = useState(0)
    const [reachStartLabel, setReachStartlabel] = useState(null)
    const [reachEndLabel, setReachEndLabel] = useState(null)

    const menuState = MenuStatus()
    const route = Location()[3]

    const questionnares = useFirestoreID('Questionnaires', route)
    const questionnaireFields = useFirestoreQuestionnaireFields(route)

    useEffect(() => {
        questionnares && questionnares.forEach(questionnare => {
            setTitle(questionnare.Title)
            setDocid(questionnare.docid)
        })
    }, [questionnares])

    const titleHandler = (e) => {

        const title = e.target.value 

        setTitle(title)

        db.collection('Questionnaires')
        .doc(docid)
        .update({
            Title: title
        })
    }

    const typeHandler = (e) => {

        const type = e.target.options[e.target.selectedIndex].value

        setType(type)

        if(type === 'paragraph'){
            setShowParagraph('block')
            setShowScale('none')
        } else if(type === 'scale'){
            setShowParagraph('none')
            setShowScale('block')
        }
    }

    const questionHandler = (e) => {

        const question = e.target.value 

        setQuestion(question)

    }

    const reachStartHandler = (e) => {

        const reachStart = e.target.options[e.target.selectedIndex].value 

        setReachStart(reachStart)

    }

    const reachStartLabelHandler = (e) => {

        const reachStartLabel = e.target.value 

        setReachStartlabel(reachStartLabel)

    }

    const reachEndHandler = (e) => {

        const reachEnd = e.target.options[e.target.selectedIndex].value 

        setReachEnd(reachEnd)

    }

    const reachEndLabelHandler = (e) => {

        const reachEndLabel = e.target.value 

        setReachEndLabel(reachEndLabel)

    }

    const addField = () => {

        db.collection('QuestionnaireFields')
        .doc()
        .set({
            Compagny: client,
            ID: uuid(),
            Timestamp: timestamp,
            QuestionnaireID: route,
            Type: type,
            Question: question,
            ReachStart: parseInt(reachStart),
            ReachStartLable: reachStartLabel,
            ReachEnd: parseInt(reachEnd),
            ReachEndLabel: reachEndLabel,
        })
    }

    const QuestionnaireField = ({field}) => {

        const [question, setQuestion] = useState(null)
        const [range, setRange] = useState(null)

        useEffect(() => {

            setQuestion(field.Question)
    
        }, [field])

        const start = field.ReachStart
        const end = field.ReachEnd

        console.log(field.Type)

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
                    <input type='text' value={question} />
                    <p id='questionnaire-field-text'>Text antwoord</p>
                </div>
            )
        } else if(field.Type === 'scale'){
            return(
                <div className='question-type-display-container'>
                   <input type='text' value={question} />
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
        <LeftSideBarAuthProfile />
        <LeftSideBarAuthProfileFullScreen/>
        <div className="profile profile-auth-profile" style={{display: menuState}}>
            <div className="settings-inner-container">
                <div className="divider card-header-add-questionnaire">
                    <input type="text" className='editable-text-input' value={title} onChange={titleHandler}/>
                </div>
                <div className="divider">
                    <h2>Vraag toevoegen</h2>
                    <select name="" id="" onChange={typeHandler}>
                        <option value="paragraph">Textvraag</option>
                        <option value="scale">Schaalvraag</option>
                    </select>
                    <div className='question-type-display-container'>
                        <input type="text" id='questionnaire-question' placeholder='Naamloze vraag' onChange={questionHandler} />
                        <div className='questionnaire-field-text-container' style={{display: showParagraph}}>
                            <p id='questionnaire-field-text'>Text antwoord</p>
                        </div>
                        <div className='questionnaire-field-scale-container' style={{display: showScale}}>
                            <div className='select-scale-container'>
                                <select name="" id="" onChange={reachStartHandler}>
                                    <option value="0">0</option>
                                    <option value="1" selected>1</option>
                                </select>
                                <input type="text" placeholder='Voeg label toe' onChange={reachStartLabelHandler} />
                            </div>
                            <p id='scale-reach-symbol'>t/m</p>
                            <div className='select-scale-container'>
                                <select name="" id="" onChange={reachEndHandler}>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5" selected>5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                </select>
                                <input type="text" placeholder='Voeg label toe' onChange={reachEndLabelHandler} />
                            </div>
                        </div>
                    </div>
                    <div>
                        <button className='button-simple' onClick={addField}>Toevoegen</button>
                    </div>
                </div>
                <div>
                    <h2>Vragenlijst</h2>
                    {questionnaireFields && questionnaireFields.map(field => (
                        <div>
                            <QuestionnaireField field={field}/>
                        </div>
                    ))}

                </div>
            </div>
        </div>
        <RightSideBar />
        </div>
    )
}

export default AddQuestionnaire
