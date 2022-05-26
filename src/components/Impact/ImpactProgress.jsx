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
    useFirestoreOutputs,
    useFirestoreMilestones,
    useFirestoreQuestionnaireFields,
    useFirestoreQuestionnairesResponses,
    useFirestoreResults,
    useFirestoreSROIs,
    useFirestoreSDGsSelected,
    useFirestoreOutputEffects,
    useFirestoreResearch,
    useFirestoreMeasureMoments,
    useFirestoreAssumptions,
    useFirestoreConditions
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
import researchIcon from '../../images/icons/research-icon.png'

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
                    <SDGS goal={goal}/>
                    <div className='goal-meta-inner-container' style={{display: goal.Targetgroup ? 'block' : 'none'}}>
                        <div className='goal-meta-title-container'>
                            <img src={groupIcon} alt="" />
                            <h3>Doelgroep</h3>
                        </div>
                        <p>{goal.Targetgroup}</p>
                    </div>
                    <div className='goal-meta-inner-container' style={{display: goal.ImpactTargetgroup ? 'block' : 'none'}}>
                        <div className='goal-meta-title-container'>
                            <img src={newUserIcon} alt="" />
                            <h3>Impact op doelgroep</h3>
                        </div>
                        <p>{goal.ImpactTargetgroup}</p>
                    </div>
                    <div className='goal-meta-inner-container' style={{display: goal.ImpactSociety ? 'block' : 'none'}}>
                        <div className='goal-meta-title-container'>
                            <img src={leafIcon} alt="" />
                            <h3>Impact maatschappij</h3>
                        </div>
                        <p>{goal.ImpactSociety}</p>
                    </div>
                    <Assumptions goal={goal}/>
                    <ExternalFactors goal={goal}/>
                </div>
            </div>
            <Activities goal={goal}/>
            </div>
            ))}
        </>
        )
    }

    const Assumptions = ({goal}) => {

        const assumptions = useFirestoreAssumptions(goal.ID)

        return(
            <div className='goal-meta-inner-container' style={{display: assumptions.length > 0 ? 'block' : 'none'}}>
                <div className='goal-meta-title-container'>
                    <img src={preconditionsIcon} alt="" />
                    <h3>Randvoorwaarden</h3>
                </div>
                <ul>
                    {assumptions && assumptions.map(assumption => (
                        <li>{assumption.Assumption}</li>
                    ))}
                </ul>
            </div>
        )

    }

    const ExternalFactors = ({goal}) => {

        const externalFactors = useFirestoreConditions(goal.ID)

        return(
            <div className='goal-meta-inner-container' style={{display: externalFactors.length > 0 ? 'block' : 'none'}}>
                <div className='goal-meta-title-container'>
                    <img src={externalFactorsIcon} alt="" />
                    <h3>Externe factoren</h3>
                </div>
                <ul>
                    {externalFactors && externalFactors.map(factor => (
                        <li>{factor.Condition}</li>
                    ))}
                </ul>
            </div>
        )

    }

    const SDGS = ({goal}) => {
        const SDGs = useFirestoreSDGsSelected(goal.ID)

        return(
            <div className='goal-meta-inner-container' style={{display: SDGs.length > 0 ? 'block' : 'none'}}>
                <div className='goal-meta-title-container'>
                    <img src={worldIcon} alt="" />
                    <h3>SDGs</h3>
                </div>
                <ul>
                    {SDGs && SDGs.map(sdg => (
                    <li>{sdg.SDG}</li>
                    ))}
                </ul>
            </div>
        )
    }

    const Activities = ({goal}) => {

        const activities = useFirestoreActivities(goal.ID)

        return(
            <div style={{display: activities.length > 0 ? 'block' : 'none'}}>
                <h2>Activiteiten</h2>
                <div id='activity-outer-container'>
                {activities && activities.map(activity => (
                    <div className='activity-inner-container-dashboard' key={activity.ID} style={{backgroundColor: color}}>
                        <img id='impact-dasboard-activity-banner' src={activity.Banner} alt="" />
                        <h3 id='activity-title'>{activity.Activity}</h3>
                        <div className='goal-meta-inner-container' style={{display: activity.Impact ? 'block' : 'none'}}>
                            <div className='goal-meta-title-container'>
                                <img src={impactIcon} alt="" />
                                <h3>Impact</h3>
                            </div>
                            <p>{activity.Impact}</p>
                            <Outputs activity={activity}/>
                        </div>
                    </div>
                ))}
                </div>
            </div>
        )
    }

    const Outputs = ({activity}) => {
        const outputs = useFirestoreOutputs(activity.ID)

        return(
            <div style={{display: outputs.length > 0 ? 'block' : 'none'}}>
                <div className='activity-meta-title-container'>
                    <img src={outputIcon} alt="" />
                    <h3>Outputs</h3>
                </div>
                {outputs && outputs.map(output => (
                    <div className='impact-dashboard-output-container'>
                        <h3 className='output-title'>{output.Title}</h3>
                        <Effects output={output}/>
                        <div className='dashboard-instruments-container'>
                            <ManualResults output={output}/>
                        </div>
                        <Research output={output}/>
                        <Milestones output={output}/>
                    </div>
                ))} 
            </div>
        )
    }

    const Effects = ({output}) => {

        const effects = useFirestoreOutputEffects(output.ID)

        return(
            <div className='dashboard-instruments-container' style={{display: effects.length > 0 ? 'block' : 'none'}}>
                <div className='activity-meta-title-container'>
                    <img src={effectIcon} alt="" />
                    <h3>Effect</h3>
                </div>
                <ul>
                {effects && effects.map(effect => (
                    <li>{effect.Effect}</li>
                ))}
                </ul>
            </div>
        )
    }

    const Research = ({output}) => {

        const researches = useFirestoreResearch(output.ID) 

        return(
            <div className='dashboard-instruments-container' style={{display: researches.length > 0 ? 'block' : 'none'}}>
                 <div className='activity-meta-title-container'>
                    <img src={researchIcon} alt="" />
                    <h3>Onderzoeken</h3>
                </div>
                {researches && researches.map(research => (
                    <div className='impact-dashboard-output-container' style={{backgroundColor: color}}>
                        <h4>{research.Title}</h4>
                        <MeasureMoments research={research}/>
                    </div>
                ))}
            </div>
        )
    }

    const MeasureMoments = ({research}) => {

        const moments = useFirestoreMeasureMoments(research.ID)

        return(
            <div className='activity-meta-title-container' style={{display: moments.length > 0 ? 'block' : 'none'}}>
                <img src={resultsIcon} alt="" />
                <h5>Meetmomenten</h5>
                <div>
                    {moments && moments.map(moment => (
                        <div>
                            <p><b>{moment.Title}</b> op {moment.Moment}</p>
                        </div>
                        
                    ))}
                </div>
            </div>
        )

    }

    const Milestones = ({output}) => {

        const milestones = useFirestoreMilestones(output.ID) 

        return(
            <div className='dashboard-instruments-container' style={{display: milestones.length > 0 ? 'block' : 'none'}}>
                <div className='activity-meta-title-container'>
                    <img src={growIcon} alt="" />
                    <h3>Mijlpalen</h3>
                </div>
                {milestones && milestones.map(milestone => (
                    <div className='impact-dashboard-output-container' style={{backgroundColor: color}}>
                        <h4>{milestone.Title}</h4>
                        <MilestoneProgress milestone={milestone}/>
                    </div>
                ))}
            </div>
        )
    }

    const ManualResults =({output}) => {

        const SROIs = useFirestoreSROIs(output.ID)

        return (
            <Results output={output} SROIs={SROIs}/>
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


    const Results = ({output, SROIs}) => {
        const [totalSROI, setTotalSROI] = useState(0)

        const dataset = useFirestoreResults(output.ID)

        useEffect(() => {
            SROIs && SROIs.forEach(sroi => {
                setTotalSROI(sroi.Value)
            })
        })

        return(
            <>
            <div className='internal-results-container'>
                <ManualResultsGraph output={output}/>
            </div>
            <div className='internal-results-container' style={{display: SROIs.length > 0 ? 'block' : 'none'}}>
                <div className='activity-meta-title-container'>
                    <img src={sroiIcon} alt="" />
                    <h3>SROI</h3>
                </div>
                <p className='output-seeting-effect'>{dataset.length} x €{totalSROI} = €{dataset.length*totalSROI}</p>
            </div>
            </>
        )
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
