import { useFirestoreMyLikes } from "../../firebase/useFirestore"
import LeftSideBarAuthProfile from "../LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "../LeftSideBarAuthProfileFullScreen";
import RightSideBar from "../rightSideBar/RightSideBar"
import Location from "../../hooks/Location"
import MenuStatus from "../../hooks/MenuStatus";
import { Line } from 'react-chartjs-2'
import { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom";
import { client } from "../../hooks/Client";

const Likes = () => {
    const [label, setLabel] = useState('')
    const [data, setData] = useState('')

    const route = Location()[3]
    const menuState = MenuStatus()
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const history = useHistory()

    const likesGiven = useFirestoreMyLikes('SenderID',route)
    const likesRecieved = useFirestoreMyLikes('RecieverID',route)

    const messageLink = (e) => {

        const id = e.target.dataset.id

        history.push(`/${client}/MessageDetail/${id}`)

    }

    // useEffect(() => {

    //     const monthArray = []
    //     const countArray = []

    //     likes && likes.forEach(like => {
    //         const month = like.Month 
    //         const count = like.Contributions

    //         monthArray.push(month)
    //         countArray.push(count)
    
    //     })

    //     setLabel(monthArray)
    //     setData(countArray)
    // }, [likes])

    
    return (
        <div className="main">
             <LeftSideBarAuthProfile />
            <LeftSideBarAuthProfileFullScreen/>
            <div className="card-overview" style={{display: menuState}}>
            <div className="page-header">
                <h1>Likes</h1>
            </div>
            <div className='divider likes-outer-container'>
                    <h2>Gegeven likes</h2>
                    {likesGiven && likesGiven.map(like => (
                        <div className='my-like-container' key={like.ID}>
                            <p>Aan: {like.RecieverName}</p>
                            <p>{like.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                            <button data-id={like.MessageID} onClick={messageLink}>Bekijk bericht</button>
                        </div>
                    ))}
                </div>
                <div className='divider likes-outer-container'>
                    <h2>Ontvangen likes</h2>
                    {likesRecieved && likesRecieved.map(like => (
                        <div className='my-like-container' key={like.ID}>
                            <p>Van: {like.SenderName}</p>
                            <p>{like.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                            <button data-id={like.MessageID} onClick={messageLink}>Bekijk bericht</button>
                        </div>
                    ))}
                </div>
            {/* <div className='divider'> 
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
                 </div> */}
            </div>
            <RightSideBar />
        </div>
    )
}

export default Likes