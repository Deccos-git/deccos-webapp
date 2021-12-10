import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "./LeftSideBarAuthProfileFullScreen";
import RightSideBar from "./rightSideBar/RightSideBar"
import MenuStatus from "../hooks/MenuStatus";
import { Line } from 'react-chartjs-2'
import { useFirestoreMemberGraph, useFirestoreLikesGraph, useFirestoreContributionGraph, useFirestoreMessageGraph } from '../firebase/useFirestore'
import { useState, useEffect } from 'react'

const Analytics = () => {
    
    // State
    const [labelMembers, setLabelMembers] = useState('')
    const [dataMembers, setDataMembers] = useState('')
    const [labelLikes, setLabelLikes] = useState('')
    const [dataLikes, setDataLikes] = useState('')
    const [labelGoalLikes, setLabelGoalLikes] = useState('')
    const [dataGoalLikes, setDataGoalLikes] = useState('')
    const [labelMessages, setLabelMessages] = useState('')
    const [dataMessages, setDataMessages] = useState('')

    // Settings
    const menuState = MenuStatus()

    // Database query's
    const members = useFirestoreMemberGraph()
    const likes = useFirestoreLikesGraph()
    const goalLikes = useFirestoreContributionGraph()
    const messages = useFirestoreMessageGraph()

    // Leden
    useEffect(() => {

        const monthArray = []
        const countArray = []

        members && members.forEach(member => {
            const month = member.Month 
            const count = member.Contributions

            monthArray.push(month)
            countArray.push(count)
    
        })

        setLabelMembers(monthArray)
        setDataMembers(countArray)
    }, [members])

    // Messages
    useEffect(() => {

        const monthArray = []
        const countArray = []

        messages && messages.forEach(message => {
            const month = message.Month 
            const count = message.Contributions

            monthArray.push(month)
            countArray.push(count)
    
        })

        setLabelMessages(monthArray)
        setDataMessages(countArray)
    }, [likes])

    // GoalLikes
    useEffect(() => {

        const monthArray = []
        const countArray = []

        goalLikes && goalLikes.forEach(goalLike => {
            const month = goalLike.Month 
            const count = goalLike.Contributions

            monthArray.push(month)
            countArray.push(count)
    
        })

        setLabelGoalLikes(monthArray)
        setDataGoalLikes(countArray)
    }, [likes])

    // Likes
    useEffect(() => {

        const monthArray = []
        const countArray = []

        likes && likes.forEach(like => {
            const month = like.Month 
            const count = like.Contributions

            monthArray.push(month)
            countArray.push(count)
    
        })

        setLabelLikes(monthArray)
        setDataLikes(countArray)
    }, [likes])

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
                                        labels: labelMembers,
                                        datasets: [
                                        {
                                            label: 'Aantal leden',
                                            data: dataMembers,
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
                        <div className='divider'>
                            <h2>Berichten</h2>
                            <p>Analyseer de trend van de groei van het aantal berichten van je community</p>
                            <div>
                                <Line data={{
                                        labels: labelMessages,
                                        datasets: [
                                        {
                                            label: 'Aantal leden',
                                            data: dataMessages,
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
                        <div className='divider'>
                            <h2>Bijdragen aan doelen</h2>
                            <p>Analyseer de trend van de groei van het aantal bijdragen aan de doelen van je community</p>
                            <div>
                                <Line data={{
                                        labels: labelGoalLikes,
                                        datasets: [
                                        {
                                            label: 'Aantal bijdragen aan doelen',
                                            data: dataGoalLikes,
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
                        
                    </div>  
                </div>
                <RightSideBar />
            </div>
    )
}

export default Analytics