import LeftSideBar from "../LeftSideBar";
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import RightSideBar from "../rightSideBar/RightSideBar"
import MenuStatus from "../../hooks/MenuStatus";
import { useFirestore, useFirestoreActivities, useFirestoreUsersApproved } from "../../firebase/useFirestore";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom"
import { client } from "../../hooks/Client"

const ImpactProgress = () => {
    const [questionniare, setQuestionniare] = useState('')
    const [goals, setGoals] = useState('')
    const [matches, setMatches] = useState('')
    const [members, setMembers] = useState('')
    const [progression, setProgression] = useState(0)
    const [goalID, setGoalID] = useState('')
    const [goalName, setGoalName] = useState('')
    const [memberCount, setMemberCount] = useState('')

    const menuState = MenuStatus()
    const history = useHistory()

    const impact = useFirestore('Impact')
    const goalsDB = useFirestore('Goals')
    const matchesDB = useFirestore('Matches')
    const questionnaireAnalysis = useFirestore('QuestionnaireAnalysis')
    const activities = useFirestoreActivities(goalID)
    const membersDB = useFirestoreUsersApproved(false, true)

    useEffect(() => {
        goalsDB && goalsDB.forEach(goal => {
            setGoalID(goal.ID)
            setGoalName(goal.Title)
        })
    }, [goalsDB])

    // Get display or hide indicators from database

    useEffect(() => {
        impact&& impact.forEach(imp => {
            setQuestionniare(imp.Questionnaires)
            setGoals(imp.Goals)
            setMatches(imp.Matches)
            setMembers(imp.Members)
        })
    },[impact])

    // Link to details

    const goalLink = () => {
        history.push(`/${client}/GoalDetail/${goalID}`)
    }

    const matchesLink = () => {
        history.push(`/${client}/Matches`)
    }

    const memberLink = () => {
        history.push(`/${client}/Members`)
    }

    // Number of members

    useEffect(() => {
        const membersArray = []
        membersDB && membersDB.forEach(member => {
            membersArray.push(member)
        })
        setMemberCount(membersArray.length)
    }, [members])

    // Display or hide indicators

    const Goals = () => {
        if(goals === true){
            return(
                <div className='divider'>
                    <h2>Doelen en activiteiten</h2>
                    <h4>{goalName}</h4>
                    <p>Voortgang {Math.trunc(progression)}%</p>
                    <div className='progressionbar-outer-bar'>
                        <div className='progressionbar-completed' style={{width: `${progression}%`}}></div>
                    </div>
                    <button className='button-simple' onClick={goalLink}>Bekijk</button>
                </div>
            )
        } else {
            return null
        }
    }

    const Questionnaire = () => {
        if(questionniare === true){
            return(
                <div className='divider'>
                    <h2>Vragenlijsten</h2>
                    {questionnaireAnalysis && questionnaireAnalysis.map(analyse => (
                        <div id='impact-progress-questionnaire-container'>
                            <h3>{analyse.QuestionnaireTitle}</h3>
                            {analyse.Analysis.map(question => (
                                <div>
                                    <h4>{question.Question}</h4>
                                    <p>{question.Average && `Gemiddelde score ${question.Average}`}</p>
                                    <p>{question.Word && `Analyse woord: ${question.Word}`}</p>
                                    <p>{question.Count && `Aantal keer in responses: ${question.Count}`}</p>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )
        } else {
            return null
        }
    }

    const Members = () => {
        if(members === true){
            return(
                <div className='divider'>
                    <h2>Leden</h2>
                    <p>Aantal leden {memberCount}</p>
                    <button className='button-simple' onClick={memberLink}>Bekijk</button>
                </div>
            )
        } else {
            return null
        }
    }

    const Matches = () => {
        if(matches === true){
            return(
                <div className='divider'>
                    <h2>Matches</h2>
                    <p>Aantal matches {matchesDB.length}</p>
                    <button className='button-simple' onClick={matchesLink}>Bekijk</button>
                </div>
            )
        } else {
            return null
        }
    }

    // Goal progression

    const totalProgressionArray = []

    useEffect(() => {
        activities && activities.forEach(activity => {
            const progression = activity.Progression 

            const maxProgression = activities.length

            const fractualProgression = progression/maxProgression

            totalProgressionArray.push(fractualProgression)

            const totalProgression = totalProgressionArray.reduce((a, b) => a + b, 0)

            setProgression(totalProgression)
        })
        
    }, [activities])

    return (
        <div className="main">
            <LeftSideBar />
            <LeftSideBarFullScreen/>
            <div className="main-container" style={{display: menuState}}>
                <div className="page-header">
                    <h1>Impact dashboard</h1>  
                </div>
                <div className='profile profile-auth-profile'>
                    <Goals/>
                    <Questionnaire/>
                    <Members/>
                    <Matches/>
                </div>
            </div>
            <RightSideBar />
        </div>
    )
}

export default ImpactProgress
