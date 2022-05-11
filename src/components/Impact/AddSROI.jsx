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
import { useFirestore, useFirestoreSROIs, useFirestoreSROISets } from "../../firebase/useFirestore";
import AddQuestionnaire from "./AddQuestionnaire";
import { useHistory } from "react-router-dom";
import arrowLeft from '../../images/icons/arrow-left-icon.png'
import arrowRight from '../../images/icons/arrow-right-icon.png'
import capIcon from '../../images/icons/cap-icon.png'
import rocketIcon from '../../images/icons/rocket-icon.png'
import bulbIcon from '../../images/icons/bulb-icon.png'
import feetIcon from '../../images/icons/feet-icon.png'
import { NavLink, Link } from "react-router-dom";
import plusButton from '../../images/icons/plus-icon.png'
import deleteIcon from '../../images/icons/delete-icon.png'

const AddSROI = () => {
    const [outputID, setOutputID] = useState('')
    const [outputTitle, setOutputTitle] = useState('')
    const [color, setColor] = useState('')
    const [amount, setAmount] = useState(0)
    const [total, setTotal] = useState(0)

    const menuState = MenuStatus()
    const history = useHistory()

    const outputs = useFirestore('Outputs')
    const SROIs = useFirestoreSROIs(outputID && outputID)
    const SROISets = useFirestoreSROISets()
    const colors = useFirestore('Colors')

    useEffect(() => {
        colors && colors.forEach(color => {
            const background = color.Background 

            setColor(background)
        })

    },[colors])


    const outputHandler = (e) => {
        const outputID = e.target.options[e.target.selectedIndex].value
        const outputTitle = e.target.options[e.target.selectedIndex].dataset.title

        setOutputID(outputID)
        setOutputTitle(outputTitle)
    }

    const SROISetHandler = (e) => {

        const amount = e.target.options[e.target.selectedIndex].dataset.amount 

        setAmount(amount)
        
    }

    const addSROI = (e) => {

        ButtonClicked(e, 'Opgeslagen')

        const id = uuid()

        db.collection('SROIs')
        .doc()
        .set({
            ID: id,
            Compagny: client,
            Timestamp: timestamp,
            Output: outputTitle,
            OutputID: outputID,
            SROI: ''
        })
    }

    const deleteSROI = (e) => {
        const docid = e.target.dataset.docid

        db.collection('SROIs')
        .doc(docid)
        .delete()
    }

  return (
    <div className="main">
    <LeftSideBar />
    <LeftSideBarFullScreen/>
    <div className="main-container" style={{display: menuState}}>
        <div className="page-header">
            <h1>SROI</h1>
            <div className='wizard-sub-nav'>
                <NavLink to={`/${client}/OutputEffects`} >
                    <div className='step-container'>
                        <img src={arrowLeft} alt="" />
                        <p>Effecten van output</p>
                    </div>
                </NavLink>  
                <p>14 van de 12</p>
                <NavLink to={`/${client}/MeasureOutput`} >
                    <div className='step-container'>
                        <p>Outputs bijhouden</p>
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
                    <p>Om je impactdashboard een beetje kleur te geven kun je een plaatje uploaden dat past bij het doel. 
                        Onze tip is om dat niet over te slaan. Ook in de communicatie naar stakeholders 
                        helpt een mooi plaatje om het belang van jullie doel over te brengen. 
                        Een plaatje zegt meer dan 1000 woorden, toch? 
                        <a href="https://www.pexels.com/nl-nl/"> Hier</a> vind je een heleboel mooie plaatjes die je gratis kunt gebruiken.</p>
                </div>
            </div>
        <div>
        <div className='activity-meta-title-container'>
            <img src={rocketIcon} alt="" />
            <h3>Aan de slag</h3>
        </div> 
        <div className='text-section' style={{backgroundColor: color}}>
            <p><b>1. Selecteer de output waar je de SROI aan wilt koppelen</b></p>
            <select name="" id="" onChange={outputHandler}>
                <option value="">-- Selecteer een output --</option>
                {outputs && outputs.map(output => (
                    <option value={output.ID} data-title={output.Title} data-docid={output.docid}>{output.Title} (Activiteit: {output.Activity})</option>
                ))}
            </select>
            <div style={{display: outputID ? 'block' : 'none'}}>
                <p><b>2. Beheer je SROI</b></p>
                <div className='list-container'>
                    <div className='list-top-row-container'>
                            <img src={plusButton} alt="" onClick={addSROI}/>
                    </div>
                    <div className='list-top-row-container'>
                        <p>TYPE</p>
                        <p>DEADWEIGHT</p>
                        <p>ATTRUBUTIE</p>
                        <p>TIJDSHORIZON</p>
                        <p>BEDRAG</p>
                        <p>TOTAAL</p>
                        <p>ACTIE</p>
                    </div>
                    {SROIs && SROIs.map(SROI => (
                        <div className='list-row-container'>
                            <select name="" id="" onChange={SROISetHandler}>
                                <option value="">-- Selecteer een SROI type --</option>
                                {SROISets && SROISets.map(set => (
                                    <option data-amount={set.Amount} value={set.Type}>{set.Type}</option>
                                ))}
                            </select>
                            <input type="text" placeholder='Vul deadweight in' />
                            <input type="text" placeholder='Vul attributie in' />
                            <input type="text" placeholder='Vul tijdshorizon in' />
                            <p>{amount}</p>
                            <p>{total}</p>
                            <img data-docid={SROI.docid} onClick={deleteSROI} src={deleteIcon} alt="" />
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
                    <p>1. Kom je er niet uit of heb je behoefte aan een second opinion van een impactexpert? Twijfel niet en klik hier.</p>
                    <p>2. Voeg een sprekend plaatje toe om het belang van jullie doel kracht bij te zetten. <a href="https://www.pexels.com/nl-nl/">Hier</a> vind je een heleboel mooie plaatjes die je gratis kunt gebruiken.</p>
                </div>
            </div>
            <div>
                <div className='activity-meta-title-container'>
                    <img src={feetIcon} alt="" />
                    <h3>Volgende stap</h3>
                </div> 
                <div className='text-section' style={{backgroundColor: color}}>
                    <p>In de volgende stap ga je de impactdoelen plannen in de tijd.</p>
                    <button>Volgende stap</button>
                </div>
            </div>
            </div>
        </div>
    </div>
  )
}

export default AddSROI