import LeftSideBarAuthProfile from "../LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "../LeftSideBarAuthProfileFullScreen";
import RightSideBar from "../rightSideBar/RightSideBar"
import MenuStatus from "../../hooks/MenuStatus";
import { client } from "../../hooks/Client"
import { useHistory } from "react-router-dom";
import uuid from 'react-uuid';
import { db, timestamp } from "../../firebase/config.js"
import { useFirestoreID, useFirestoreQuestionnairesResponses, useFirestoreQuestionnaireFields, useFirestoreQuestionnaireAnalysis } from "../../firebase/useFirestore"
import { useState, useEffect } from 'react';
import Location from "../../hooks/Location"
import ButtonClicked from "../../hooks/ButtonClicked";
import ScrollToTop from "../../hooks/ScrollToTop";

const QuestionnaireAnalysis = () => {
    const [questionnaireTitle, setQuestionnaireTitle] = useState('')

    const menuState = MenuStatus()
    const history = useHistory()
    const id = uuid()
    const route = Location()[3]
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    ScrollToTop()

    const questionnaires = useFirestoreID('Questionnaires', route)
    const responses = useFirestoreQuestionnairesResponses(route)
    const questionnaireFields = useFirestoreQuestionnaireFields(route)
    const analysis = useFirestoreQuestionnaireAnalysis(route)

    useEffect(() => {
      questionnaires && questionnaires.forEach(questionnaire => {
          const title = questionnaire.Title

          setQuestionnaireTitle(title)
      })
    }, [questionnaires]);
    

    const linkRespons = (e) => {
        const id = e.target.dataset.id 

        history.push(`/${client}/QuestionnairesRespons/${id}`)
    }

    const analysisArray = []

    const QuestionnaireFields = ({field}) => {
        const [analyseWord, setAnalyseWord] = useState('')

        if(field.Type === 'paragraph'){
            return (
                <div className='question-analyse-container'>
                    <h3>{field.Question}</h3>
                    <p>Analyseer deze vraag op basis van een analysewoord</p>
                    <input type="text" placeholder='Type hier een analysewoord' data-id={field.ID} onChange={(e) => setAnalyseWord(e.target.value)}/>
                    <Analysis field={field} word={analyseWord}/>
                </div>
            )
        } else if (field.Type === 'scale'){
            return(
                <div className='question-analyse-container'>
                    <h3>{field.Question}</h3>
                    <p>De gemiddelde score is: </p>
                    <ScaleScore id={field.ID} question={field.Question}/>
                </div>
            )
        }
        else {
            return null
        }
    }

    const ScaleScore = ({id, question}) => {
        const scoreArray = []

        responses && responses.forEach(respons => {
            respons.Input.forEach(input => {
                if(input.ID === id){
                    scoreArray.push(parseInt(input.Input))
                }
            })
        })

        const reducer = (previousValue, currentValue) => previousValue + currentValue;

        const sum = scoreArray.reduce(reducer)

        const average = sum/scoreArray.length

         // Set to analysis rapport
        const analysisObject = {
            Question: question,
            QuestionID: id,
            Average: average
        }

        analysisArray.push(analysisObject)

         return <p>{average}</p>
    }

    const Analysis = ({field, word}) => {
        const [inputs, setInputs] = useState([])

        const analyseButton = () => {
            const inputArray = []
            responses && responses.forEach(respons => {
                respons.Input.forEach(input => {
                    if(input.ID === field.ID){
                        if(input.Input.includes(word)){
                            inputArray.push(input)
                        }
                    }
                })
            })

            // Set to analysis rapport
            const analysisObject = {
                Question: field.Question,
                QuestionID: field.ID,
                Word: word,
                Count: inputArray.length
            }

            analysisArray.push(analysisObject)

            setInputs(inputArray)
        }

        return (
            <div>
                <button className='button-simple' onClick={analyseButton}>Analyseer</button>
                <p>Dit woord komt <b>{inputs.length}</b> keer voor in de responses op deze vraag</p>
            </div>
        )
    }

    const saveAnalyses = (e) => {

        ButtonClicked(e, 'Opgeslagen')

        db.collection('QuestionnaireAnalysis')
        .doc()
        .set({
            Compagny: client,
            Timestamp: timestamp,
            QuestionnaireID: route,
            QuestionnaireTitle: questionnaireTitle,
            Analysis: analysisArray
        })

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
                    <h2>Analyseer responses</h2>
                        {questionnaireFields && questionnaireFields.map(field => (
                            <QuestionnaireFields field={field}/>
                        ))}
                        <div>
                            <button onClick={saveAnalyses}>Analyse opslaan</button>
                        </div>
                </div>
                <div className='divider'>
                    <h2>{analysis && 'Analyses'}</h2>
                    {analysis && analysis.map(analyse => (
                        <div id='questionnaire-analysis-container'>
                            {analyse.Analysis.map(question => (
                                <div>
                                    <h3>{question.Question}</h3>
                                    <p>{question.Average && `Gemiddelde score ${question.Average}`}</p>
                                    <p>{question.Word && `Analyse woord: ${question.Word}`}</p>
                                    <p>{question.Count && `Aantal keer in responses: ${question.Count}`}</p>
                                </div>
                            ))}
                        </div>
                    ))}

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
