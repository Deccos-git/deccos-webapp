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

    const activitiesOverview = async (goal) => {

        const activitiesArray = []

        await db.collection("Activities")
        .where('GoalID', '==', goal.ID)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {

                const name = doc.data().Activity
                const progress = doc.data().Progression
                const ID = doc.data().ID

                const activitieObject = {
                    Name: name,
                    Progress: Math.floor(progress),
                    ID: ID
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

            const progressArray = []

            const goalProgress = progressArray.reduce((a, b) => a + b, 0)
            const goalProgressAverage = goalProgress / progressArray.length

            const activities = await activitiesOverview(goal)
            const questionnaires = await questionnaireOverview(goal)

            const goalObject = {
                Goal: goal.Title,
                SDG: goal.SDG,
                Banner: goal.Banner,
                Progress: goalProgress,
                Activities: activities,
                Questionnaires: questionnaires
            }

            goalArray.push(goalObject)
        }

        return goalArray

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

           if(querySnapshot.empty === false){
            setDisplay('block')
           }

            querySnapshot.forEach(doc => {
                const output = doc.data().Output

                console.log(output)


            })
        })


        return (
            <div style={{display: display}}>
                <h4>Indicatoren</h4>
                {indicators && indicators.map(indicator => (
                    <ul>
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
                            <h2>{goal.Goal}</h2>
                            <p>SDG: {goal.SDG}</p>
                            <div className='progressionbar-outer-bar'>
                                <div className='progressionbar-completed' style={{width: `${goal.Progress}%`}}></div>
                            </div>
                            <div className='divider'>
                                <h3>Activiteiten</h3>
                                <div id='activity-outer-container'>
                                {goal.Activities.map(activity => (
                                    <div className='activity-inner-container-dashboard' key={activity.ID}>
                                        <h3>{activity.Name}</h3>
                                        <div className='progressionbar-outer-bar'>
                                            <div className='progressionbar-completed' style={{width: `${activity.Progress}%`}}></div>
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
