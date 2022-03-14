import RightSideBar from "../rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "../LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "../LeftSideBarAuthProfileFullScreen";
import MenuStatus from "../../hooks/MenuStatus";
import { Link } from "react-router-dom";
import { client } from "../../hooks/Client"
import plusIcon from '../../images/icons/plus-icon.png'
import deleteIcon from '../../images/icons/delete-icon.png'
import {useFirestore, useFirestoreImpactInstruments} from "../../firebase/useFirestore"
import settingsIcon from '../../images/icons/settings-icon.png'
import { db } from "../../firebase/config.js"
import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import measureIcon from '../../images/icons/measure-icon.png'
import effectIcon from '../../images/icons/traject-icon.png'

const OutputSettings = () => {
    const [color, setColor] = useState('')

    const menuState = MenuStatus()
    const history = useHistory()

    const outputs = useFirestore('Outputs')
    const colors = useFirestore('Colors')

    useEffect(() => {
        colors && colors.forEach(color => {
            const background = color.Background 

            setColor(background)
        })

    },[colors])

    const Instruments = ({output}) => {
        const instruments = useFirestoreImpactInstruments(output.ID) 
        
        return(
            <div className='output-instrument-container'>
                {instruments && instruments.map(instrument => (
                    <div>
                        <p data-id={instrument.ID} onClick={instrumentDetailLink}>{instrument.Output.Output} ({instrument.Output.Datatype})</p>
                    </div>
                ))}
                <img className='add-instrument-button' src={plusIcon} data-id={output.ID} alt="" onClick={addInstrument} />
            </div>
        )
    }

    const addInstrument = (e) => {

        const ID = e.target.dataset.id

        history.push(`/${client}/AddInstrument/${ID}`)

    }

    const instrumentDetailLink = (e) => {

        const ID = e.target.dataset.id

        history.push(`/${client}/InstrumentDetail/${ID}`)
    }

    const fieldDetailLink = (e) => {
        const ID = e.target.dataset.id

        history.push(`/${client}/QuestionnaireFieldDetail/${ID}`)
    }


    const outputLink = (e) => {

        const ID = e.target.dataset.id

        history.push(`/${client}/OutputSettingsDetail/${ID}`)

    }

    const deleteOutput = (e) => {

        const docid = e.target.dataset.docid

        db.collection('Outputs')
        .doc(docid)
        .delete()

    }

  return (
     <div className="main">
    <LeftSideBarAuthProfile />
    <LeftSideBarAuthProfileFullScreen/>
    <div className="profile profile-auth-profile" style={{display: menuState}}>
        <div className="settings-inner-container">
            <div className="divider card-header">
                <h1>Outputs</h1>
            </div>
        </div>
        <div className='divider'>
            <h2>Output toevoegen</h2>
            <Link to={`/${client}/AddOutput`} ><img id="plus-icon-goal-settings" src={plusIcon} alt="" /></Link>
        </div>
        <div className='divider'>
            <h2>Outputs</h2>
            {outputs && outputs.map(output => (
            <div id="output-container" key={output.ID} style={{backgroundColor: color}}>
                <h3><b>{output.Title}</b></h3>
                <div className='goal-meta-title-container'>
                    <img src={effectIcon} alt="" />
                    <h4>Effect</h4>
                </div>
                <p className='output-seeting-effect'>{output.Effect}</p>
                <div className='goal-meta-title-container'>
                    <img src={measureIcon} alt="" />
                    <h4>Meetinstrumenten</h4>
                </div>
                <div>
                    <Instruments output={output}/>
                </div>
                <div className='icon-container-activities'>
                    <img src={settingsIcon} alt="" className="userrole-users-delete-button" data-id={output.ID} onClick={outputLink}/>
                    <img src={deleteIcon} alt="" className="userrole-users-delete-button" data-docid={output.docid} onClick={deleteOutput} />
                </div>
            </div>
            ))}
        </div>
    </div>
    <RightSideBar />
    </div>
  )
}

export default OutputSettings