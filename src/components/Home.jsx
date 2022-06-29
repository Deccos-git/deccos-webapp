import LeftSideBar from "./LeftSideBar"
import LeftSideBarFullScreen from "./LeftSideBarFullScreen"
import Location from "../hooks/Location"
import MenuStatus from "../hooks/MenuStatus";
import { useFirestore } from "../firebase/useFirestore";
import { PieChart, Pie, Cell} from 'recharts';
import completeIcon from '../images/icons/complete-icon.png'
import { client } from '../hooks/Client';
import { NavLink, Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Home = () => {
    const [centralProblemFilled, setCentralProblemFilled] = useState(false)
    const [indirectCauseFilled, setIndirectCauseFilled] = useState(false)
    const [directCauseFilled, setDirectCauseFilled] = useState(false)
    const [indirectConsequencesFilled, setIndirectConsequencesFilled] = useState(false)
    const [directConsequencesFilled, setDirectConsequencesFilled] = useState(false)
    const [stakeholdersFilled, setStakeholdersFilled] = useState(false)
    const [targetgroupFilled, setTargetgroupFilled] = useState(false)
    const [impactTargetgroupFilled, setImpactTargetgroupFilled] = useState(false)
    const [impactSocietyFilled, setImpactSocietyFilled] = useState(false)
    const [preconditionsFilled, setPreconditionsFilled] = useState(false)
    const [externalFactorsFilled, setExternalFactorsFilled] = useState(false)
    const [activityImpactFilled, setActivityImpactFilled] = useState(false)
    const [impactBannerFilled, setImpactBannerFilled] = useState(false)

    const menuState = MenuStatus()

    const profile = useFirestore('CompagnyMeta')
    const indirectCauses = useFirestore('IndirectCauses')
    const directCauses = useFirestore('DirectCauses')
    const centralProblem = useFirestore('CentralProblem')
    const directConsequences = useFirestore('DirectConsequences')
    const indirectConsequences = useFirestore('IndirectConsequences')
    const stakeholders = useFirestore('Stakeholders')
    const goals = useFirestore('Goals')
    const assumptions = useFirestore('Assumptions')
    const conditions = useFirestore('Conditions')
    const sdgs = useFirestore('SDGsSelected')
    const activities = useFirestore('Activities')
    const outputs = useFirestore('Outputs')
    const outputEffects = useFirestore('OutputEffects')
    const sroi = useFirestore('SROIs')
    const milestones = useFirestore('Milestones')
    const questionnaires = useFirestore('Questionnaires')
    const research = useFirestore('Research')
    const conclusions = useFirestore('Conclusions')

    console.log(sroi)

    const currentProgressArray = []

    const addToProgress = (step, title) => {
        if(step.length > 0){
            currentProgressArray.push([`${title}`])
        } else{
            return
        }
    }

    useEffect(() => {

        centralProblem && centralProblem.forEach(problem => {
            if(problem.CentralProblem != ''){
                setCentralProblemFilled(true)
            } else{
                return
            }
        })

    },[centralProblem])

    useEffect(() => {

        directCauses && directCauses.forEach(cause => {
            if(cause.DirectCause != ''){
                setDirectCauseFilled(true)
            } else{
                return
            }
        })

    },[directCauses])

    useEffect(() => {

        indirectCauses && indirectCauses.forEach(cause => {
            if(cause.IndirectCause != ''){
                setIndirectCauseFilled(true)
            } else{
                return
            }
        })

    },[indirectCauses])

    useEffect(() => {

        directConsequences && directConsequences.forEach(consequence => {
            if(consequence.DirectConsequence != ''){
                setDirectConsequencesFilled(true)
            } else{
                return
            }
        })

    },[directConsequences])

    useEffect(() => {

        indirectConsequences && indirectConsequences.forEach(consequence => {
            if(consequence.IndirectConsequence != ''){
                setIndirectConsequencesFilled(true)
            } else{
                return
            }
        })

    },[indirectConsequences])

    useEffect(() => {

        stakeholders && stakeholders.forEach(stakeholder => {
            if(stakeholder.Categorie){
                setStakeholdersFilled(true)
            } else{
                return
            }
        })

    },[stakeholders])

    useEffect(() => {

        goals && goals.forEach(goal => {
            goal.Targetgroup ? setTargetgroupFilled(['Targetgroup']) : setTargetgroupFilled(false)
            goal.ImpactTargetgroup ? setImpactTargetgroupFilled(['ImpactTargetgroup']) : setImpactTargetgroupFilled(false)
            goal.ImpactSociety ? setImpactSocietyFilled(['ImpactSociety']) : setImpactSocietyFilled(false)
        })

    },[goals])

    useEffect(() => {

        activities && activities.forEach(activity => {
            if(activity.Impact){
                setActivityImpactFilled(['ActivityImpact'])
            } else{
                return
            }
        })

    },[activities])

    useEffect(() => {

        profile && profile.forEach(p => {
            if(p.ImpactBanner){
                setImpactBannerFilled(['ImpactBanner'])
            } else{
                return
            }
        })

    },[activities])


    const problemAnalysisComplete = () => {

        if(directCauseFilled && indirectCauseFilled && centralProblemFilled && directConsequencesFilled && indirectConsequencesFilled){
            return true
        } else{
            return false
        }
    }

    addToProgress(profile, 'profile')
    addToProgress(indirectCauses, 'indirectCauses')
    addToProgress(directCauses, 'directCauses')
    addToProgress(centralProblem, 'centralProblem')
    addToProgress(directConsequences, 'directConsequences')
    addToProgress(indirectConsequences, 'indirectConsequences')
    addToProgress(stakeholders, 'stakeholders')
    addToProgress(goals, 'goals')
    addToProgress(conditions, 'conditions')
    addToProgress(assumptions, 'assumptions')
    addToProgress(targetgroupFilled, 'targetgroup')
    addToProgress(impactTargetgroupFilled, 'impactTargetgroup')
    addToProgress(impactSocietyFilled, 'impactSociety')
    addToProgress(preconditionsFilled, 'precoditions')
    addToProgress(externalFactorsFilled, 'externalFactors')
    addToProgress(sdgs, 'sdgs')
    addToProgress(activities, 'activities')
    addToProgress(activityImpactFilled, 'activityImpact')
    addToProgress(outputs, 'outputs')
    addToProgress(outputEffects, 'outputEffects')
    addToProgress(sroi, 'sroi')
    addToProgress(milestones, 'milestones')
    addToProgress(questionnaires, 'questionnaires')
    addToProgress(research, 'research')
    addToProgress(conclusions, 'conclusions')
    addToProgress(impactBannerFilled, 'impactBanner')

    console.log(currentProgressArray)

    const currentProgress = currentProgressArray.length
    const totalProgress = 24 - currentProgress 

    console.log(totalProgress)

    const data = [
        { id: "1", name: "L1", value: totalProgress },
        { id: "2", name: "L2", value: currentProgress }
        ];
    
    const progress = `${Math.round(currentProgress * 100 / 24 ) }%`

  return (
    <div className="main">
    <LeftSideBar />
    <LeftSideBarFullScreen/>
    <div className="main-container" style={{display: menuState}}>
        <div className='page-header'>
            <h1>Home</h1>
        </div>
        <div className='profile-home'>
           <div id='progress-container' className='home-container'>
                <h2>Voortgang</h2>
                <div id='home-progress-bar-container'>
                    <PieChart width={250} height={250}>
                        <text
                        x={25}
                        y={25}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        >
                        {progress}
                        </text>
                        <Pie
                        data={data}
                        dataKey="value"
                        innerRadius="80%"
                        outerRadius="100%"
                        fill="green"
                        startAngle={90}
                        endAngle={-270}
                        paddingAngle={0}
                        cornerRadius={5}
                        >
                        <Cell
                        key="test"
                        fill="#CCC"
                        />
                        </Pie>
                    </PieChart>
                </div>
           </div>
           <div id='overview-steps-container' className='home-container'>
               <div className='overview-step-detail-container'>
                   <h2>Stappen</h2>
                   <div>
                        <p><b>Eerste stap</b></p>
                        <div className='wizard-introduction-menu-container'>
                            <p className={profile ? 'complete-step' : 'non-complete-step'}>1. Bedrijfsprofiel aanmaken</p>
                        </div>
                   </div>
                   <div>
                        <p><b>Context</b></p>
                        <div className='wizard-introduction-menu-container'>
                            <NavLink to={`/${client}/ProblemAnalysis`} className={problemAnalysisComplete() ? 'complete-step' : 'non-complete-step'}>2. Probleemanalyse</NavLink>
                            <NavLink to={`/${client}/ProblemAnalysis`} className={indirectCauseFilled ? 'complete-step home-steps-sub-step' : 'non-complete-step home-steps-sub-step'}>2a. Achterliggende oorzaken</NavLink>
                            <NavLink to={`/${client}/ProblemAnalysis`} className={directCauseFilled ? 'complete-step home-steps-sub-step' : 'non-complete-step home-steps-sub-step'}>2b. Directe oorzaken</NavLink>
                            <NavLink to={`/${client}/ProblemAnalysis`} className={centralProblemFilled ? 'complete-step home-steps-sub-step' : 'non-complete-step home-steps-sub-step'}>2c. Centraal probleem</NavLink>
                            <NavLink to={`/${client}/ProblemAnalysis`} className={directConsequencesFilled ? 'complete-step home-steps-sub-step' : 'non-complete-step home-steps-sub-step'}>2d. Directe gevolgen</NavLink>
                            <NavLink to={`/${client}/ProblemAnalysis`} className={indirectConsequencesFilled ? 'complete-step home-steps-sub-step' : 'non-complete-step home-steps-sub-step'}>2e. Verdere gevolgen</NavLink>
                            <NavLink to={`/${client}/StakeholderAnalysis`} className={stakeholdersFilled ? 'complete-step' : 'non-complete-step'}>3. Stakeholders</NavLink>
                            <NavLink to={`/${client}/GoalTitle`} className={goals.length > 0 ? 'complete-step' : 'non-complete-step'}>4. Impactdoelen</NavLink>
                            <NavLink to={`/${client}/Targetgroup`} className={targetgroupFilled ? 'complete-step' : 'non-complete-step'}>5. Doelgroep bepalen </NavLink>
                        </div>
                    </div>
                    <div>
                        <p><b>Verandertheorie (Theory Of Change)</b></p>
                        <div className='wizard-introduction-menu-container'>
                            <NavLink to={`/${client}/ImpactTargetgroup`} className={impactTargetgroupFilled ? 'complete-step' : 'non-complete-step'}>6. Impact op doelgroep</NavLink>
                            <NavLink to={`/${client}/ImpactSociety`} className={impactSocietyFilled ? 'complete-step' : 'non-complete-step'}>7. Impact op maatschappij</NavLink>
                            <NavLink to={`/${client}/SDGs`} className={sdgs.length > 0 ? 'complete-step' : 'non-complete-step'}>8. Bijdrage aan SDG's</NavLink>
                            <NavLink to={`/${client}/Assumptions`} className={assumptions.length > 0 ? 'complete-step' : 'non-complete-step'}>9. Aannames</NavLink>
                            <NavLink to={`/${client}/Conditions`} className={conditions.length > 0 ? 'complete-step' : 'non-complete-step'}>10. Externe factoren</NavLink>
                            <NavLink to={`/${client}/AddActivity`} className={activities.length > 0 ? 'complete-step' : 'non-complete-step'}>11. Activiteiten</NavLink>
                            <NavLink to={`/${client}/ImpactActivity`} className={activityImpactFilled ? 'complete-step' : 'non-complete-step'}>12. Impact van activiteit</NavLink>
                            <NavLink to={`/${client}/AddOutput`} className={outputs.length > 0 ? 'complete-step' : 'non-complete-step'}>13. Outputs</NavLink>
                            <NavLink to={`/${client}/OutputEffects`} className={outputEffects.length > 0 ? 'complete-step' : 'non-complete-step'}>14. Effecten van output</NavLink>
                        </div>
                    </div>
                    <div>
                        <p><b>SROI</b></p>
                        <div className='wizard-introduction-menu-container'>
                            <NavLink to={`/${client}/AddSROI`} className={sroi.length > 0 ? 'complete-step' : 'non-complete-step'} >15. SROI</NavLink> 
                        </div>                  
                    </div>
                    <div>
                        <p><b>Meten</b></p>
                        <div className='wizard-introduction-menu-container'>
                            <NavLink to={`/${client}/MeasureOutput`} className={milestones.length > 0 ? 'complete-step' : 'non-complete-step'} >16. Mijlpalen stellen</NavLink>
                            <NavLink to={`/${client}/Questionnaires`} className={questionnaires.length > 0 ? 'complete-step' : 'non-complete-step'}>17. Vragenlijsten</NavLink>
                            <NavLink to={`/${client}/Research`} className={research.length > 0 ? 'complete-step' : 'non-complete-step'}>18. Onderzoek opzetten</NavLink>
                            <NavLink to={`/${client}/ResearchAnalyses`} className={conclusions.length > 0 ? 'complete-step' : 'non-complete-step'}>19. Onderzoeksanalyse</NavLink>
                        </div>
                    </div>
                    <div>
                        <p><b>Communiceren</b></p>
                        <div className='wizard-introduction-menu-container'>
                            <NavLink to={`/${client}/Impactclub`} className={impactBannerFilled ? 'complete-step' : 'non-complete-step'}>20. Impactclub</NavLink>
                        </div>
                    </div>
               </div>
           </div>
        </div>
    </div>
</div>
  )
}

export default Home