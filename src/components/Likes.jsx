import { useFirestoreLikesGraphUser } from "../firebase/useFirestore"
import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "./LeftSideBarAuthProfileFullScreen";
import RightSideBar from "./rightSideBar/RightSideBar"
import Location from "../hooks/Location"
import MenuStatus from "../hooks/MenuStatus";
import { Line } from 'react-chartjs-2'
import { useState, useEffect } from 'react'

const Likes = () => {
    const [label, setLabel] = useState('')
    const [data, setData] = useState('')

    const route = Location()[3]
    const menuState = MenuStatus()

    const likes = useFirestoreLikesGraphUser(route)

    console.log(likes)

    useEffect(() => {

        const monthArray = []
        const countArray = []

        likes && likes.forEach(like => {
            const month = like.Month 
            const count = like.Contributions

            monthArray.push(month)
            countArray.push(count)
    
        })

        setLabel(monthArray)
        setData(countArray)
    }, [likes])

    
    return (
        <div className="main">
             <LeftSideBarAuthProfile />
            <LeftSideBarAuthProfileFullScreen/>
            <div className="card-overview" style={{display: menuState}}>
            <div className="page-header">
                <h1>Likes</h1>
            </div>
            <div className='divider'>
                        <div>
                        <Line data={{
                                labels: label,
                                datasets: [
                                {
                                    label: 'Aantal likes',
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
            </div>
            <RightSideBar />
        </div>
    )
}

export default Likes
