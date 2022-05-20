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
        const docid = e.target.options[e.target.selectedIndex].dataset.docid 
        const type = e.target.options[e.target.selectedIndex].value

        db.collection('SROIs')
        .doc(docid)
        .update({
            Type: type,
            Amount: amount
        })
        
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
            Type: '',
            Amount: 0,
            Deadweight: 0.75,
            Attribution: 0.75,
            Timehorizon: 2.5
        })
    }

    const deadweightHandler = (e) => {

        const docid = e.target.dataset.docid 
        const deadweight = e.target.value 

        db.collection('SROIs')
        .doc(docid)
        .update({
            Deadweight: deadweight 
        })

    }

    const attributionHandler = (e) => {

        const docid = e.target.dataset.docid 
        const attribution = e.target.value 

        db.collection('SROIs')
        .doc(docid)
        .update({
            Attribution: attribution
        })

    }


    const timehorizonHandler = (e) => {

        const docid = e.target.dataset.docid 
        const timehorizon = e.target.value 

        db.collection('SROIs')
        .doc(docid)
        .update({
            Timehorizon: timehorizon
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
                        <p>Mijlpalen stellen</p>
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
                   <p><b>
                        SROI staat voor Social Return On Investment. Dit is een methodiek om jullie impact financieel door te rekenen. 
                    </b></p>
                    <p>
                        SROI is niet voor iedere activiteit relevant. Soms moeten er zoveel aannames worden 
                        gedaan om een specifiek soort impact financieel door te rekenen dat het weinig toegevoegde waarde heeft.
                    </p>
                    <p>
                        Omdat het maken van een SROI berekening een vak apart is heeft Deccos een groeiend aantal voor 
                        uitgerekende SROI waardes toegevoegd als uitgangspunt. Bij het berekenen hiervan zijn aannames gedaan. 
                        Deze zijn hier te vinden onder onze open source meetinstrumenten.
                    </p>
                    <p>
                        Naast de doorgerekende SROI waardes zijn er een aantal die per activiteit verschillen en die nog moeten worden ingevuld.
                    </p>
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
                    <div className='table-container'>
                        <table>
                            <tr>
                                <th>TYPE</th>
                                <th>DEADWEIGHT (%)</th>
                                <th>ATTRUBUTIE (%)</th>
                                <th>TIJDSHORIZON (jaren)</th>
                                <th>BEDRAG (€)</th>
                                <th>TOTAAL (€)</th>
                                <th>ACTIE</th>
                            </tr>
                            {SROIs && SROIs.map(SROI => (
                            <tr>
                                <td>
                                <select name="" id="" defaultValue={SROI.Type} onChange={SROISetHandler}>
                                    <option value="">-- Selecteer een SROI type --</option>
                                    {SROISets && SROISets.map(set => (
                                        <option data-docid={SROI.docid} data-amount={set.Amount} value={set.Type}>{set.Type}</option>
                                    ))}
                                </select>
                                </td>
                                <td>
                                    <input type="text" placeholder='Deadweight' defaultValue={SROI.Deadweight} data-docid={SROI.docid} onChange={deadweightHandler} />
                                </td>
                                <td>
                                    <input type="text" placeholder='Attributie' defaultValue={SROI.Attribution} data-docid={SROI.docid} onChange={attributionHandler} />
                                </td>
                                <td>
                                    <input type="text" placeholder='Tijdshorizon' defaultValue={SROI.Timehorizon} data-docid={SROI.docid} onChange={timehorizonHandler} />
                                </td>
                                <td>
                                    <p defaultValue={SROI.Amount}>€{SROI.Amount}</p>
                                </td>
                                <td>
                                    <p>€{SROI.Amount*SROI.Deadweight*SROI.Attribution*SROI.Timehorizon}</p>  
                                </td>
                                <td>
                                    <img className='table-delete-icon' data-docid={SROI.docid} onClick={deleteSROI} src={deleteIcon} alt="" />
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