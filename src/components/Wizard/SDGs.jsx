import LeftSideBar from "../LeftSideBar"
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import MenuStatus from "../../hooks/MenuStatus";
import arrowLeft from '../../images/icons/arrow-left-icon.png'
import arrowRight from '../../images/icons/arrow-right-icon.png'
import capIcon from '../../images/icons/cap-icon.png'
import rocketIcon from '../../images/icons/rocket-icon.png'
import bulbIcon from '../../images/icons/bulb-icon.png'
import feetIcon from '../../images/icons/feet-icon.png'
import { useFirestore, useFirestoreSDGs, useFirestoreSDGsSelected } from "../../firebase/useFirestore";
import { useState, useEffect, useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import { client } from '../../hooks/Client';
import { db, timestamp } from "../../firebase/config.js"
import ButtonClicked from "../../hooks/ButtonClicked";
import deleteIcon from '../../images/icons/delete-icon.png'
import plusButton from '../../images/icons/plus-icon.png'
import firebase from 'firebase'
import uuid from "react-uuid";
import {ReactComponent as QuestionIcon}  from '../../images/icons/question-icon.svg'
import ImpactGuideMenu from "../../hooks/ImpactGuideMenu";

const SDGs = () => {
    const [color, setColor] = useState('')
    const [goalID, setGoalID] = useState('')

    const menuState = MenuStatus()

    const goals = useFirestore('Goals') 
    const colors = useFirestore('Colors')
    const SDGS = useFirestoreSDGs('SDGs')
    const SDGsSelected = useFirestoreSDGsSelected(goalID)

    useEffect(() => {
        colors && colors.forEach(color => {
            const background = color.Background 

            setColor(background)
        })

    },[colors])

    const goalHandler = (e) => {
        const ID = e.target.options[e.target.selectedIndex].dataset.id

        setGoalID(ID)

    }

    const sdgHandler = (e) => {

        const sdg = e.target.options[e.target.selectedIndex].value
        const docid = e.target.dataset.docid

        db.collection('SDGsSelected')
        .doc(docid)
        .update({
            SDG: sdg
        })

    }

    const addSDG = (e) => {

        ButtonClicked(e, 'Opgeslagen')

        db.collection('SDGsSelected')
        .doc()
        .set({
            SDG: '',
            ID: uuid(),
            Timestamp: timestamp,
            Compagny: client,
            GoalID: goalID
        })

    }

    const deleteSDG = (e) => {

        const sdg = e.target.dataset.sdg
        const docid = e.target.dataset.docid

        db.collection('SDGsSelected')
        .doc(docid)
        .delete()
    }

    const displayList = () => {
        if(goalID === ''){
            return 'none'
        } else {
            return 'flex'
        }
    }

  return (
    <div className="main">
    <LeftSideBar />
    <LeftSideBarFullScreen/>
    <div className="main-container" style={{display: menuState}}>
        <div className="page-header">
            <h1>Bijdrage aan SDG's</h1>
            <div className='wizard-sub-nav'>
                <NavLink to={`/${client}/ImpactSociety`} >
                    <div className='step-container'>
                        <img src={arrowLeft} alt="" />
                        <p>Impact op de maatschappij</p>
                    </div>
                </NavLink>  
                {ImpactGuideMenu(8)}
                <NavLink to={`/${client}/Assumptions`} >
                    <div className='step-container'>
                        <p>Aannames</p>
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
                    De SDG’s staan voor de Social Development Goals. Dit zijn 17 ambitieuze maatschappelijke doelen die 
                    door de Verenigde Naties (VN) ten doel zijn gesteld voor 2030.
                    </b></p>
                    <p>De SDG’s zijn een mooie manier om je maatschappelijke impact in een breder kader te plaatsen 
                        en je te verbinden met andere sociale organisaties die soortgelijke impact nastreven.
                    </p>
                    <p>
                    Nadat je de SDG’s hebt geselecteerd die bij jouw organisatie passen kun je in de impactclub 
                    zien welke organisaties eveneens een bijdrage willen zijn aan deze SDG’s.
                    </p>
                    <p>Bekijk <a href="https://deccos.nl/SDGs">hier</a> alle SDG's</p>
                </div>
            </div>
            <div>
                <div className='activity-meta-title-container'>
                    <img src={rocketIcon} alt="" />
                    <h3>Aan de slag</h3>
                </div> 
                <div className='text-section' style={{backgroundColor: color}}>
                    <p><b>1. Selecteer het doel waar je de SDG's aan wilt koppelen</b></p>
                    <select name="" id="" onChange={goalHandler}>
                        <option value="">-- Selecteer een doel --</option>
                    {goals && goals.map(goal => (
                        <option data-docid={goal.docid} data-sdgs={goal.SDG} data-id={goal.ID} value={goal.Title}>{goal.Title}</option>
                    ))}
                    </select>
                    <p><b>2. Selecteer een SDG</b></p>
                    <p>Kies welke van de 17 Social Development Goals (SDG's) van de Verenigde Naties (VN) passen bij dit doel:</p>
                    <div>
                        <div className='list-container' style={{display: displayList()}}>
                            <div className='list-top-row-container'>
                                <img src={plusButton} onClick={addSDG} alt="" />
                            </div>
                            <div className='table-container'>
                                <table>
                                    <tr>
                                        <th>SDG</th>
                                        <th>ACTIE</th>
                                    </tr>
                                    {SDGsSelected && SDGsSelected.map(sdg => (
                                        <tr>
                                            <td>
                                                <select name="" id="" defaultValue={sdg.SDG} data-docid={sdg.docid} onChange={sdgHandler}>
                                                    <option value="">-- Selecteer een SDG --</option>
                                                    {SDGS && SDGS.map(sdg => (
                                                        <option value={sdg.SDG}>{sdg.SDG}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td>
                                                <img className='table-delete-icon' data-docid={sdg.docid} onClick={deleteSDG} src={deleteIcon} alt="" />
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
                    <ol>
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
                    <p>In de volgende stap ga je de aannames omschrijven die je doet bij het toe werken naar je meetbare impact.</p>
                    <NavLink to={`/${client}/Assumptions`} ><button>Volgende stap</button></NavLink>
                </div>
            </div>
        </div> 
    </div>
</div>
  )
}

export default SDGs