import LeftSideBar from "../LeftSideBar";
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import RightSideBar from "../rightSideBar/RightSideBar"
import MenuStatus from "../../hooks/MenuStatus";
import { 
    useFirestore, 
    useFirestoreActivities, 
    useFirestoreTasksGoals, 
    useFirestoreTasksCompleteGoals, 
    useFirestoreTasks, 
    useFirestoreTasksComplete, 
    useFirestoreOutputs,
    useFirestoreImpactInstruments,
    useFirestoreOutputQuestionnaireFields,
    useFirestoreUsersApproved
} from "../../firebase/useFirestore";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom"
import { client } from "../../hooks/Client"
import { db } from "../../firebase/config";

const ImpactProgress = () => {
    const [questionniare, setQuestionniare] = useState('')
    const [goals, setGoals] = useState('')
    const [matches, setMatches] = useState('')
    const [members, setMembers] = useState('')
    const [goalID, setGoalID] = useState('')
    const [memberCount, setMemberCount] = useState('')
    const [color, setColor] = useState('')

    const menuState = MenuStatus()
    const history = useHistory()

    const impact = useFirestore('Impact')
 
    const matchesDB = useFirestore('Matches')
    const questionnaireAnalysis = useFirestore('QuestionnaireAnalysis')
    const colors = useFirestore('Colors')

    useEffect(() => {
        colors && colors.forEach(color => {
            const background = color.Background 

            setColor(background)
        })

    },[colors])

    const Goals = () => {
        const goals = useFirestore('Goals')

        return(
            <>
            {goals && goals.map(goal => (
            <div>
            <img id='impact-dasboard-goal-banner' src={goal.Banner} alt="" />
            <div id='impact-progress-goal-container' className='divider'>
                <h2>{goal.Title}</h2>
                <div className='progressionbar-outer-bar'>
                    <ProgressionBarGoal goal={goal}/>
                </div>
                <div id='goal-meta-container'>
                    <div className='goal-meta-inner-container'>
                        <h3>SDG</h3>
                        <p>{goal.SDG}</p>
                    </div>
                    <div className='goal-meta-inner-container'>
                        <h3>Doelgroep</h3>
                        <p>{goal.Targetgroup}</p>
                    </div>
                    <div className='goal-meta-inner-container'>
                        <h3>Impact op doelgroep</h3>
                        <p>{goal.ImpactTargetgroup}</p>
                    </div>
                    <div className='goal-meta-inner-container'>
                        <h3>Impact maatschappij</h3>
                        <p>{goal.ImpactSociety}</p>
                    </div>
                </div>
            </div>
            <Activities goal={goal}/>
            </div>
            ))}
        </>
        )
    }

    const ProgressionBarGoal = ({goal}) => {

        const tasks = useFirestoreTasksGoals(goal.ID)
        const tasksCompleted = useFirestoreTasksCompleteGoals(goal.ID)

        const completedArray = []
        const totalArray = []

        tasks && tasks.forEach(task => {
            totalArray.push(task)
        })

        tasksCompleted && tasksCompleted.forEach(task => {
            completedArray.push(task)
        })

        const onePercentage = totalArray.length !== 0 ? totalArray.length/100 : 0
        const completed = completedArray.length !== 0 ? completedArray.length : 1

        const average = onePercentage*completed

        return(
            <div className='progressionbar-completed' style={{width: `${average}%`}}></div>
        )
    }

    const Activities = ({goal}) => {

        const activities = useFirestoreActivities(goal.ID)

        return(
            <>
                <h2>Activiteiten</h2>
                <div id='activity-outer-container'>
                {activities && activities.map(activity => (
                    <div className='activity-inner-container-dashboard' key={activity.ID} style={{backgroundColor: color}}>
                        <img id='impact-dasboard-activity-banner' src={activity.Banner} alt="" />
                        <h3>{activity.Activity}</h3>
                        <div className='progressionbar-outer-bar'>
                        <ProgressionBarActivity activity={activity}/>
                            <div className='progressionbar-completed' style={{width: `${activity.Progress}%`}}></div>
                        </div>
                        <div>
                            <h4>Resultaten</h4>
                            <Output activity={activity}/>
                        </div>
                        
                    </div>
                ))}
                </div>
            </>
        )
    }

    const Output = ({activity}) => {

        const outputs = useFirestoreOutputs('ActivityID', activity.ID)

        return (
            <div className='impact-dashboard-output-container'>
                {outputs && outputs.map(output => (
                    <div>
                        <h5>{output.Description}</h5>
                        <p>{output.Title}</p>
                        <div className='dashboard-instruments-container' style={{backgroundColor: color}}>
                            <h5>Meetinstrumenten</h5>
                            <Instruments output={output}/>
                            <QuestionnairyFields output={output}/>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    const Instruments = ({output}) => {
        const instruments = useFirestoreImpactInstruments(output.ID) 
        
        return(
            <div className='output-instrument-inner-container'>
                <h4>Interne instrumenten</h4>
                {instruments && instruments.map(instrument => (
                    <div className='dashboard-internal-results-container'>
                        <p data-id={instrument.ID}>{instrument.Output.Output}</p>
                        <ResultsInternal instrument={instrument}/>
                    </div>
                ))}
            </div>
        )
    }

    const QuestionnairyFields= ({output}) => {

        const questionnaireFields = useFirestoreOutputQuestionnaireFields(output.ID)

        return(
            <div className='output-instrument-inner-container'>
                <h4>Vragen</h4>
                {questionnaireFields && questionnaireFields.map(field => (
                    <div className='dashboard-internal-results-container'>
                        <p key={field.ID} data-id={field.ID}>{field.Question}</p>
                        <QuestionnaireResults field={field}/>
                    </div>
                    
                ))}
            </div>
        )

    }

    const ProgressionBarActivity = ({activity}) => {

        const tasks = useFirestoreTasks(activity.ID)
        const tasksCompleted = useFirestoreTasksComplete(activity.ID)

        const completedArray = []
        const totalArray = []

        tasks && tasks.forEach(task => {
            totalArray.push(task)
        })

        tasksCompleted && tasksCompleted.forEach(task => {
            completedArray.push(task)
        })

        const onePercentage = totalArray.length !== 0 ? totalArray.length/100 : 0
        const completed = completedArray.length !== 0 ? completedArray.length : 1

        const average = onePercentage*completed

        return(
            <div className='progressionbar-completed' style={{width: `${average}%`}}></div>
        )
    }

    const ResultsInternal = ({instrument}) => {

        const users = useFirestoreUsersApproved(false)

        const resultArray = []

        if(instrument.Output.Output === 'Aantal leden van de community'){
            const members = users.length 

            resultArray.push({
                Title: 'Leden',
                Amount: members
            })
        }

        if(instrument.Output.Output === 'Aantal matches'){
            const members = users.length 

            resultArray.push({
                Title: 'Leden',
                Amount: members
            })
        }



        return (
            <div>
                {resultArray && resultArray.map(result => (
                    <p>{result.Amount}</p>
                ))}
            </div>
        )
    }

    const QuestionnaireResults = ({field}) => {

        console.log(field)

        return(
            <div></div>
        )
    }

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
                </div>   
            </div>
            <RightSideBar />
        </div>
    )
}

export default ImpactProgress
