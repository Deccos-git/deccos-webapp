import LeftSideBar from "./LeftSideBar"
import LeftSideBarFullScreen from "./LeftSideBarFullScreen"
import RightSideBar from "./rightSideBar/RightSideBar"
import MenuStatus from "../hooks/MenuStatus";
import { Line } from 'react-chartjs-2'
import { useFirestoreTimestamp, useFirestore } from "../firebase/useFirestore";
import { db } from "../firebase/config";
import { useState, useEffect } from "react";

const Results = () => {
    const [goalData, setGoalData] = useState("")
    const [total, setTotal] = useState("")
    const [sdg, setSdg] = useState("")

    const menuState = MenuStatus()

    const goals  = useFirestoreTimestamp("Goals")
    const compagny  = useFirestore("CompagnyMeta")
    
    useEffect(() => {

        const goalArray = []

        goals && goals.forEach( async goal => {
            await db.collection("ContributionGraph")
            .where("GoalID", "==", goal.ID )
            .orderBy("LastActive", "desc")
            .get()
            .then(querySnapshot => {
              
                querySnapshot.forEach(doc => {
                    goalArray.push(doc.data())
                })
            })
            setGoalData(goalArray)
        })
    }, [goals])

    console.log(goalData)

    useEffect(() => {

        const totalArray = []
            db.collection("ContributionGraph")
            .orderBy("LastActive", "desc")
            .get()
            .then(querySnapshot => {
              
                querySnapshot.forEach(doc => {
                    const contributions = doc.data().Contributions
                    const month = doc.data().Month

                    totalArray.push({sum: contributions,
                                    month: month})
                })

               console.log(totalArray)

                setTotal(totalArray)
            })
    }, [goals])

    console.log(total)

    useEffect(() => {

        const sdgArray = []
        
        goals && goals.forEach( async goal => {
            db.collection("ContributionGraph")
            .where("SDG", "==", goal.SDG)
            .orderBy("LastActive", "desc")
            .get()
            .then(querySnapshot => {
              
                querySnapshot.forEach(doc => {
                    sdgArray.push(doc.data())
                })

                setSdg(sdgArray)
            })
        })
    }, [goals])

    console.log(sdg)

    return (
        <div className="main">
            <LeftSideBar />
            <LeftSideBarFullScreen/>
            <div className="main-container" style={{display: menuState}}>
            <div className="page-header">
                    <h1>Resultaten</h1>
                </div>
                <div className="profile profile-results">
                    <div className="divider">
                        <h2>Doelen</h2>
                        {goalData && goalData.map(goal => (
                            <div key={goal.ID}>
                                <h3>{goal.GoalTitle}</h3>
                                <p>{goal.SDG}</p>
                                <div>
                                    <Line data={{
                                         labels: [goal.Month],
                                         datasets: [
                                           {
                                             label: 'Aantal bijdragen',
                                             data: [goal.Contributions],
                                             fill: false,
                                             backgroundColor: 'green',
                                             borderColor: 'green',
                                           },
                                         ],
                                    }} 
                                    options={{
                                        scales: {
                                          yAxes: [
                                            {
                                              ticks: {
                                                beginAtZero: true,
                                              },
                                            },
                                          ],
                                        },
                                      }} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="divider">
                        <h2>Totale bijdragen</h2>

                    </div>
                    <div className="divider">
                        <h2>SDG bijdragen</h2>
                        {sdg && sdg.map(sd => (
                            <div key={sd.ID}>
                                <h3>{sd.SDG}</h3>
                                <div>
                                    <Line data={{
                                         labels: [sd.Month],
                                         datasets: [
                                           {
                                             label: 'Aantal bijdragen',
                                             data: [sd.Contributions],
                                             fill: false,
                                             backgroundColor: 'green',
                                             borderColor: 'green',
                                           },
                                         ],
                                    }} 
                                    options={{
                                        scales: {
                                          yAxes: [
                                            {
                                              ticks: {
                                                beginAtZero: true,
                                              },
                                            },
                                          ],
                                        },
                                      }} />
                                </div>
                            </div>
                        ))}           
                    </div>
                </div>  
            </div>
            <RightSideBar />
        </div>
    )
}

export default Results
