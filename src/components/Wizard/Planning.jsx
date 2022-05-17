import LeftSideBar from "../LeftSideBar";
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import MenuStatus from "../../hooks/MenuStatus";
import { useFirestore } from "../../firebase/useFirestore"
import { useState } from "react";
import { Chart } from "react-google-charts";

const Planning = () => {

    const menuState = MenuStatus()
    const researches = useFirestore('Research')

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
        "Research",
        "Find sources",
        null,
        new Date(2015, 0, 1),
        new Date(2015, 0, 5),
        null,
        100,
        null,
      ],
      [
        "Write",
        "Write paper",
        "write",
        null,
        new Date(2015, 0, 9),
        3 * 24 * 60 * 60 * 1000,
        25,
        "Research,Outline",
      ],
      [
        "Cite",
        "Create bibliography",
        "write",
        null,
        new Date(2015, 0, 7),
        1 * 24 * 60 * 60 * 1000,
        20,
        "Research",
      ],
      [
        "Complete",
        "Hand in paper",
        "complete",
        null,
        new Date(2015, 0, 10),
        1 * 24 * 60 * 60 * 1000,
        0,
        "Cite,Write",
      ],
      [
        "Outline",
        "Outline paper",
        "write",
        null,
        new Date(2015, 0, 6),
        1 * 24 * 60 * 60 * 1000,
        100,
        "Research",
      ],
    ];
    const data = [columns, rows];

    const options = {
      gantt: {
        criticalPathEnabled: false,
        innerGridHorizLine: {
          stroke: "#ffe0b2",
          strokeWidth: 2,
        },
        innerGridTrack: { fill: "#fff3e0" },
        innerGridDarkTrack: { fill: "#ffcc80" },
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
            <div>
            <Chart
            chartType="Gantt"
            data={data}
            width="100%"
            height="800px"
            />
            </div>
        </div>  
    </div>
  )
}

export default Planning