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
import ScrollToTop from "../hooks/ScrollToTop";

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
    ScrollToTop()

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
                        x={130}
                        y={130}
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
                            <div className={profile ? 'complete-step home-step-card' : 'incomplete-step home-step-card'}>
                                <h3>1</h3>
                                <p>Bedrijfsprofiel aanmaken</p>
                            </div>
                        </div>
                   </div>
                   <div>
                        <p><b>Context</b></p>
                        <div className='wizard-introduction-menu-container'>
                            <NavLink to={`/${client}/ProblemAnalysis`}>
                                <div className={problemAnalysisComplete() ? 'complete-step home-step-card' : 'incomplete-step home-step-card'}>
                                    <h3>2</h3>
                                    <p>Probleemanalyse</p>
                                </div>
                            </NavLink>
                            <NavLink to={`/${client}/StakeholderAnalysis`}>
                                <div className={stakeholdersFilled ? 'complete-step home-step-card' : 'incomplete-step home-step-card'}>
                                    <h3>3</h3>
                                    <p>Stakeholders</p>
                                </div>
                            </NavLink>
                            <NavLink to={`/${client}/GoalTitle`}>
                                <div className={goals.length > 0 ? 'complete-step home-step-card' : 'incomplete-step home-step-card'}>
                                    <h3>4</h3>
                                    <p>Impactdoelen</p>
                                </div>
                            </NavLink>
                            <NavLink to={`/${client}/Targetgroup`}>
                                <div className={targetgroupFilled ? 'complete-step home-step-card' : 'incomplete-step home-step-card'}>
                                    <h3>5</h3>
                                    <p>Doelgroep</p>
                                </div>
                            </NavLink>
                        </div>
                    </div>
                    <div>
                        <p><b>Verandertheorie (Theory Of Change)</b></p>
                        <div className='wizard-introduction-menu-container'>
                            <NavLink to={`/${client}/ImpactTargetgroup`}>
                                <div className={impactTargetgroupFilled ? 'complete-step home-step-card' : 'incomplete-step home-step-card'}>
                                    <h3>6</h3>
                                    <p>Impact op doelgroep</p>
                                </div>
                            </NavLink>
                            <NavLink to={`/${client}/ImpactSociety`}>
                                <div className={impactSocietyFilled ? 'complete-step home-step-card' : 'incomplete-step home-step-card'}>
                                    <h3>7</h3>
                                    <p>Impact op maatschappij</p>
                                </div>
                            </NavLink>
                            <NavLink to={`/${client}/SDGs`}>
                                <div className={sdgs.length > 0 ? 'complete-step home-step-card' : 'incomplete-step home-step-card'}>
                                    <h3>8</h3>
                                    <p>Bijdrage aan SDG's</p>
                                </div>
                            </NavLink>
                            <NavLink to={`/${client}/Assumptions`}>
                                <div className={assumptions.length > 0 ? 'complete-step home-step-card' : 'incomplete-step home-step-card'}>
                                    <h3>9</h3>
                                    <p>Aannames</p>
                                </div>
                            </NavLink>
                            <NavLink to={`/${client}/Conditions`}>
                                <div className={conditions.length > 0 ? 'complete-step home-step-card' : 'incomplete-step home-step-card'}>
                                    <h3>10</h3>
                                    <p>Externe factoren</p>
                                </div>
                            </NavLink>
                            <NavLink to={`/${client}/AddActivity`}>
                                <div className={activities.length > 0 ? 'complete-step home-step-card' : 'incomplete-step home-step-card'}>
                                    <h3>11</h3>
                                    <p>Activiteiten</p>
                                </div>
                            </NavLink>
                            <NavLink to={`/${client}/ImpactActivity`}>
                                <div className={activityImpactFilled ? 'complete-step home-step-card' : 'incomplete-step home-step-card'}>
                                    <h3>12</h3>
                                    <p>Impact van activiteiten</p>
                                </div>
                            </NavLink>
                            <NavLink to={`/${client}/AddOutput`}>
                                <div className={outputs.length > 0 ? 'complete-step home-step-card' : 'incomplete-step home-step-card'}>
                                    <h3>13</h3>
                                    <p>Outputs</p>
                                </div>
                            </NavLink>
                            <NavLink to={`/${client}/OutputEffects`}>
                                <div className={outputEffects.length > 0 ? 'complete-step home-step-card' : 'incomplete-step home-step-card'}>
                                    <h3>14</h3>
                                    <p>Effecten van outputs</p>
                                </div>
                            </NavLink>
                        </div>
                    </div>
                    <div>
                        <p><b>SROI</b></p>
                        <div className='wizard-introduction-menu-container'>
                            <NavLink to={`/${client}/AddSROI`}>
                                <div className={sroi.length > 0 ? 'complete-step home-step-card' : 'incomplete-step home-step-card'}>
                                    <h3>15</h3>
                                    <p>SROI</p>
                                </div>
                            </NavLink> 
                        </div>                  
                    </div>
                    <div>
                        <p><b>Meten</b></p>
                        <div className='wizard-introduction-menu-container'>
                            <NavLink to={`/${client}/MeasureOutput`}>
                                <div className={milestones.length > 0 ? 'complete-step home-step-card' : 'incomplete-step home-step-card'}>
                                    <h3>16</h3>
                                    <p>Mijlpalen stellen</p>
                                </div>
                            </NavLink>
                            <NavLink to={`/${client}/Questionnaires`}>
                                <div className={questionnaires.length > 0 ? 'complete-step home-step-card' : 'incomplete-step home-step-card'}>
                                    <h3>17</h3>
                                    <p>Vragenlijsten</p>
                                </div>
                            </NavLink>
                            <NavLink to={`/${client}/Research`}>
                                <div className={research.length > 0 ? 'complete-step home-step-card' : 'incomplete-step home-step-card'}>
                                    <h3>18</h3>
                                    <p>Onderzoek opzetten</p>
                                </div>
                            </NavLink>
                            <NavLink to={`/${client}/ResearchAnalyses`} className={conclusions.length > 0 ? 'complete-step' : 'non-complete-step'}>
                                <div className={conclusions.length > 0 ? 'complete-step home-step-card' : 'incomplete-step home-step-card'}>
                                    <h3>19</h3>
                                    <p>Onderzoeksanalyse</p>
                                </div>
                            </NavLink>
                        </div>
                    </div>
                    <div>
                        <p><b>Communiceren</b></p>
                        <div className='wizard-introduction-menu-container'>
                            <NavLink to={`/${client}/Impactclub`}>
                                <div className={impactBannerFilled ? 'complete-step home-step-card' : 'incomplete-step home-step-card'}>
                                    <h3>20</h3>
                                    <p>Impactclub</p>
                                </div>
                            </NavLink>
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