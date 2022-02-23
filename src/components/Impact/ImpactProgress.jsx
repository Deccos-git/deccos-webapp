import LeftSideBar from "../LeftSideBar";
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import RightSideBar from "../rightSideBar/RightSideBar"
import MenuStatus from "../../hooks/MenuStatus";
import { useFirestore, useFirestoreActivities, useFirestoreTasksGoals, useFirestoreTasksCompleteGoals, useFirestoreTasks, useFirestoreTasksComplete} from "../../firebase/useFirestore";
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
                <h2>{goal.Goal}</h2>
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
                        <p>{goal.TargetGroup}</p>
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
                        
                        <h3>{activity.Activity}</h3>
                        <div className='progressionbar-outer-bar'>
                        <ProgressionBarActivity activity={activity}/>
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
                        
                    </div>
                ))}
                </div>
            </>
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


                // const taskProgress = tasksProgress(ID)
                // const roundedProgress = Math.floor(taskProgress)

                const activitieObject = {
                    Name: name,
                    // Progress: roundedProgress,
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


    const goalProgress = (activities) => {

        const array = []
        activities && activities.forEach(activity => {

            array.push(activity.Progress)

        })

        const sum = array.reduce((partialSum, a) => partialSum + a, 0)

        const average = sum/array.length 

        return Math.floor(average)

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

    const memberLink = () => {

    }

    const matchesLink = () => {
        
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
