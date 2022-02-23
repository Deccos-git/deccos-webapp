import LeftSideBar from "../LeftSideBar";
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import RightSideBar from "../rightSideBar/RightSideBar"
import MenuStatus from "../../hooks/MenuStatus";
import { useFirestore, useFirestoreActivities, useFirestoreUsersApproved } from "../../firebase/useFirestore";
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

    const menuState = MenuStatus()
    const history = useHistory()

    const impact = useFirestore('Impact')
    const goalsDB = useFirestore('Goals')
    const matchesDB = useFirestore('Matches')
    const questionnaireAnalysis = useFirestore('QuestionnaireAnalysis')
    const activities = useFirestoreActivities(goalID)
    const membersDB = useFirestoreUsersApproved(false, true)

    const tasksProgress = async (ID) => {

        const completedArray = []
        const totalArray = []

        await db.collection('Tasks')
        .where('ActivityID', '==', ID)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {

                totalArray.push(doc)

            })  
        })

        await db.collection('Tasks')
        .where('ActivityID', '==', ID)
        .where('Completed', '==', true)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {

                completedArray.push(doc)

            })  
        })

        const onePercentage = totalArray.length !== 0 ? 100/totalArray.length : 100/1
        const completed = completedArray.length !== 0 ? completedArray.length : 1

        const average = onePercentage*completed

        return average
    }

    const activitiesOverview = async (goal) => {

        const activitiesArray = []

        await db.collection("Activities")
        .where('GoalID', '==', goal.ID)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(async doc => {

                const name = doc.data().Activity
                const progress = doc.data().Progression
                const ID = doc.data().ID
                const ingredients = doc.data().Ingredients
                const effectShort = doc.data().EffectShort 
                const effectLong = doc.data().EffectLong


                const taskProgress = tasksProgress(ID)
                const roundedProgress = Math.floor(taskProgress)

                const activitieObject = {
                    Name: name,
                    Progress: roundedProgress,
                    ID: ID,
                    Ingredients: ingredients,
                    EffectShort: effectShort,
                    EffectLong: effectLong
                }

                activitiesArray.push(activitieObject)
            })
        })

        return activitiesArray

    } 

    const questionnaireOverview = async (goal) => {

        const questionnaireArray = []

        await db.collection('Questionnaires')
        .where('GoalID', '==', goal.ID)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {

                const title = doc.data().Title
                const ID = doc.data().ID

                const questionnaireObject = {
                    Title: title,
                    ID: ID
                }

                questionnaireArray.push(questionnaireObject)
            })
        })

        return questionnaireArray
    }

    const goalOverview = async () => {

        const goalArray = []

        for(const goal of goalsDB){

            const activities = await activitiesOverview(goal)
            const questionnaires = await questionnaireOverview(goal)

            const goalObject = {
                Goal: goal.Title,
                SDG: goal.SDG,
                Banner: goal.Banner,
                Targetgroup: goal.TargetGroup,
                ImpactTargetgroup: goal.ImpactTargetgroup,
                ImpactSociety: goal.ImpactSociety,
                Progress: goalProgress(activities),
                Activities: activities,
                Questionnaires: questionnaires
            }

            goalArray.push(goalObject)
        }

        return goalArray

    }

    const goalProgress = (activities) => {

        const array = []
        activities && activities.forEach(activity => {

            array.push(activity.Progress)

        })

        const sum = array.reduce((partialSum, a) => partialSum + a, 0)

        const average = sum/array.length 

        return Math.floor(average)

    }

    useEffect(() => {

        goalOverview().then((goalArray) => {
            setGoals(goalArray)
        })
    }, [goalsDB])

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

    const memberLink = () => {

    }

    const matchesLink = () => {
        
    }

    const Indicatoren = ({activity}) => {
        const [display, setDisplay] = useState('none')
        const [indicators, setIndicators] = useState([])

        const ID = activity.ID 

        db.collection('Outputs')
        .where('ActivityID', '==', ID)
        .get()
        .then(querySnapshot => {

            const outputArray = []

           if(querySnapshot.empty === false){
            setDisplay('block')
           }

            querySnapshot.forEach(doc => {
                const output = doc.data().Output

                outputArray.push(output)

            })

            setIndicators(outputArray)
        })


        return (
            <div style={{display: display}}>
                <h4>Indicatoren</h4>
                {indicators && indicators.map(indicator => (
                    <ul key={indicator.ID}>
                        <li>{indicator}</li>
                    </ul>
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
                {goals && goals.map(goal => (
                        <div>
                            <img id='impact-dasboard-goal-banner' src={goal.Banner} alt="" />
                            <div id='impact-progress-goal-container' className='divider'>
                                <h2>{goal.Goal}</h2>
                                <div className='progressionbar-outer-bar'>
                                    <div className='progressionbar-completed' style={{width: `${goal.Progress}%`}}></div>
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
                            <div>
                                <h2>Activiteiten</h2>
                                <div id='activity-outer-container'>
                                {goal.Activities && goal.Activities.map(activity => (
                                    <div className='activity-inner-container-dashboard' key={activity.ID}>
                                        <h3>{activity.Name}</h3>
                                        <div className='progressionbar-outer-bar'>
                                            <div className='progressionbar-completed' style={{width: `${activity.Progress}%`}}></div>
                                        </div>
                                        <div>
                                            <div>
                                                <h4>Voorwaarden</h4>
                                                <p>{activity.Ingredients}</p>
                                            </div>
                                            <div>
                                                <h4>Korte termijn effect</h4>
                                                <p>{activity.EffectShort}</p>
                                            </div>
                                            <div>
                                                <h4>Lange termijn effect</h4>
                                                <p>{activity.EffectLong}</p>
                                            </div>
                                        </div>
                                        <Indicatoren activity={activity} />
                                    </div>
                                ))}
                                </div>
                            </div>
                        </div>
                    ))}
                    <Members/>
                    <Matches/>
                </div>
            </div>
            <RightSideBar />
        </div>
    )
}

export default ImpactProgress
