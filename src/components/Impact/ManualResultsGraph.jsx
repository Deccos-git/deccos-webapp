import { Line } from 'react-chartjs-2'
import { useState, useEffect } from 'react'
import { useFirestoreResults} from '../../firebase/useFirestore'

const ManualResultsGraph = ({instrument}) => {

    const [label, setLabel] = useState('')
    const [data, setData] = useState('')

    const options = { month: 'long'};

    const dataset = useFirestoreResults(instrument.ID)

    const groupBy = (array, property) => {
        return array.reduce((acc, obj) => {
          let key = obj[property]
          if (!acc[key]) {
            acc[key] = []
          }
          acc[key].push(obj)
          return acc
        }, {})
      }

    useEffect(() => {

        const dataArray = []

        dataset && dataset.forEach(data => {

            const month = data.Timestamp.toDate().toLocaleDateString("nl-NL", options)

            const dataObject = {
                Month: month,
                ID: data.ID
            }

            dataArray.push(dataObject)
        })

        const array = Object.entries(groupBy(dataArray, 'Month')) 

        const monthArray = []
        const countArray = []

        array && array.forEach(arr => {

            const month = arr[0]
            const count = arr[1].length

            monthArray.push(month)
            countArray.push(count)

        })

        setLabel(monthArray)
        setData(countArray)

    },[dataset])

  return (
     <div>
        <div>
            <Line data={{
                    labels: label,
                    datasets: [
                        {
                            label: 'Aantal',
                            data: data,
                            fill: false,
                            backgroundColor: 'green',
                            borderColor: 'green',
                        },
                    ],
                    options: {
                        scales: {
                            yAxis: [
                            {
                                ticks: {
                                beginAtZero: true,
                                stepSize: 100
                                },
                            },
                            ],
                        },
                    } 
                }}
            /> 
        </div>
    </div>
  )
}

export default ManualResultsGraph