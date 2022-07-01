import LeftSideBar from "../LeftSideBar"
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import MenuStatus from "../../hooks/MenuStatus";
import arrowLeft from '../../images/icons/arrow-left-icon.png'
import arrowRight from '../../images/icons/arrow-right-icon.png'
import capIcon from '../../images/icons/cap-icon.png'
import rocketIcon from '../../images/icons/rocket-icon.png'
import bulbIcon from '../../images/icons/bulb-icon.png'
import feetIcon from '../../images/icons/feet-icon.png'
import { useFirestore, useFirestoreImpactTargetgroup } from "../../firebase/useFirestore";
import { useState, useEffect, useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import { client } from '../../hooks/Client';
import { db, timestamp } from "../../firebase/config.js"
import ButtonClicked from "../../hooks/ButtonClicked";
import {ReactComponent as QuestionIcon}  from '../../images/icons/question-icon.svg'
import ImpactGuideMenu from "../../hooks/ImpactGuideMenu";
import eyeIcon from '../../images/icons/eye-icon.png'
import dashboardIcon from '../../images/icons/dashboard-icon.png'
import ScrollToTop from "../../hooks/ScrollToTop";
import { SavedIcon } from "../../StateManagment/SavedIcon";
import deleteIcon from '../../images/icons/delete-icon.png'
import plusButton from '../../images/icons/plus-icon.png'
import uuid from 'react-uuid';

const ImpactTargetgroup = () => {
    const [saved, setSaved] = useContext(SavedIcon)

    const [goalId, setGoalId] = useState(null)
    const [targetgroup, setTargetgroup] = useState(null)

    const menuState = MenuStatus()
    ScrollToTop()
    
    const goals = useFirestore('Goals')
    const impactTargetgroups = useFirestoreImpactTargetgroup(goalId && goalId)

    const goalHandler = (e) => {

        const targetgroup = e.target.options[e.target.selectedIndex].dataset.targetgroup 
        const id = e.target.options[e.target.selectedIndex].dataset.id

        setTargetgroup(targetgroup)
        setGoalId(id)

    }

    const addImpactTargetgroup = (e) => {

        db.collection('ImpactTargetgroup')
        .doc()
        .set({
            ID: uuid(),
            CompagnyID: client,
            GoalID: goalId,
            Timestamp: timestamp,
            ImpactTargetgroup: ''
        })
    }

    const displayTargetgroup = () => {
        if(targetgroup === null){
            return 'Selecteer een doel'
        } else if(targetgroup === ''){
            return 'Creeer eerste een doelgroep voor dit doel'
        } else if(targetgroup === undefined){
            return 'Selecteer een doel'
        } else {
            return targetgroup
        }
    }

    const titleHandler = (e) => {

        const docid = e.target.dataset.docid 
        const impact = e.target.value

        db.collection('ImpactTargetgroup')
        .doc(docid)
        .update({
            ImpactTargetgroup: impact
        })
        .then(() => {
            setSaved('flex')
         })
    }

    const deleteImpactTargetgroup = (e) => {

        const docid = e.target.dataset.docid 

        db.collection('ImpactTargetgroup')
        .doc(docid)
        .delete()

    }


  return (
    <div className="main">
    <LeftSideBar />
    <LeftSideBarFullScreen/>
    <div className="main-container" style={{display: menuState}}>
        <div className="page-header">
            <h1>Impact op doelgroep</h1>
            <div className='wizard-sub-nav'>
                <NavLink to={`/${client}/Targetgroup`} >
                    <div className='step-container'>
                        <img src={arrowLeft} alt="" />
                        <p>Doelgroep bepalen</p>
                    </div>
                </NavLink>  
                {ImpactGuideMenu(6)}
                <NavLink to={`/${client}/ImpactSociety`} >
                    <div className='step-container'>
                        <p>Impact op maatschappij</p>
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
                <div className='text-section'>
                    <p><b>De impact die je hoopt te hebben op je doelgroep zijn de positieve 
                        effecten die je met jullie activiteiten (diensten en/of producten) beoogd te hebben op je doelgroep.</b></p>
                    <p>Deze impact moet concreet en meetbaar zijn. Ook moet de impact zoveel mogelijk op jullie activiteiten 
                        kunnen worden toegeschreven.</p>
                </div>
            </div>
            <div>
                <div className='activity-meta-title-container'>
                    <img src={rocketIcon} alt="" />
                    <h3>Aan de slag</h3>
                </div> 
                <div className='text-section'>
                    <p><b>1. Selecteer het doel waar je de impact op de doelgroep aan wilt koppelen</b></p>
                    <select name="" id="" onChange={goalHandler}>
                        <option value="">-- Selecteer een doel --</option>
                    {goals && goals.map(goal => (
                        <option data-docid={goal.docid} data-id={goal.ID} data-targetgroup={goal.Targetgroup} value={goal.Title}>{goal.Title}</option>
                    ))}
                    </select>
                    <p>Doelgroep: {displayTargetgroup()}</p>
                    <div style={{display: goalId ? 'block': 'none'}}>
                        <p><b>2. Voeg impact op de doelgroep toe</b></p>
                        <div className='list-container'>
                            <div className='list-top-row-container'>
                                    <img src={plusButton} onClick={addImpactTargetgroup} alt="" />
                            </div>
                            <div className='table-container'>
                                <table>
                                    <tr>
                                        <th>IMPACT OP DOELGROEP</th>
                                        <th>DELETE</th>
                                    </tr>
                                    {impactTargetgroups && impactTargetgroups.map(impact => (
                                        <tr key={impact.ID}>
                                            <td>
                                                <input type="text" data-docid={impact.docid} defaultValue={impact.ImpactTargetgroup} placeholder='Impact op doelgroep' onChange={titleHandler} />
                                            </td>
                                            <td>
                                                <img className='table-delete-icon' data-docid={impact.docid} onClick={deleteImpactTargetgroup} src={deleteIcon} alt="" />
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
                <div className='text-section'>
                    <p><b>Je kunt je impact op de doelgroep hier terug vinden:</b></p>
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
                <div className='text-section'>
                    <ol>
                        <li>
                            Zorg ervoor dat de impact op de doelgroep concreet is beschreven en meetbaar is.
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
                <div className='text-section'>
                    <p>In de volgende stap ga je de impact van jullie organisatie op de maatschappij omschrijven.</p>
                    <NavLink to={`/${client}/ImpactSociety`} ><button>Volgende stap</button></NavLink>
                </div>
            </div>
        </div> 
    </div>
</div>
  )
}

export default ImpactTargetgroup