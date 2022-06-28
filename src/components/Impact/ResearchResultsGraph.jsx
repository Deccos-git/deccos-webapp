import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
  } from "recharts";
import { useState, useEffect } from 'react'
import { useFirestoreResults} from '../../firebase/useFirestore'
import resultsIcon from '../../images/icons/results-icon.png'

const ResearchResultsGraph = ({results}) => {

    const [data, setData] = useState('')

    const dataset = []

    useEffect(() => {

        const resultArray = []

        results && results.forEach(result => {

            const title = ''
            const score = Math.round(result.AvgScore * 10) / 10

            const resultObject = {
                Title: title,
                Score: score
            }

            resultArray.push(resultObject)
        })

       setData(resultArray)

    },[results])

  return (
    <div className='activity-meta-title-container' style={{display: data.length > 0 ? 'block' : 'none'}}>
        <AreaChart
        width={300}
        height={100}
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0
        }}
          >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Title" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="Score" stroke="#f48183" fill="#f48183" />
      </AreaChart>
  </div>
  )
}

export default ResearchResultsGraph