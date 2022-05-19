import LeftSideBar from "../LeftSideBar";
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import MenuStatus from "../../hooks/MenuStatus";
import { useFirestore, useFirestoreMeasureMoments } from "../../firebase/useFirestore"
import { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import { client } from '../../hooks/Client';
import { db, timestamp } from "../../firebase/config.js"

const Planning = () => {
    const [periods, setPeriods] = useState([[]])

    const menuState = MenuStatus()
    const researches = useFirestore('Research')

    console.log(periods)

    useEffect(() => {

      const array = []

      researches && researches.forEach( research => {

        let startDate = new Date(2022, 1, 1)
        let endDate = new Date(2022, 31, 12)


        const researches = [
          research.ID,
          research.Title,
          null,
          startDate,
          endDate,
          null,
          null,
          null,
        ]

        array.push(researches)

        const unsub = db.collection("MeasureMoments")
        .where('Compagny', '==', client)
        .where('ResearchID', '==', research.ID)
        .orderBy("Moment", "asc")
        .onSnapshot(querySnapshot => {
          const docArray = []
            querySnapshot.forEach(doc => {
                docArray.push(doc.data().Moment)
            })

            startDate = new Date(docArray[0])
            endDate = new Date(docArray[1])

        })
        
        return () => unsub();
      })

      setPeriods(array)

    },[researches])

    const columns = [
      { type: "string", label: "Task ID" },
      { type: "string", label: "Task Name" },
      { type: "string", label: "Resource" },
      { type: "date", label: "Start Date" },
      { type: "date", label: "End Date" },
      { type: "number", label: "Duration" },
      { type: "number", label: "Percent Complete" },
      { type: "string", label: "Dependencies" },
    ];
    
    const rows = [
      [
        "2014Spring",
        "Spring 2014",
        null,
        new Date(2014, 2, 22),
        new Date(2014, 5, 20),
        null,
        null,
        null,
      ],
      [
        "2014Summer",
        "Summer 2014",
        null,
        new Date(2014, 5, 21),
        new Date(2014, 8, 20),
        null,
        null,
        null,
      ],
      [
        "2014Autumn",
        "Autumn 2014",
        null,
        new Date(2014, 8, 21),
        new Date(2014, 11, 20),
        null,
        null,
        null,
      ],
    ];

    
  const data = [columns, ...periods];

  const options = {
    height: 200,
    gantt: {
      trackHeight: 30,
    },
  };
   
  return (
    <div className="main">
        <LeftSideBar />
        <LeftSideBarFullScreen/>
        <div className="main-container" style={{display: menuState}}>
            <div className='page-header'>
                <h1>Planning</h1>
            </div>
            <div style={{width: '85%'}}>
            <Chart
              chartType="Gantt"
              width="100%"
              height="auto"
              data={data}
              options={options}
            />
            </div>
        </div>  
    </div>
  )
}

export default Planning