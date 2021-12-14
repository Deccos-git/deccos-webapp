import dayjs from 'dayjs'
import { useState, useEffect } from 'react'
import rightArrow from '../images/icons/right-arrow-icon.png'
import leftArrow from '../images/icons/left-arrow-icon.png'
import { useHistory } from "react-router-dom"
import { client } from '../hooks/Client';

const Calendar = ({events}) => {

    const [monthIndex, setMonthIndex] = useState(dayjs().month())

    const history = useHistory()
    const locale = {
        name: 'nl',
        weekdays: 'zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag'.split('_'),
        weekdaysShort: 'zo_ma_di_wo_do_vr_za'.split('_'),
        weekdaysMin: 'zo_ma_di_wo_do_vr_za'.split('_'),
        months: 'januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december'.split('_'),
        monthsShort: 'jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec'.split('_'),
        ordinal: n => `${n}.`,
        weekStart: 1,
        yearStart: 4,
        formats: {
          LT: 'HH:mm',
          LTS: 'HH:mm:ss',
          L: 'DD-MM-YYYY',
          LL: 'D MMMM YYYY',
          LLL: 'D MMMM YYYY HH:mm',
          LLLL: 'dddd D MMMM YYYY HH:mm'
        },
        relativeTime: {
          future: 'over %s',
          past: '%s geleden',
          s: 'een paar seconden',
          m: 'een minuut',
          mm: '%d minuten',
          h: 'een uur',
          hh: '%d uur',
          d: 'een dag',
          dd: '%d dagen',
          M: 'een maand',
          MM: '%d maanden',
          y: 'een jaar',
          yy: '%d jaar'
        }
      }

     const getMonth = () => {
        const year = dayjs().year()
        const firstDayofTheMonth = dayjs(new Date(year, monthIndex, 0)).day()
        let currentDayCount = 0 - firstDayofTheMonth
        const daysMatrix = new Array(5).fill([]).map(() => {
            return new Array(7).fill(null).map(() => {
                currentDayCount++
                return dayjs(new Date(year, monthIndex, currentDayCount))
            })
        })
        return daysMatrix
    }

    const [currentMonth, setCurrentMonth] = useState(getMonth())

    useEffect(() => {
        setCurrentMonth(getMonth())
    }, [monthIndex])


    const currentDayClass = (day) => {
        return day.format('DD-MM-YY') === dayjs().format('DD-MM-YY') ? 'current-day' : ''

    }

    const currentMonthHandler = () => {
        setMonthIndex(dayjs().month())
    }

    const prevMonthHandler = () => {
        setMonthIndex(monthIndex -1)
    }

    const nextMonthHandler = () => {
        setMonthIndex(monthIndex +1)
    }

    const eventLink = (e) => {
        const id = e.target.dataset.id
        const type = e.target.dataset.type 

        if(type === 'Event'){
            history.push(`/${client}/EventDetail/${id}`)
        } else if (type === 'Task'){
            history.push(`/${client}/TaskDetail/${id}`)
        }

    }

        const event = (day, vnt) => {

                if(day.format('YYYY-MM-DD') === vnt.Date){
                    return(
                    <div key={vnt.ID}>
                        <p className='calendar-event-container' data-id={vnt.ID} data-type={vnt.Type} onClick={eventLink}>{vnt.Title}</p>
                    </div>
                    )
                } else {
                    return <div></div>
                }
        }

    return (
        <div className='calender-container'>
           <>
            <div className='calendar-navigation-container'>
                <button onClick={currentMonthHandler}>Vandaag</button>
                <h3>{dayjs(new Date(dayjs().year(), monthIndex)).format('MMMM YYYY')}</h3>
                <div className='calendar-navigation-next-prev-container'>
                    <img src={leftArrow} alt="" onClick={prevMonthHandler} />
                    <img src={rightArrow} alt="" onClick={nextMonthHandler}/>
                </div>
            </div>
                {currentMonth.map((week, index) => (
                    <div className='month-container' key={index}>
                        {week.map((day, idx) => (
                            <div className='day-container' key={idx}>
                                {index === 0 && <p className='calendar-weekdays'>{day.locale(locale, null, true).format('ddd').toUpperCase()}</p>}
                                <p className={`${currentDayClass(day)}`}>{day.format('DD')}</p>
                                <div>
                                {events && events.map(vnt => (
                                    <div>
                                        {event(day, vnt)}
                                    </div>
                                ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </>
        </div>
    )
}

export default Calendar
