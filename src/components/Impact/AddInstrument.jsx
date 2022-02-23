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
import { useFirestoreID, useFirestoreOutputQuestionnaireFields } from "../../firebase/useFirestore";
import AddQuestionnaire from "./AddQuestionnaire";

const AddInstrument = () => {
    const [authO] = useContext(Auth)

    const [outputArray, setOutputArray] = useState([])
    const [output, setOutput] = useState('')
    const [matchesSwitch, setMatchesSwitch] = useState(false)
    const [membersSwitch, setMembersSwitch] = useState(false)
    const [dataType, setDataType] = useState('')
    const [outputTitle, setOutputTitle] = useState('')
    const [outputData, setOutputData] = useState('')

    const menuState = MenuStatus()
    const route = Location()[3]

    const outputs = useFirestoreID('Outputs', route ? route : '')
    const questionnaireFields = useFirestoreOutputQuestionnaireFields(route)

    console.log(questionnaireFields)

    useEffect(() => {
        outputs && outputs.forEach(output => {
            setOutputTitle(output.Title)
            setOutputData(output)
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
            totalArray.push({Output:'Aantal matches', Datatype: 'amount'})
        }

        if(membersSwitch === true){
            totalArray.push({Output:'Aantal leden van de community', Datatype: 'amount'})
        }

        if(outputArray.length > 0){
            totalArray.push(...outputArray)
        }

        totalArray && totalArray.forEach(output => {

            db.collection('ImpactInstruments')
            .doc()
            .set({
                OutputID: route,
                OutputTitle: outputTitle,
                ID: uuid(),
                Compagny: client,
                Timestamp: timestamp,
                User: authO.UserName,
                UserPhoto: authO.Photo,
                UserID: authO.ID,
                Output: output
            })

        })
    }

    const addIndicator = (e) => {

        setOutputArray([...outputArray, {Output:output, Datatype: dataType}])
  
      }
    
    const datatypeHandler = (e) => {

        const option = e.target.options

        const dataType = option[option.selectedIndex].value

        setDataType(dataType)


    }

  return (
    <div className="main">
    <LeftSideBarAuthProfile />
    <LeftSideBarAuthProfileFullScreen/>
    <div className="profile profile-auth-profile" style={{display: menuState}}>
        <div className="settings-inner-container">
            <div className="divider card-header">
                <h1>Meetinstrument toevoegen</h1>
                {outputs && outputs.map(output => (
                    <div className='subtitle-header'>
                        <p>aan resultaat:</p>
                        <p><b>{output.Title}</b></p>
                    </div>
                ))}
            </div>
        </div>
        <div>
            <div className='divider'>
                <h2>Voeg eigen meetinstrumenten toe</h2>
                <input type="text" placeholder='Wat wil je meten?' onChange={customIndicatorHandler} />
                <h3>Selecteer een datatype</h3>
                <select name="" id="" onChange={datatypeHandler}>
                    <option value="">-- Selecteer een datatype --</option>
                    <option value="amount">Aantal (nummer)</option>
                    <option value="text">Tekst</option>
                </select>
                <div className='button-userrole-container'>
                    <button className='button-simple' onClick={addIndicator}>Toevoegen</button>
                </div>
            </div>
            <div className='divider'>
                <h2>Voeg een vraag toe</h2>
                <AddQuestionnaire output={outputData}/>
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
                {questionnaireFields && questionnaireFields.map(field => (
                    <div className='functionality-container'>
                        <p>{field.Question}</p>
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