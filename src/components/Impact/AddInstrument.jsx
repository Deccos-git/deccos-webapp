import RightSideBar from "../rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "../LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "../LeftSideBarAuthProfileFullScreen";
import MenuStatus from "../../hooks/MenuStatus";
import { Link } from "react-router-dom";
import { client } from "../../hooks/Client"
import { useState, useEffect, useContext } from 'react'
import ButtonClicked from "../../hooks/ButtonClicked";
import { db, timestamp } from "../../firebase/config.js"
import uuid from 'react-uuid';
import { Auth } from '../../StateManagment/Auth';
import Location from "../../hooks/Location"
import { useFirestoreID, useFirestoreQuestionnaires, useFirestoreProjects } from "../../firebase/useFirestore";

const AddInstrument = () => {
    const [authO] = useContext(Auth)

    const [outputArray, setOutputArray] = useState([])
    const [output, setOutput] = useState('')
    const [matchesSwitch, setMatchesSwitch] = useState(false)
    const [membersSwitch, setMembersSwitch] = useState(false)
    const [singular, setSingular] = useState('')
    const [outputTitle, setOutputTitle] = useState('')
    const [outputData, setOutputData] = useState('')
    const [activityID, setActivityID] = useState('')
    const [projectID, setProjectID] = useState('')

    const menuState = MenuStatus()
    const route = Location()[3]

    const outputs = useFirestoreID('Outputs', route ? route : '')
    const questionnaires = useFirestoreQuestionnaires('Questionnaires')
    const projects = useFirestoreProjects(activityID)

    useEffect(() => {
      projects && projects.forEach(project => {
          setProjectID(project.ID)
      })
    
    }, [projects])
    

    useEffect(() => {
        outputs && outputs.forEach(output => {
            setOutputTitle(output.Title)
            setOutputData(output)
            setActivityID(output.ActivityID)
        })

    },[outputs])

    // Switches

    const ToggleSwitchMatches = () => {
        return (
            <div className="container">
            <div className="toggle-switch">
                <input type="checkbox" className="checkbox" 
                        name={'matches'} id={'matches'} onChange={() => { setMatchesSwitch(true)}} />
                <label className="label" htmlFor={'matches'}>
                <span className="inner"/>
                <span className="switch"/>
                </label>
            </div>
            </div>
        );
    };

    const ToggleSwitchMembers = () => {
        return (
            <div className="container">
            <div className="toggle-switch">
                <input type="checkbox" className="checkbox"
                        name={'members'} id={'members'} onChange={() => { setMembersSwitch(true)}} />
                <label className="label" htmlFor={'members'}>
                <span className="inner"/>
                <span className="switch"/>
                </label>
            </div>
            </div>
        );
    };

    const ToggleSwitchCustom= ({output}) => {
        return (
            <div className="container">
            <div className="toggle-switch">
                <input type="checkbox" className="checkbox" defaultChecked={true}
                        name={output} id={output} data-output={output} onChange={customSwitchHandler} />
                <label className="label" htmlFor={output}>
                <span className="inner"/>
                <span className="switch"/>
                </label>
            </div>
            </div>
        );
    };

    const customSwitchHandler = (e) => {
    const output = e.target.dataset.output 

    if(outputArray.includes(output)){
        const index = outputArray.indexOf(output)
        outputArray.splice(index, 1)
    }
    }

    const customIndicatorHandler = (e) => {
        const input = e.target.value 

        setOutput(input)
    }

    const saveInstrument = (e) => {

        ButtonClicked(e, 'Opgeslagen')

        const totalArray = []

        if(matchesSwitch === true){
            totalArray.push({Output:'Aantal matches', Datatype: 'Matches'})
        }

        if(membersSwitch === true){
            totalArray.push({Output:'Aantal leden van de community', Datatype: 'Members'})
        }

        if(outputArray.length > 0){
            totalArray.push(...outputArray)
        }

        totalArray && totalArray.forEach(output => {

            const id = uuid()

            db.collection('ImpactInstruments')
            .doc()
            .set({
                OutputID: route,
                OutputTitle: outputTitle,
                ID: id,
                Compagny: client,
                Timestamp: timestamp,
                User: authO.UserName,
                UserPhoto: authO.Photo,
                UserID: authO.ID,
                Output: output,
                ActivityID: activityID,
                Singular: singular
            })
            .then(() => {
                createTask(output, id)
            })

        })
    }

    const createTask = (output, id) => {

        const saveTask = (task) => {
            db.collection('Tasks')
            .doc()
            .set({
                ActivityID: activityID,
                ProjectID: projectID,
                AppointedID: '',
                AppointedName: '',
                AppointedPhoto: '',
                AppointedEmail: '',
                InstrumentID: id,
                OutputID: route,
                Compagny: client,
                Timestamp: timestamp,
                User: authO.UserName,
                UserPhoto: authO.Photo,
                UserID: authO.ID,
                Completed: false,
                Date: '',
                ID: uuid(),
                Icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAnZQTFRFAAAAEBghEBcgEBkgEBkhERYgERcgEBggERggDhcgEBohEBchHxgUDhkhEBkZEBgfEhgcEBcfDxggERcfERwdExoiDhgiDxwkDxghEhgeFBwhDxcgexgAERojEhodDxcfEBgiEBgTBwMTEBofDxgiDhkgERUhDxkgEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBkgERkgEBggEBggEBggEBggEBcgEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBghEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBgfEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBcgEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBchEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggDxggEBggEBggEBkgEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggEBggDxghEBggEBggEBggDxggEBgg////Rl8MDAAAANB0Uk5TAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwpSWZ8kXsoET2Dwuj554Q+F2rI8hVkyvz64b6bhW5vh73HYyel36BVIwkBASJUn6YBStXZciEEA3BLYObviySOA/DcUlNbxTIzyeXUKy7GC2VeGIoEkGv92CUeDf7konHxHd5+kgcD85oOwSpoqQq3G2ecT7k1AeOW2jc629MS0THQhkXdL8xQxCDttetXq60B+1YD9OADBXT3iY2MCCYWMFoB4hDDAfaEJxoAAAABYktHRNF50f8KAAAACXBIWXMAAOw4AADsOAFxK8o4AAAD3klEQVRIx6VW+XsTZRDeJJCJZ+x64X2C24Q2gTZtaRBzUMBI0yYQq6EloSUUhdSeFIu2pRQFD1SgQltOURRFFG+LIN4Vr/dPcnaTNJvNbvV5mN+S75355pt5550VhKs1k0kqdTgXlpWVOx0uyWyeHW2Z4160uKLSA8U8VRXVNe65VkM40ZJa71IU2FJv7aNEBnhp2WM+xvgDweV1K1auWv54wM8/faEnJNINv7qeU/GFGxoj0TUWQbCtjcaebApzCM9TrmtsRfin4+s4XHPL+oQqHCXXb2jmv9e1XmvR4JNtG4HUpnaT5na6rn1zCtjY9kzBAV3f9iywZWtCJ1lKpLdwrI4bVGc2auX4z3XeaNctxk1d3UBPK5Xk/3L1Mr6PTPrls9O2fqDXNXMFSfWcT5cRXhBE6uKs6rdnPUroeT9SaTMJhkaUTsEzkO0g7eAUX0jOgmfMi4NAaImCuZmGhrFzxAhP0V2jfEYjO+GrJZlX5A5hd4shX7YPvvQyU8NCe3Yj5JZRVLMX4YghfpMH4VfkK2KvYm8NyRWoBpoMXkCJ1/zwvb6PT81vNAHVJAo0WgF/owE+ueFN4K39yik1+nGAk6ODlQjoZ0TJMSbM2zuyxYwEUHWQHRweBA/pEv6WDqbd4fHsGR0KwuNghwlg8lZRB2860gMc3UW3Zft7+yTgZIeFQJ0SxG5yTRw7nruLyHEC6O7L300ngTESTGXAisyr9h/FO6dMGcbOo3ffA053kkXrQHmH973AB2eUFprpzIc8aKdsqlxzDuXAR4qDjc5+DHjPcdA7qO8TIHC2gMA5Byc/+s67FA/xU56j85/R3RQLAlVHzOpBtt+TfbSqrHRv+nPgi3EaPwx8+dWawjGWyxpnh9KqfOMoOcGl//rcN6xgE98WNofauXGl7CAdwNSFmWJ+13IRvktTuLhSKwh0YQoVzHQzLWbyfT/jcfmHH2VZLb+sxScb5IaJRfSm6E9+TK2KaslCkXCG3kUDRNLPl34ZLcJTS26ALFQ7jGbViNKv4/uKyEi/NWN4KCNNNM2qs/l/iMD56QzmPlrmYZm53z4L3paRmZJc1v8hZNaMkOXXhCKV3duMPKz0OyvXaZfqmYoY93c+oC/GcxUxjquYLtCDityn9eV+qyz3Vx4qZFayg+cxNTgyR9vgh0cGmV49V7RVpPnZlRUrWFmJ2B55ZfXGFxTdLdpUS3Etpzvvj2iksUFZivWr7bqyIg14lbX7Z3DyJNtkMLN2+wckg6ZaeLGHtIu9e2iajElgtf61qDr/6VD5d12Ne/4jwqwm/iN/nIyxOeOlkigKV2v/AlgvmPDok/cdAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE5LTAxLTAyVDE1OjQ3OjU3KzAxOjAwY47VJQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOS0wMS0wMlQxNTo0Nzo1NyswMTowMBLTbZkAAABGdEVYdHNvZnR3YXJlAEltYWdlTWFnaWNrIDYuNy44LTkgMjAxNi0wNi0xNiBRMTYgaHR0cDovL3d3dy5pbWFnZW1hZ2ljay5vcmfmvzS2AAAAGHRFWHRUaHVtYjo6RG9jdW1lbnQ6OlBhZ2VzADGn/7svAAAAGHRFWHRUaHVtYjo6SW1hZ2U6OmhlaWdodAA1MTLA0FBRAAAAF3RFWHRUaHVtYjo6SW1hZ2U6OldpZHRoADUxMhx8A9wAAAAZdEVYdFRodW1iOjpNaW1ldHlwZQBpbWFnZS9wbmc/slZOAAAAF3RFWHRUaHVtYjo6TVRpbWUAMTU0NjQ0MDQ3N2QlNwgAAAATdEVYdFRodW1iOjpTaXplADI2LjJLQkLf1fuyAAAAYXRFWHRUaHVtYjo6VVJJAGZpbGU6Ly8uL3VwbG9hZHMvNTYvV1cyV1BKYi8xNzQ0LzM2NDM3ODEtY2hlY2stY2hlY2tsaXN0LWNvbXBsZXRlLWRvbmUtbWFya18xMTM0MDYucG5nFYzcBAAAAABJRU5ErkJggg==',
                Priority: '',
                Task: task, 
                Type: 'task',
            })
        }

        if(output.Datatype === 'Manual'){
            saveTask(`1 nieuwe ${singular}`)
        } else if (output.Datatype === 'Questionnairy'){
            saveTask(`Vragenlijst '${output.Output}' versturen`)
            saveTask(`Vragenlijst '${output.Output}' analyseren`)
        } else {
            return
        }
    }

    const addIndicator = (e) => {

        setOutputArray([...outputArray, {Output:output, Datatype: 'Manual', ID: uuid()}])
  
      }
    
    const singularHandler = (e) => {

        const value = e.target.value


        setSingular(value)


    }

    const questionnaireHandler = (e) => {
        const questionnaireID = e.target.options[e.target.selectedIndex].value
        const questionnaireTitle = e.target.options[e.target.selectedIndex].dataset.title

        setOutputArray([...outputArray, {Output:questionnaireTitle, Datatype: 'Questionnairy', ID: questionnaireID}])
    }

  return (
    <div className="main">
    <LeftSideBarAuthProfile />
    <LeftSideBarAuthProfileFullScreen/>
    <div className="profile profile-auth-profile" style={{display: menuState}}>
        <div className="settings-inner-container">
            <div className="divider card-header">
                <h1>Meetinstrument toevoegen</h1>
                <div className='subtitle-header'>
                    <p>aan output:</p>
                    <p><b>{outputTitle}</b></p>
                </div>
            </div>
        </div>
        <div>
            <div className='divider'>
                <h2>Voeg eigen meetinstrumenten toe</h2>
                <input type="text" placeholder='Wat wil je meten?' onChange={customIndicatorHandler} />
                <h4>Definieer enkelvoud</h4>
                <input type="text" placeholder='Definieer enkelvoud' onChange={singularHandler} />
                <div className='button-userrole-container'>
                    <button className='button-simple' onClick={addIndicator}>Toevoegen</button>
                </div>
            </div>
            <div className='divider'>
                <h2>Voeg een vragenlijst toe</h2>
                <select name="" id="" onChange={questionnaireHandler}>
                    <option value="">-- Selecteer een vragenlijst --</option>
                    {questionnaires && questionnaires.map(questionnaire => (
                        <option value={questionnaire.ID} data-title={questionnaire.Title}>{questionnaire.Title}</option>
                    ))}
                </select>
                
            </div>
            <div className='divider'>
                <h2>Selecteer bestaande meetinstrument</h2>
                <div className='functionality-container'>
                    <p>Aantal matches</p>
                    <ToggleSwitchMatches/>
                </div>
                <div className='functionality-container'>
                    <p>Aantal communityleden</p>
                    <ToggleSwitchMembers/>
                </div>
                {outputArray && outputArray.map(output => (
                    <div className='functionality-container'>
                    <p>{output.Output}</p>
                    </div>
                ))}
            </div>
        </div>
        <div id="button-add-goal">
            <button onClick={saveInstrument}>Opslaan</button>
        </div>
    </div>
    <RightSideBar />
    </div>
  )
}

export default AddInstrument