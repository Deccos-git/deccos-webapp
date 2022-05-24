import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
  } from "recharts";
import { useState, useEffect } from 'react'
import { useFirestoreResults} from '../../firebase/useFirestore'

const ManualResultsGraph = ({output}) => {

    const [data, setData] = useState('')

    const options = { month: 'numeric', day: 'numeric', year: 'numeric'};

    const dataset = useFirestoreResults(output.ID)

    useEffect(() => {

        const dataArray = []

        dataset && dataset.forEach(data => {

            const month = data.Timestamp.toDate().toLocaleDateString("nl-NL", options)

            const dataObject = {
                Maand: month,
                Resultaat: dataset.indexOf(data) + 1
            }

            dataArray.push(dataObject)
        })

       setData(dataArray)

    },[dataset])

  return (
    <AreaChart
    width={500}
    height={200}
    data={data}
    margin={{
      top: 10,
      right: 30,
      left: 0,
      bottom: 0
    }}
      >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="Maand" />
    <YAxis />
    <Tooltip />
    <Area type="monotone" dataKey="Resultaat" stroke="#f48183" fill="#f48183" />
  </AreaChart>
  )
}

export default ManualResultsGraph