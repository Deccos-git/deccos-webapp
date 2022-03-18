import { Line } from 'react-chartjs-2'
import { useState, useEffect } from 'react'
import { useFirestoreUsers, useFirestore } from '../firebase/useFirestore'

const MemberGraph = () => {
    const [labelUsers, setLabelUsers] = useState('')
    const [dataUsers, setDataUsers] = useState('')

    const options = { month: 'long'};

    const users = useFirestoreUsers(false)

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

        const usersArray = []

        users && users.forEach(user => {

            const month = user.Timestamp.toDate().toLocaleDateString("nl-NL", options)

            const userObject = {
                Month: month,
                ID: user.ID
            }

            usersArray.push(userObject)
        })

        const array = Object.entries(groupBy(usersArray, 'Month')) 

        const monthArray = []
        const countArray = []

        array && array.forEach(arr => {

            const month = arr[0]
            const count = arr[1].length

            monthArray.push(month)
            countArray.push(count)

        })

        setLabelUsers(monthArray)
        setDataUsers(countArray)

    },[users])


  return (
    <div>
        <h2>Leden</h2>
            <div>
            <Line data={{
                    labels: labelUsers,
                    datasets: [
                        {
                            label: 'Aantal leden',
                            data: dataUsers,
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

export default MemberGraph