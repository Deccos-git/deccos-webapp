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
    useFirestoreResults,
    useFirestoreSROIs,
    useFirestoreSDGsSelected,
    useFirestoreOutputEffects
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
import growIcon from '../../images/icons/grow-icon.png'
import MemberGraph from "../MemberGraph";
import ManualResultsGraph from "../Impact/ManualResultsGraph";
import uuid from "react-uuid";
import sroiIcon from '../../images/icons/sroi-icon.png'

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
                <div id='goal-meta-container'>
                    <div className='goal-meta-inner-container'>
                        <div className='goal-meta-title-container'>
                            <img src={worldIcon} alt="" />
                            <h3>SDGs</h3>
                        </div>
                        <SDGS goal={goal}/>
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

    const SDGS = ({goal}) => {
        const SDGs = useFirestoreSDGsSelected(goal.ID)

        return(
            <ul>
                {SDGs && SDGs.map(sdg => (
                   <li>{sdg.SDG}</li>
                ))}
            </ul>
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
                            <Effects output={output}/>
                        </div>
                        <div className='dashboard-instruments-container'>
                            <div className='activity-meta-title-container'>
                                <img src={sroiIcon} alt="" />
                                <h4>SROI</h4>
                            </div>
                            <p className='output-seeting-effect'><SROI output={output}/></p>
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

    const Effects = ({output}) => {

        const effects = useFirestoreOutputEffects(output.ID)

        return(
            <ul>
            {effects && effects.map(effect => (
                <li>{effect.Effect}</li>
            ))}
            </ul>
        )
    }

    const SROI = ({output}) => {

        const SROIs = useFirestoreSROIs(output.ID)

        return(
            <>
                {SROIs && SROIs.map(SROI => (
                    <div>
                        <p><b>{SROI.Title}</b></p>
                        <p>€{SROI.Value} per {SROI.Output.toLowerCase()}</p>
                    </div>
                ))}
            </>  
        )
    }

    const Milestones = ({output}) => {

        const milestones = useFirestoreMilestones(output.ID) 

        return(
            <div className='dashboard-instruments-container'>
                <div className='activity-meta-title-container'>
                    <img src={growIcon} alt="" />
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

        const SROI = output.SROI

        const datatype = (instrument) => {

            if(instrument.Type === 'Manual'){
                return "Handmatig"
            } else if(instrument.Type === 'Questionnairy'){
                return 'Vragenlijst'
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
                            <p data-id={instrument.ID}>{instrument.Title}</p>
                            <div className='activity-meta-title-container'>
                                <img src={typeIcon} alt="" />
                                <h5>Type</h5>
                            </div>
                            <p className='output-seeting-effect'>{datatype(instrument)}</p>
                            <Results instrument={instrument} SROI={SROI}/>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

   const MilestoneProgress = ({milestone}) => {
       
        const results = useFirestoreResults(milestone.OutputID)

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

    const Results = ({instrument, SROI}) => {

        const dataset = useFirestoreResults(instrument.ID)
        const totalSROI = dataset.length*SROI

      if(instrument.Type === 'Manual'){

            return(
                <>
                <div className='internal-results-container'>
                    <div className='activity-meta-title-container'>
                        <img src={resultsIcon} alt="" />
                        <h5>Resultaat</h5>
                    </div>
                    <ManualResultsGraph instrument={instrument}/>
                </div>
                <div className='internal-results-container'>
                    <div className='activity-meta-title-container'>
                        <img src={resultsIcon} alt="" />
                        <h5>Totale SROI</h5>
                    </div>
                    <p className='output-seeting-effect'>{dataset.length} x €{SROI} = €{totalSROI}</p>
                </div>
                </>
            )
        } else if(instrument.Type === 'Questionnairy'){

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
        </div>
    )
}

export default ImpactProgress
