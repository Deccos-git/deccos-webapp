import LeftSideBar from "../LeftSideBar";
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import RightSideBar from "../rightSideBar/RightSideBar"
import MenuStatus from "../../hooks/MenuStatus";
import { 
    useFirestore, 
    useFirestoreID,
    useFirestoreActivities, 
    useFirestoreTasksGoals, 
    useFirestoreTasksCompleteGoals, 
    useFirestoreTasks, 
    useFirestoreTasksComplete, 
    useFirestoreTasksActivities, 
    useFirestoreTasksCompleteActivities, 
    useFirestoreOutputs,
    useFirestoreImpactInstruments,
    useFirestoreUsersApproved,
    useFirestoreMilestones,
    useFirestoreQuestionnaireFields,
    useFirestoreQuestionnairesResponses,
    useFirestoreResults
} from "../../firebase/useFirestore";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom"
import { client } from "../../hooks/Client"
import { db, timestamp } from "../../firebase/config";
import worldIcon from '../../images/icons/world-icon.png'
import worldIcon2 from '../../images/icons/world-icon2.png'
import milestoneIcon from '../../images/icons/milestone-icon.png'
import groupIcon from '../../images/icons/group-icon.png'
import leafIcon from '../../images/icons/leaf-icon.png'
import newUserIcon from '../../images/icons/new-user-icon.png'
import effectIcon from '../../images/icons/traject-icon.png'
import measureIcon from '../../images/icons/measure-icon.png'
import questionIcon from '../../images/icons/question-icon.png'
import houseIcon from '../../images/icons/house-icon.png'
import goalIcon from '../../images/icons/goal-icon.png'
import completeIcon from '../../images/icons/complete-icon.png'
import eventIcon from '../../images/icons/event-icon.png'
import outputIcon from '../../images/icons/output-icon.png'
import festiveIcon from '../../images/icons/festive-icon.png'
import preconditionsIcon from '../../images/icons/preconditions-icon.png'
import externalFactorsIcon from '../../images/icons/external-factors-icon.png'
import impactIcon from '../../images/icons/impact-icon.png'
import resultsIcon from '../../images/icons/results-icon.png'
import progressIcon from '../../images/icons/progress-icon.png'
import typeIcon from '../../images/icons/type-icon.png'
import MemberGraph from "../MemberGraph";
import ManualResultsGraph from "../Impact/ManualResultsGraph";
import uuid from "react-uuid";

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
    const options = { day: 'numeric', month: 'numeric', year: 'numeric'};

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
                <h1>Doel</h1>
            <img id='impact-dasboard-goal-banner' src={goal.Banner} alt="" />
            <div id='impact-progress-goal-container' className='divider'>
                <h2>{goal.Title}</h2>
                {/* <div className='progressionbar-outer-bar'>
                    <ProgressionBarGoal goal={goal}/>
                </div> */}
                <div id='goal-meta-container'>
                    <div className='goal-meta-inner-container'>
                        <div className='goal-meta-title-container'>
                            <img src={worldIcon} alt="" />
                            <h3>SDGs</h3>
                        </div>
                        {goal.SDG && goal.SDG.map(sdg => (
                            <p>{sdg}</p>
                        ))}
                    </div>
                    <div className='goal-meta-inner-container'>
                        <div className='goal-meta-title-container'>
                            <img src={groupIcon} alt="" />
                            <h3>Doelgroep</h3>
                        </div>
                        <p>{goal.Targetgroup}</p>
                    </div>
                    <div className='goal-meta-inner-container'>
                        <div className='goal-meta-title-container'>
                            <img src={newUserIcon} alt="" />
                            <h3>Impact op doelgroep</h3>
                        </div>
                        <p>{goal.ImpactTargetgroup}</p>
                    </div>
                    <div className='goal-meta-inner-container'>
                        <div className='goal-meta-title-container'>
                            <img src={leafIcon} alt="" />
                            <h3>Impact maatschappij</h3>
                        </div>
                        <p>{goal.ImpactSociety}</p>
                    </div>
                    <div className='goal-meta-inner-container'>
                        <div className='goal-meta-title-container'>
                            <img src={preconditionsIcon} alt="" />
                            <h3>Randvoorwaarden</h3>
                        </div>
                        <p>{goal.Preconditions}</p>
                    </div>
                    <div className='goal-meta-inner-container'>
                        <div className='goal-meta-title-container'>
                            <img src={externalFactorsIcon} alt="" />
                            <h3>Externe factoren</h3>
                        </div>
                        <p>{goal.ExternalFactors}</p>
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
                        <h3 id='activity-title'>{activity.Activity}</h3>
                        <div className='goal-meta-inner-container'>
                            <div className='goal-meta-title-container'>
                                <img src={impactIcon} alt="" />
                                <h3>Impact</h3>
                            </div>
                            <p>{activity.Impact}</p>
                        </div>
                        <div className='goal-meta-title-container'>
                                <img src={progressIcon} alt="" />
                                <h3>Voortgang</h3>
                            </div>
                            <ProgressionBarActivity activity={activity}/>
                        <div>
                            <Outputs activity={activity}/>
                        </div>
                        {/* <div className='progressionbar-outer-bar'>
                            <ProgressionBarActivity activity={activity}/>
                            <div className='progressionbar-completed' style={{width: `${activity.Progress}%`}}></div>
                        </div> */}
                    </div>
                ))}
                </div>
            </>
        )
    }

    const Outputs = ({activity}) => {
        const outputs = useFirestoreOutputs(activity.ID)

        return(
            <div>
                <div className='activity-meta-title-container'>
                    <img src={outputIcon} alt="" />
                    <h3>Outputs</h3>
                </div>
                {outputs && outputs.map(output => (
                    <div className='impact-dashboard-output-container'>
                        <h3 className='output-title'>{output.Title}</h3>
                        <div className='dashboard-instruments-container'>
                            <div className='activity-meta-title-container'>
                                <img src={effectIcon} alt="" />
                                <h4>Effect</h4>
                            </div>
                            <p className='output-seeting-effect'>{output.Effect}</p>
                        </div>
                        <div className='dashboard-instruments-container'>
                            <Instruments output={output}/>
                        </div>
                        <Milestones output={output}/>
                    </div>
                ))}
                
            </div>
        )
    }

    const Milestones = ({output}) => {

        const milestones = useFirestoreMilestones(output.ID) 

        return(
            <div className='dashboard-instruments-container'>
                <div className='activity-meta-title-container'>
                    <img src={festiveIcon} alt="" />
                    <h4>Mijlpalen</h4>
                </div>
                {milestones && milestones.map(milestone => (
                    <div className='impact-dashboard-output-container' style={{backgroundColor: color}}>
                        <h5>{milestone.Title}</h5>
                        <MilestoneProgress milestone={milestone}/>
                    </div>
                ))}
            </div>
        )
    }

    const Instruments = ({output}) => {
        const instruments = useFirestoreImpactInstruments(output.ID) 

        const datatype = (instrument) => {

            if(instrument.Output.Datatype === 'Manual'){
                return "Handmatig"
            } else if(instrument.Output.Datatype === 'Questionnairy'){
                return 'Vragenlijst'
            } else if(instrument.Output.Datatype === 'Members'){
                return 'Automatisch'
            }
        }
        
        return(
            <div className='output-instrument-inner-container'>
                <div className='activity-meta-title-container'>
                    <img src={measureIcon} alt="" />
                    <h4>Meetinstrumenten</h4>
                </div>
                <div className='output-seeting-effect'>
                    {instruments && instruments.map(instrument => (
                        <div className='dashboard-internal-results-container' style={{backgroundColor: color}}>
                            <p data-id={instrument.ID}>{instrument.Output.Output}</p>
                            <div className='activity-meta-title-container'>
                                <img src={typeIcon} alt="" />
                                <h5>Type</h5>
                            </div>
                            <p className='output-seeting-effect'>{datatype(instrument)}</p>
                            <ResultsInternal instrument={instrument}/>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

   const MilestoneProgress = ({milestone}) => {
       
        const results = useFirestoreResults(milestone.InstrumentID)

        const goal = milestone.Number

        const width = results.length*100/goal

        const percentage = `${width}%`

        const checkSucces = () => {
            db.collection('Milestones')
            .doc(milestone.docid)
            .update({
                Succes: true
            })
        }

        const succes = () => {

            if(results.length >= goal){
                checkSucces()
                return '#00cd00'
            } else {
                return '#63cadc'
            }
        }

    return(
        <div className='milestone-progress-container'>
            <div className='percentage-container'>
                <p>Huidig: {results.length} ({width}%)</p>
                <p>Doel: {goal}</p>
            </div>
            
            <div className='progressbar-outer-bar'>
                <div className='progressbar-progress' style={{width: percentage, backgroundColor: succes()}}></div>
            </div>

        </div>
        
        )
   }

    const ProgressionBarActivity = ({activity}) => {

        const tasks = useFirestoreTasksActivities(activity.ID)
        const tasksCompleted = useFirestoreTasksCompleteActivities(activity.ID)

        const completedArray = []
        const totalArray = []

        tasks && tasks.forEach(task => {
            totalArray.push(task)
        })

        tasksCompleted && tasksCompleted.forEach(task => {
            completedArray.push(task)
        })

        const task = () => {
            if(completedArray.length != 1){
                return 'taken'
            } else {
                return 'taak'
            }
        }

        return(
            <div>
                <p className='output-seeting-effect'>{completedArray.length} {task()} afgerond van de {totalArray.length} taken</p>
            </div>
        )
    }

    const ResultsInternal = ({instrument}) => {

        const matchesArray = []

        if(instrument.Output.Datatype === 'Members'){

            return(
                <>
                    <MemberGraph/>
                </>
            )
        } else if(instrument.Output.Datatype === 'Matches'){

            matchesArray.push({
                Title: 'Matches',
                Amount: 1
            })

            return (
                <div>
                    {matchesArray && matchesArray.map(match => (
                        <div className='internal-results-container'>
                            <div className='activity-meta-title-container'>
                                <img src={resultsIcon} alt="" />
                                <h5>Resultaat</h5>
                            </div>
                            <p>{match.Amount}</p>
                        </div>
                    ))}
                </div>
            )
        } else if(instrument.Output.Datatype === 'Manual'){

            return(
                <div className='internal-results-container'>
                    <div className='activity-meta-title-container'>
                        <img src={resultsIcon} alt="" />
                        <h5>Resultaat</h5>
                    </div>
                    <ManualResultsGraph instrument={instrument}/>
                </div>
            )
        } else if(instrument.Output.Datatype === 'Questionnairy'){

            return(
                <div className='internal-results-container'>
                    <div className='activity-meta-title-container'>
                        <img src={resultsIcon} alt="" />
                        <h5>Resultaat</h5>
                    </div>
                    <QuestionnaireResults instrument={instrument}/>
                </div>
            )
        }
         else {
            return(
                <></>
            )
        }
    }

    const QuestionnaireResults = ({instrument}) => {

        const questionnaires = useFirestoreID('Questionnaires', instrument.Output.ID) 

        return(
            <div>
                {questionnaires && questionnaires.map(questionnaire => (
                    <div className='questionnaire-results-container'>
                        <p>Aantal responses</p>
                        <p>{questionnaire.Responses ? questionnaire.Responses : 0}</p>
                        <p>Bekijk analyse</p>
                    </div>
                ))}
            </div>
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
