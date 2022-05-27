import LeftSideBar from "../LeftSideBar";
import LeftSideBarFullScreen from "../LeftSideBarFullScreen";
import MenuStatus from "../../hooks/MenuStatus";
import { client } from "../../hooks/Client"
import { useState, useEffect, useContext } from 'react'
import ButtonClicked from "../../hooks/ButtonClicked";
import { db, timestamp } from "../../firebase/config.js"
import uuid from 'react-uuid';
import { Auth } from '../../StateManagment/Auth';
import Location from "../../hooks/Location"
import { useFirestore, useFirestoreOutputEffects } from "../../firebase/useFirestore";
import {ReactComponent as QuestionIcon}  from '../../images/icons/question-icon.svg'
import arrowLeft from '../../images/icons/arrow-left-icon.png'
import arrowRight from '../../images/icons/arrow-right-icon.png'
import capIcon from '../../images/icons/cap-icon.png'
import rocketIcon from '../../images/icons/rocket-icon.png'
import bulbIcon from '../../images/icons/bulb-icon.png'
import feetIcon from '../../images/icons/feet-icon.png'
import { NavLink, Link } from "react-router-dom";
import plusButton from '../../images/icons/plus-icon.png'
import deleteIcon from '../../images/icons/delete-icon.png'
import ImpactGuideMenu from "../../hooks/ImpactGuideMenu";
import eyeIcon from '../../images/icons/eye-icon.png'
import dashboardIcon from '../../images/icons/dashboard-icon.png'
import outputIcon from '../../images/icons/output-icon.png'

const OutputEffects = () => {
    const [outputID, setOutputID] = useState(null)
    const [outputTitle, setOutputTitle] = useState('')
    const [color, setColor] = useState('')

    const menuState = MenuStatus()

    const outputs = useFirestore('Outputs')
    const effects = useFirestoreOutputEffects(outputID)
    const colors = useFirestore('Colors')

    useEffect(() => {
        colors && colors.forEach(color => {
            const background = color.Background 

            setColor(background)
        })

    },[colors])

    const outputHandler = (e) => {
        const outputID = e.target.options[e.target.selectedIndex].dataset.id
        const outputTitle = e.target.options[e.target.selectedIndex].dataset.title

        setOutputID(outputID)
        setOutputTitle(outputTitle)
    }

    const effectHandler = (e) => {
        const effect = e.target.value 
        const docid = e.target.dataset.docid

        db.collection('OutputEffects')
        .doc(docid)
        .update({
            Effect: effect
        })
    }

    const addEffect = (e) => {
    
        db.collection('OutputEffects')
        .doc()
        .set({
            ID: uuid(),
            Compagny: client,
            Timestamp: timestamp,
            Output: outputTitle,
            OutputID: outputID,
            Effect: '',
        })
    }

    const deleteEffect = (e) => {

        const docid = e.target.dataset.docid

        db.collection('OutputEffects')
        .doc(docid)
        .delete()

    }


  return (
    <div className="main">
    <LeftSideBar />
    <LeftSideBarFullScreen/>
    <div className="main-container" style={{display: menuState}}>
        <div className="page-header">
            <h1>Effecten van output</h1>
            <div className='wizard-sub-nav'>
                <NavLink to={`/${client}/AddOutput`} >
                    <div className='step-container'>
                        <img src={arrowLeft} alt="" />
                        <p>Outputs</p>
                    </div>
                </NavLink>  
                {ImpactGuideMenu(14)}
                <NavLink to={`/${client}/AddSROI`} >
                    <div className='step-container'>
                        <p>SROI</p>
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
                    <p><b>Wat zijn de concrete en meetbare effecten die jullie doelgroep ervaart 
                        aan de hand van jullie activiteiten?
                    </b></p>
                    <p>Deze directe effecten werken uiteindelijk door in de impact van je activiteit. 
                        De effecten kunnen zowel positief als negatief zijn.
                    </p>
                </div>
            </div>
        <div>
        <div className='activity-meta-title-container'>
            <img src={rocketIcon} alt="" />
            <h3>Aan de slag</h3>
        </div> 
        <div className='text-section' style={{backgroundColor: color}}>
            <div>
                <p><b>1. Selecteer de output waar je het effect aan wilt koppelen</b></p>
                <select name="" id="" onChange={outputHandler}>
                    <option data-id={''} data-title={''} value="">-- Selecteer een output --</option>
                {outputs && outputs.map(output => (
                    <option data-docid={output.docid} data-id={output.ID} data-title={output.Title}>{output.Title} (Activiteit: {output.Activity})</option>
                ))}
                </select>
            </div>
                <div style={{display: outputID ? 'block' : 'none'}}>
                    <p><b>2. Beheer je effecten</b></p>
                    <div className='list-container'>
                        <div className='list-top-row-container'>
                                <img src={plusButton} alt="" onClick={addEffect}/>
                        </div>
                        <div className='table-container'>
                            <table>
                                <tr>
                                    <th>EFFECT</th>
                                    <th>VERWIJDER</th>
                                </tr>
                                {effects && effects.map(effect => (
                                    <tr key={effect.ID}>
                                        <td>
                                            <input type="text" data-docid={effect.docid} defaultValue={effect.Effect} placeholder='Effect' onChange={effectHandler} />
                                        </td>
                                        <td>
                                            <img className='table-delete-icon' data-docid={effect.docid} onClick={deleteEffect} src={deleteIcon} alt="" />
                                        </td>
                                    </tr>
                                ))}
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            <div>
                <div className='activity-meta-title-container'>
                    <img src={eyeIcon} alt="" />
                    <h3>Bekijk</h3>
                </div> 
                <div className='text-section' style={{backgroundColor: color}}>
                    <p><b>Je kunt je effecten van de outputs hier terug vinden:</b></p>
                    <div className="channel-inner-div">
                        <div className='activity-meta-title-container'>
                            <img src={outputIcon} alt="" />
                            <NavLink activeClassName='active' to={`/${client}/OutputSettings`}>Outputs</NavLink>
                        </div>
                    </div>
                    <div className="channel-inner-div">
                        <div className='activity-meta-title-container'>
                            <img src={dashboardIcon} alt="" />
                            <NavLink activeClassName='active' to={`/${client}/ImpactProgress`}>Dashboard</NavLink>
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
                        <li>
                            Zorg ervoor dat de effecten concreet en meetbaar zijn.
                        </li>
                        <li>
                            Kom je er niet uit of heb je behoefte aan ondersteuning van een impactexpert? 
                            Klik op het 
                            <NavLink to={`/${client}/Support`} >
                                <QuestionIcon style={{width: '19px', height: '19px'}}/> 
                            </NavLink>
                            icon in de 
                            bovenbalk (onderbalk op mobiel) voor alle ondersteuningsmogelijkheden.
                        </li>
                        <li>Benieuwd naar de impact van andere sociale MKB'ers? Neem eens een kijkje in de <a href="https://deccos.nl/Milestones">Deccos Impactclub</a>.</li>
                    </ol>
                </div>
            </div>
            <div>
                <div className='activity-meta-title-container'>
                    <img src={feetIcon} alt="" />
                    <h3>Volgende stap</h3>
                </div> 
                <div className='text-section' style={{backgroundColor: color}}>
                    <p>In de volgende stap ga je een Social Return on Investement (SROI) toevoegen.</p>
                    <NavLink to={`/${client}/AddSROI`} ><button>Volgende stap</button></NavLink> 
                </div>
            </div>
            </div>
        </div>
    </div>
  )
}

export default OutputEffects
