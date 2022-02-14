import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "./LeftSideBarAuthProfileFullScreen";
import RightSideBar from "./rightSideBar/RightSideBar"
import MenuStatus from "../hooks/MenuStatus";
import { Line } from 'react-chartjs-2'
import { useFirestoreUsers, useFirestore } from '../firebase/useFirestore'
import { useState, useEffect } from 'react'

const Analytics = () => {
    
    // State
    const [labelUsers, setLabelUsers] = useState('')
    const [dataUsers, setDataUsers] = useState('')
    const [labelLikes, setLabelLikes] = useState('')
    const [dataLikes, setDataLikes] = useState('')
    const [labelGoalLikes, setLabelGoalLikes] = useState('')
    const [dataGoalLikes, setDataGoalLikes] = useState('')
    const [labelMessages, setLabelMessages] = useState('')
    const [dataMessages, setDataMessages] = useState('')

    // Settings
    const menuState = MenuStatus()
    const options = { month: 'long'};

    // Database query's
    const users = useFirestoreUsers(false)
    const messages = useFirestore('Messages')
    const likes = useFirestore('Likes')

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

    // Leden
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

    // Messages
    useEffect(() => {

        const messagesArray = []

        console.log(messages)

        messages && messages.forEach(message => {

            const month = message.Timestamp.toDate().toLocaleDateString("nl-NL", options)

            const messageObject = {
                Month: month,
                ID: message.ID
            }

            messagesArray.push(messageObject)
        })

        const array = Object.entries(groupBy(messagesArray, 'Month')) 

        const monthArray = []
        const userCountArray = []

        array && array.forEach(arr => {

            const month = arr[0]
            const count = arr[1].length

            monthArray.push(month)
            userCountArray.push(count)

        })

        setLabelMessages(monthArray)
        setDataMessages(userCountArray)

    },[messages])


    // Likes
    useEffect(() => {

        const likesArray = []

        likes && likes.forEach(like => {

            const month = like.Timestamp.toDate().toLocaleDateString("nl-NL", options)

            const likeObject = {
                Month: month,
                ID: like.ID
            }

            likesArray.push(likeObject)
        })

        const array = Object.entries(groupBy(likesArray, 'Month')) 

        const monthArray = []
        const countArray = []

        array && array.forEach(arr => {

            const month = arr[0]
            const count = arr[1].length

            monthArray.push(month)
            countArray.push(count)

        })

        setLabelLikes(monthArray)
        setDataLikes(countArray)

    },[likes])

    return (
            <div className="main">
                <LeftSideBarAuthProfile />
                <LeftSideBarAuthProfileFullScreen/>
                <div className="profile profile-auth-profile" style={{display: menuState}}>
                    <div className="settings-inner-container">
                        <div className="divider card-header">
                            <h1>Analytics</h1>
                            <p>Analyseer de ontwikkeling van je community</p>
                        </div>
                        <div className='divider'>
                            <h2>Leden</h2>
                            <p>Analyseer de trend van de groei van het aantal leden van je community</p>
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
                        <div className='divider'>
                            <h2>Berichten</h2>
                            <p>Analyseer de trend van de groei van het aantal berichten van je community</p>
                            <div>
                                <Line data={{
                                        labels: labelMessages,
                                        datasets: [
                                        {
                                            label: 'Aantal berichten',
                                            data: dataMessages,
                                            fill: false,
                                            backgroundColor: 'green',
                                            borderColor: 'green',
                                        },
                                        ],
                                        options: {
                                            scales: {
                                                yAxes: [
                                                {
                                                    ticks: {
                                                    beginAtZero: true,
                                                    stepSize: 10
                                                    },
                                                },
                                                ],
                                            },
                                        } 
                                    }} 
                                />
                            </div>
                        </div>
                        <div className='divider'>
                            <h2>Likes</h2>
                            <p>Analyseer de trend van de groei van het aantal likes van je community</p>
                            <div>
                                <Line data={{
                                    labels: labelLikes,
                                    datasets: [
                                    {
                                        label: 'Aantal likes',
                                        data: dataLikes,
                                        fill: false,
                                        backgroundColor: 'green',
                                        borderColor: 'green',
                                    },
                                    ],
                                    options: {
                                        scales: {
                                            yAxes: [
                                            {
                                                ticks: {
                                                beginAtZero: true,
                                                stepSize: 10
                                                },
                                            },
                                            ],
                                        },
                                    } 
                                }} />
                            </div>
                        </div>
                        
                    </div>  
                </div>
                <RightSideBar />
            </div>
    )
}

export default Analytics