import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "./LeftSideBarAuthProfileFullScreen";
import RightSideBar from "./rightSideBar/RightSideBar"
import MenuStatus from "../hooks/MenuStatus";
import { Line } from 'react-chartjs-2'
import { useFirestoreMemberGraph } from '../firebase/useFirestore'
import { useState, useEffect } from 'react'

const Analytics = () => {
    const [label, setLabel] = useState('')
    const [data, setData] = useState('')

    const menuState = MenuStatus()
    const members = useFirestoreMemberGraph()

    useEffect(() => {

        const monthArray = []
        const countArray = []

        members && members.forEach(member => {
            const month = member.Month 
            const count = member.Contributions

            monthArray.push(month)
            countArray.push(count)
    
        })

        setLabel(monthArray)
        setData(countArray)
    }, [members])

    

    

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
                                <div>
                                <Line data={{
                                        labels: label,
                                        datasets: [
                                        {
                                            label: 'Aantal leden',
                                            data: data,
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
                        </div>
                        <div className='divider'>
                            <h2>Bijdragen aan doelen</h2>
                        </div>
                        <div className='divider'>
                            <h2>Likes</h2>
                        </div>
                        
                    </div>  
                </div>
                <RightSideBar />
            </div>
    )
}

export default Analytics