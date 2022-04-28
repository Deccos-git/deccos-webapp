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
import { useFirestore, useFirestoreImpactInstruments } from "../../firebase/useFirestore";
import AddQuestionnaire from "./AddQuestionnaire";
import { useHistory } from "react-router-dom";

const AddSROI = () => {
    const [outputID, setOutputID] = useState('')
    const [outputTitle, setOutputTitle] = useState('')
    const [outputDocid, setOutputDocid] = useState('')
    const [title, setTitle] = useState('')
    const [value, setValue] = useState('')

    const menuState = MenuStatus()
    const history = useHistory()

    const outputs = useFirestore('Outputs')
    const instruments = useFirestoreImpactInstruments(outputID && outputID)

    const outputHandler = (e) => {
        const outputID = e.target.options[e.target.selectedIndex].value
        const outputTitle = e.target.options[e.target.selectedIndex].dataset.title
        const outputDocid = e.target.options[e.target.selectedIndex].dataset.docid

        setOutputID(outputID)
        setOutputTitle(outputTitle)
        setOutputDocid(outputDocid)
    }

    const titleHandler = (e) => {
        const title = e.target.value 

        setTitle(title)
    }

    const valueHandler = (e) => {
        const value = e.target.value 

        setValue(value)
    }

    const saveSROI = (e) => {

        ButtonClicked(e, 'Opgeslagen')

        const id = uuid()

        db.collection('SROIs')
        .doc()
        .set({
            ID: id,
            Compagny: client,
            Timestamp: timestamp,
            Output: outputTitle,
            Value: value,
            OutputID: outputID,
            Title: title,
        })
        .then(() => {
            db.collection('Ouputs')
            .doc(outputDocid)
            .update({
                SROI: value
            })
        })
        .then(() => {
            instruments && instruments.forEach(instrument => {
                db.collection('ImpactInstruments')
                .doc(instrument.docid)
                .update({
                    SROI: value
                })
            })
        })
    }

  return (
    <div className="main">
    <LeftSideBarAuthProfile />
    <LeftSideBarAuthProfileFullScreen/>
    <div className="profile profile-auth-profile" style={{display: menuState}}>
        <div className="settings-inner-container">
            <div className="divider card-header">
                <h1>SROI toevoegen</h1>
            </div>
            <div className='divider'>
                <h2>Selecteer een output</h2>
                <select name="" id="" onChange={outputHandler}>
                    <option value="">-- Selecteer een output --</option>
                    {outputs && outputs.map(output => (
                        <option value={output.ID} data-title={output.Title} data-docid={output.docid}>{output.Title}</option>
                    ))}
                </select>
            </div>
            <div className='divider'>
                <h2>Geef de SROI een titel</h2>
                <input type="text" placeholder='Schrijf hier de titel van deze output' onChange={titleHandler} />
            </div>
            <div className='divider'>
                <h2>Geef de SROI waarde per output (in euro's)</h2>
                <input type="number" placeholder="Noteer hier de SROI waarde in euro's" onChange={valueHandler}/>
            </div>
            <div>
                <button onClick={saveSROI}>Opslaan</button>
            </div>
        </div>
    </div>
    <RightSideBar />
    </div>
  )
}

export default AddSROI