import LeftSideBar from "../LeftSideBar"
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import MenuStatus from "../../hooks/MenuStatus";
import arrowLeft from '../../images/icons/arrow-left-icon.png'
import arrowRight from '../../images/icons/arrow-right-icon.png'
import capIcon from '../../images/icons/cap-icon.png'
import rocketIcon from '../../images/icons/rocket-icon.png'
import bulbIcon from '../../images/icons/bulb-icon.png'
import feetIcon from '../../images/icons/feet-icon.png'
import { useFirestore, useFirestoreImpactSociety } from "../../firebase/useFirestore";
import { useState, useEffect, useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import { client } from '../../hooks/Client';
import { db, timestamp } from "../../firebase/config.js"
import ButtonClicked from "../../hooks/ButtonClicked";
import {ReactComponent as QuestionIcon}  from '../../images/icons/question-icon.svg'
import ImpactGuideMenu from "../../hooks/ImpactGuideMenu";
import dashboardIcon from '../../images/icons/dashboard-icon.png'
import eyeIcon from '../../images/icons/eye-icon.png'
import ScrollToTop from "../../hooks/ScrollToTop";
import { SavedIcon } from "../../StateManagment/SavedIcon";
import deleteIcon from '../../images/icons/delete-icon.png'
import plusButton from '../../images/icons/plus-icon.png'
import uuid from 'react-uuid';

const ImpactSociety = () => {
    const [saved, setSaved] = useContext(SavedIcon)

    const [goalId, setGoalId] = useState(null)

    const menuState = MenuStatus()
    ScrollToTop()
    
    const goals = useFirestore('Goals')
    const impactSociety = useFirestoreImpactSociety(goalId && goalId)

    const goalHandler = (e) => {

        const id = e.target.options[e.target.selectedIndex].dataset.id

        setGoalId(id)

    }
    const addImpactSociety = (e) => {

        db.collection('ImpactSociety')
        .doc()
        .set({
            ID: uuid(),
            CompagnyID: client,
            GoalID: goalId,
            Timestamp: timestamp,
            ImpactSociety: ''
        })
    }

    const titleHandler = (e) => {

        const docid = e.target.dataset.docid 
        const impact = e.target.value

        db.collection('ImpactSociety')
        .doc(docid)
        .update({
            ImpactSociety: impact
        })
        .then(() => {
            setSaved('flex')
         })
    }

    const deleteImpactSociety = (e) => {

        const docid = e.target.dataset.docid 

        db.collection('ImpactSociety')
        .doc(docid)
        .delete()

    }

  return (
    <div className="main">
    <LeftSideBar />
    <LeftSideBarFullScreen/>
    <div className="main-container" style={{display: menuState}}>
        <div className="page-header">
            <h1>Impact op de maatschappij</h1>
            <div className='wizard-sub-nav'>
                <NavLink to={`/${client}/ImpactTargetgroup`} >
                    <div className='step-container'>
                        <img src={arrowLeft} alt="" />
                        <p>Impact op de doelgroep</p>
                    </div>
                </NavLink>  
                {ImpactGuideMenu(7)}
                <NavLink to={`/${client}/SDGs`} >
                    <div className='step-container'>
                        <p>Bijdrage aan SDG's</p>
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
                    <p><b>
                        Wanneer de impact op de doelgroep is verwezenlijkt, welke impact heeft dat dan op de maatschappij in zijn geheel?
                    </b></p>
                    <p>
                        Bij het bepalen van jullie impact op de maatschappij is het minder relevant dat de impact concreet en meetbaar is. 
                        Het gaat vaak om bredere maatschappelijke effecten.
                    </p>
                </div>
            </div>
            <div>
                <div className='activity-meta-title-container'>
                    <img src={rocketIcon} alt="" />
                    <h3>Aan de slag</h3>
                </div> 
                <div className='text-section'>
                    <p><b>1. Selecteer het doel waar je de impact op de maatschappij aan wilt koppelen</b></p>
                    <select name="" id="" onChange={goalHandler}>
                        <option value="">-- Selecteer een doel --</option>
                    {goals && goals.map(goal => (
                        <option data-id={goal.ID} value={goal.Title}>{goal.Title}</option>
                    ))}
                    </select>
                    <div style={{display: goalId ? 'block': 'none'}}>
                        <p><b>2. Voeg impact op de maatschappij toe</b></p>
                        <div className='list-container'>
                            <div className='list-top-row-container'>
                                    <img src={plusButton} onClick={addImpactSociety} alt="" />
                            </div>
                            <div className='table-container'>
                                <table>
                                    <tr>
                                        <th>IMPACT OP DOELGROEP</th>
                                        <th>DELETE</th>
                                    </tr>
                                    {impactSociety && impactSociety.map(impact => (
                                        <tr key={impact.ID}>
                                            <td>
                                                <input type="text" data-docid={impact.docid} defaultValue={impact.ImpactSociety} placeholder='Impact op maatschappij' onChange={titleHandler} />
                                            </td>
                                            <td>
                                                <img className='table-delete-icon' data-docid={impact.docid} onClick={deleteImpactSociety} src={deleteIcon} alt="" />
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
                    <p><b>Je kunt je impact op de maatschappij hier terug vinden:</b></p>
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
                    <p>In de volgende stap ga je de bijdrage van jullie organisatie aan de SDG's bepalen.</p>
                    <NavLink to={`/${client}/SDGs`} ><button>Volgende stap</button></NavLink>
                </div>
            </div>
        </div> 
    </div>
</div>
  )
}

export default ImpactSociety