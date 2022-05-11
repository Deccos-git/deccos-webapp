import LeftSideBar from "../LeftSideBar"
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import MenuStatus from "../../hooks/MenuStatus";
import arrowLeft from '../../images/icons/arrow-left-icon.png'
import arrowRight from '../../images/icons/arrow-right-icon.png'
import capIcon from '../../images/icons/cap-icon.png'
import rocketIcon from '../../images/icons/rocket-icon.png'
import bulbIcon from '../../images/icons/bulb-icon.png'
import feetIcon from '../../images/icons/feet-icon.png'
import { useFirestore, useFirestoreImpactInstruments } from "../../firebase/useFirestore";
import { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import uuid from 'react-uuid';
import {ReactComponent as QuestionIcon}  from '../../images/icons/question-icon.svg'
import { client } from '../../hooks/Client';
import { NavLink, Link } from "react-router-dom";
import { db, timestamp } from "../../firebase/config.js"
import plusButton from '../../images/icons/plus-icon.png'
import deleteIcon from '../../images/icons/delete-icon.png'

const MeasureOutput = () => {
    const [outputID, setOutputID] = useState('')
    const [outputTitle, setOutputTitle] = useState('')
    const [activityID, setActivityID] = useState('')
    const [activityTitle, setActivityTitle] = useState('')
    const [title, setTitle] = useState('')
    const [singular, setSingular] = useState('')
    const [color, setColor] = useState('')

    const history = useHistory()
    const menuState = MenuStatus() 
    const id = uuid()
    
    const colors = useFirestore('Colors')
    const outputs = useFirestore('Outputs')
    const instruments = useFirestoreImpactInstruments(outputID && outputID)

    useEffect(() => {
        colors && colors.forEach(color => {
            const background = color.Background 

            setColor(background)
        })

    },[colors])

    const outputHandler = (e) => {
        const outputID = e.target.options[e.target.selectedIndex].value
        const outputTitle = e.target.options[e.target.selectedIndex].dataset.title
        const activity = e.target.options[e.target.selectedIndex].dataset.activity
        const activityID = e.target.options[e.target.selectedIndex].dataset.activityid

        setOutputID(outputID)
        setOutputTitle(outputTitle)
        setActivityID(activityID)
        setActivityTitle(activity)
    }

    const addInstrument = () => {

        db.collection('ImpactInstruments')
        .doc()
        .set({
            OutputID: outputID,
            OutputTitle: outputTitle,
            ID: id,
            Compagny: client,
            Timestamp: timestamp,
            Title: '',
            ActivityID: activityID,
            Activity: activityTitle,
            Singular: '',
            Type: 'Manual'
        })
    }

    const titleHandler = (e) => {

        const title = e.target.value 
        const docid = e.target.dataset.docid

        db.collection('ImpactInstruments')
        .doc(docid)
        .update({
            Title: title
        })

    }

    const singularHandler = (e) => {

        const singular = e.target.value 
        const docid = e.target.dataset.docid

        db.collection('ImpactInstruments')
        .doc(docid)
        .update({
            Singular: singular
        })

    }

    const deleteInstrument = (e) => {
        const docid = e.target.dataset.docid

        db.collection('ImpactInstruments')
        .doc(docid)
        .delete()
    }

  return (
    <div className="main">
        <LeftSideBar />
        <LeftSideBarFullScreen/>
        <div className="main-container" style={{display: menuState}}>
            <div className="page-header">
                <h1>Output bijhouden</h1>
                <div className='wizard-sub-nav'>
                    <NavLink to={`/${client}/AddSROI`} >
                        <div className='step-container'>
                            <img src={arrowLeft} alt="" />
                            <p>SROI</p>
                        </div>
                    </NavLink>  
                    <p>16 van de 12</p>
                    <NavLink to={`/${client}/Question`} >
                        <div className='step-container'>
                            <p>Vragenlijsten</p>
                            <img src={arrowRight} alt="" />
                        </div>
                    </NavLink>
                </div>
            </div>
            <div className='profile profile-auth-profile'>
                <div>
                    <div className='activity-meta-title-container'>
                        <img src={capIcon} alt="" />
                        <h3>Uitleg</h3>
                    </div> 
                    <div className='text-section' style={{backgroundColor: color}}>
                        <p>Specifiek, meetbaar, acceptabel, realistisch</p>
                        <p>Om je impactdashboard een beetje kleur te geven kun je een plaatje uploaden dat past bij het doel. Onze tip is om dat niet over te slaan. Ook in de communicatie naar stakeholders helpt een mooi plaatje om het belang van jullie doel over te brengen. Een plaatje zegt meer dan 1000 woorden, toch?</p>
                    </div>
                </div>
                <div>
                    <div className='activity-meta-title-container'>
                        <img src={rocketIcon} alt="" />
                        <h3>Aan de slag</h3>
                    </div> 
                <div className='text-section' style={{backgroundColor: color}}>
                    <p><b>1. Selecteer de output die je bij wilt gaan houden</b></p>
                    <select name="" id="" onChange={outputHandler}>
                        <option value="">-- Selecteer een output --</option>
                        {outputs && outputs.map(output => (
                            <option value={output.ID} data-title={output.Title} data-docid={output.docid} data-activity={output.Activity} data-activityid={output.ActivityID}>{output.Title} (Activiteit: {output.Activity})</option>
                        ))}
                    </select>
                    <div style={{display: outputID ? 'block' : 'none'}}>
                        <p><b>2. Beheer je SROI</b></p>
                        <div className='list-container'>
                            <div className='list-top-row-container'>
                                    <img src={plusButton} alt="" onClick={addInstrument}/>
                            </div>
                            <div className='list-top-row-container'>
                                <p>TITLE</p>
                                <p>ENKELVOUD</p>
                                <p>ACTIE</p>
                            </div>
                            {instruments && instruments.map(instrument => (
                                <div className='list-row-container'>
                                    <input type="text" placeholder='Titel' defaultValue={instrument.Title} data-docid={instrument.docid} onChange={titleHandler}/>
                                    <input type="text" placeholder='Enkelvoud' defaultValue={instrument.Singular} data-docid={instrument.docid} onChange={singularHandler} />
                                    <img data-docid={instrument.docid} onClick={deleteInstrument} src={deleteIcon} alt="" />
                                </div>  
                            ))}
                        </div>
                    </div>
                </div>
            </div>
                <div>
                    <div className='activity-meta-title-container'>
                        <img src={bulbIcon} alt="" />
                        <h3>Tips</h3>
                    </div> 
                    <div className='text-section' style={{backgroundColor: color}}>
                        <ol>
                            <li>Kom je er niet uit of heb je behoefte aan ondersteuning van een impactexpert? 
                                Klik op het <QuestionIcon style={{width: '19px', height: '19px'}}/> icon in de 
                                bovenbalk (onderbalk op mobiel) voor alle ondersteuningsmogelijkheden.</li>
                        </ol>
                    </div>
                </div>
                <div>
                    <div className='activity-meta-title-container'>
                        <img src={feetIcon} alt="" />
                        <h3>Volgende stap</h3>
                    </div> 
                    <div className='text-section' style={{backgroundColor: color}}>
                        <p>In de volgende stap ga je een probleemanalyse maken.</p>
                        <button>Volgende stap</button>
                    </div>
                </div>
            </div> 
        </div>
    </div>
  )
}

export default MeasureOutput