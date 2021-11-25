import { useFirestoreContributions, useFirestoreContributionGraphUser } from "../firebase/useFirestore"
import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "./LeftSideBarAuthProfileFullScreen";
import RightSideBar from "./rightSideBar/RightSideBar"
import Location from "../hooks/Location"
import MenuStatus from "../hooks/MenuStatus";
import { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'

const Contributions = () => {
    const [labelGraphs, setLabelGraphs] = useState('')
    const [dataGraphs, setDataGraphs] = useState('')

    const route = Location()[3]
    const menuState = MenuStatus()

    const contributionsGoal = useFirestoreContributions("Contributions", "GoalID", route)
    const contributionsMessage = useFirestoreContributions("Contributions", "MessageID", route)
    const contributionsReciever = useFirestoreContributions("Contributions", "RecieverID", route)
    const graphs = useFirestoreContributionGraphUser(route)
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    useEffect(() => {

        const monthArray = []
        const countArray = []

        graphs && graphs.forEach(graph => {
            const month = graph.Month 
            const count = graph.Contributions

            monthArray.push(month)
            countArray.push(count)
    
        })

        setLabelGraphs(monthArray)
        setDataGraphs(countArray)
    }, [graphs])


    const recieverLink = (e) => {

    }

    return (
        <div className="main">
            <LeftSideBarAuthProfile />
            <LeftSideBarAuthProfileFullScreen/>
            <div className="card-overview" style={{display: menuState}}>
            <div className="page-header">
                <h1>Bijdrage aan doelen</h1>
            </div>
            <div className='graph-div-contributions-container'>
                <Line data={{
                        labels: labelGraphs,
                        datasets: [
                        {
                            label: 'Aantal bijdrage aan doelen',
                            data: dataGraphs,
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
            {contributionsGoal && contributionsGoal.map(goal => (
                <div className="notification-card" key={goal.ID}>
                    <div className="user-meta-container">
                        <img className="user-photo" src={goal.RecieverPhoto} alt="" data-recieverid={goal.RecieverID} onClick={recieverLink} />
                        <h2>{goal.RecieverName}</h2>
                    </div>
                    <p>heeft bijdragen aan</p>
                    <h3>{goal.GoalTitle}</h3>
                    <ul className="contribution-card-ul">
                        <li>Gegeven door: {goal.SenderName}</li>
                        <li>{goal.Timestamp.toDate().toLocaleDateString("nl-NL", options)} </li>
                    </ul>
                </div>
            ))}
            {contributionsMessage && contributionsMessage.map(message => (
                <div className="notification-card" key={message.ID}>
                    <div className="user-meta-container">
                        <img className="user-photo" src={message.RecieverPhoto} alt="" data-recieverid={message.RecieverID} onClick={recieverLink} />
                        <h2>{message.RecieverName}</h2>
                    </div>
                    <p>heeft bijdragen aan</p>
                    <h3>{message.GoalTitle}</h3>
                    <ul className="contribution-card-ul">
                        <li>Gegeven door: {message.SenderName}</li>
                        <li>{message.Timestamp.toDate().toLocaleDateString("nl-NL", options)} </li>
                    </ul>
                </div>
            ))} 
             {contributionsReciever && contributionsReciever.map(reciever => (
                <div className="notification-card" key={reciever.ID}>
                    <div className="user-meta-container">
                        <img className="user-photo" src={reciever.RecieverPhoto} alt="" data-recieverid={reciever.RecieverID} onClick={recieverLink} />
                        <h2>{reciever.RecieverName}</h2>
                    </div>
                    <p>heeft bijdragen aan</p>
                    <h3>{reciever.GoalTitle}</h3>
                    <ul className="contribution-card-ul">
                        <li>Gegeven door: {reciever.SenderName}</li>
                        <li>{reciever.Timestamp.toDate().toLocaleDateString("nl-NL", options)} </li>
                    </ul>
                </div>
            ))}           
            </div>
            <RightSideBar />
        </div>
    )
}

export default Contributions
