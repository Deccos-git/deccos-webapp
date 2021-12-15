import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "./LeftSideBarAuthProfileFullScreen";
import RightSideBar from "./rightSideBar/RightSideBar"
import Location from "../hooks/Location"
import { useFirestoreMyEvents } from "../firebase/useFirestore";
import MenuStatus from "../hooks/MenuStatus";
import Calendar from "./Calender";
import { useState } from 'react';
import { db } from "../firebase/config";

const MyEvents = () => {

    const route = Location()[3]
    const menuState = MenuStatus()

    const [myEventsTab, setMyEventsTab] = useState('active-tab')
    const [calendarTab, setCalendarTab] = useState('not-active-tab')
    const [myEventsDisplay, setMyEventsDisplay] = useState('block')
    const [calendarDisplay, setCalendarDisplay] = useState('none')

    const events = useFirestoreMyEvents(route)

    const showMyEvents = () => {
        setMyEventsDisplay('block')
        setCalendarDisplay('none')
        setMyEventsTab('active-tab')
        setCalendarTab('not-active-tab')
    }

    const showCalendar = () => {
        setMyEventsDisplay('none')
        setCalendarDisplay('flex')
        setMyEventsTab('not-active-tab')
        setCalendarTab('active-tab')
    }

    const signoutEvent = (e) => {

        const id = e.target.dataset.id 

        db.collection('EventSignups')
        .doc(id)
        .delete()
    }

    return (
        <div className="main">
            <LeftSideBarAuthProfile />
            <LeftSideBarAuthProfileFullScreen/>
            <div className="card-overview" style={{display: menuState}}>
                <div className="page-header">
                    <h1>Mijn events</h1>
                    <div className='group-navigation-container'>
                        <p className={myEventsTab} onClick={showMyEvents}>Mijn events</p>
                        <p className={calendarTab} onClick={showCalendar}>Agenda</p>
                    </div>
                </div>
                <div className='task-calendar-container' style={{display: calendarDisplay}}>
                    <Calendar events={events}/>
                </div>
                <div className='my-event-list-container' style={{display: myEventsDisplay}}>
                    {events && events.map(vnt => (
                        <div className='signup-container my-event-card' key={vnt.ID}>
                            <h3>{vnt.Title}</h3>
                            <p>{vnt.Date}</p>
                            <button className='button-simple' data-id={vnt.docid} onClick={signoutEvent}>Afmelden</button>
                        </div>
                    ))}
                </div>
            </div>
            <RightSideBar />
        </div>
    )
}

export default MyEvents
