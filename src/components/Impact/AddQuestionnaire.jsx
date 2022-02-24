import LeftSideBarAuthProfile from "../LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "../LeftSideBarAuthProfileFullScreen";
import RightSideBar from "../rightSideBar/RightSideBar"
import Location from "../../hooks/Location"
import MenuStatus from "../../hooks/MenuStatus";
import { useFirestoreID, useFirestoreQuestionnaireFields, useFirestore } from "../../firebase/useFirestore"
import { useState, useEffect } from 'react';
import { db, timestamp } from "../../firebase/config";
import { client } from "../../hooks/Client";
import uuid from 'react-uuid';
import ButtonClicked from '../../hooks/ButtonClicked'
import deleteIcon from '../../images/icons/delete-icon.png'
import { useHistory } from "react-router-dom";

const AddQuestionnaire = ({output}) => {
    const [title, setTitle ] = useState('Titel van vragenlijst')
    const [docid, setDocid ] = useState('')
    const [ID, setID ] = useState('')
    const [key, setKey] = useState('')
    const [showParagraph, setShowParagraph] = useState('block')
    const [showScale, setShowScale] = useState('none')
    const [type, setType ] = useState('paragraph')
    const [question, setQuestion] = useState(null)
    const [reachStart, setReachStart] = useState(0)
    const [reachEnd, setReachEnd] = useState(0)
    const [reachStartLabel, setReachStartlabel] = useState(null)
    const [reachEndLabel, setReachEndLabel] = useState(null)
    const [goalTitle, setGoalTitle] = useState('')
    const [goalID, setGoalID] = useState('')
    const [questionnaireGoal, setQuestionnaireGoal] = useState('')
    const [color, setColor] = useState('')

    const menuState = MenuStatus()
    const route = Location()[3]
    const history = useHistory()
    const colors = useFirestore('Colors')

    const questionnares = useFirestoreID('Questionnaires', route)
    const questionnaireFields = useFirestoreQuestionnaireFields(route)
    const goals = useFirestore('Goals')

    useEffect(() => {
        questionnares && questionnares.forEach(questionnare => {
            setTitle(questionnare.Title)
            setDocid(questionnare.docid)
            setID(questionnare.ID)
            setGoalID(questionnare.goalID)
            setQuestionnaireGoal(questionnare.GoalTitle)
            setKey(questionnare.Key)
        })
    }, [questionnares])

    useEffect(() => {
        colors && colors.forEach(color => {
            const background = color.Background 

            setColor(background)
        })

    },[colors])

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

    const addField = (e) => {

        ButtonClicked(e, 'Toegevoegd')

        db.collection('QuestionnaireFields')
        .doc()
        .set({
            Compagny: client,
            ID: uuid(),
            Timestamp: timestamp,
            OutputID: output.ID,
            Type: type,
            Question: question,
            ReachStart: parseInt(reachStart),
            ReachStartLable: reachStartLabel,
            ReachEnd: parseInt(reachEnd),
            ReachEndLabel: reachEndLabel,
            Key: uuid()
        })
    }

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
                <div className='question-type-display-container' style={{backgroundColor: color}}>
                    <input type='text' value={field.Question} />
                    <p id='questionnaire-field-text'>Text antwoord</p>
                    <img className='delete-field-icon' src={deleteIcon} alt="" data-docid={field.docid} onClick={deleteField}/>
                </div>
            )
        } else if(field.Type === 'scale'){
            return(
                <div className='question-type-display-container' style={{backgroundColor: color}}>
                   <input type='text' value={field.Question} />
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
                   <img className='delete-field-icon' src={deleteIcon} alt="" data-docid={field.docid} onClick={deleteField}/>
                </div>
            )
        }

    }

    const deleteField = (e) => {

        const docid = e.target.dataset.docid 

        db.collection('QuestionnaireFields')
        .doc(docid)
        .delete()

    }

    return (
        <div>
            <select name="" id="" onChange={typeHandler}>
                <option value="paragraph">Textvraag</option>
                <option value="scale">Schaalvraag</option>
            </select>
            <div className='question-type-display-container' style={{backgroundColor: color}}>
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
    )
}

export default AddQuestionnaire
