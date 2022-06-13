import LeftSideBar from "../LeftSideBar"
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import MenuStatus from "../../hooks/MenuStatus";
import arrowLeft from '../../images/icons/arrow-left-icon.png'
import arrowRight from '../../images/icons/arrow-right-icon.png'
import capIcon from '../../images/icons/cap-icon.png'
import rocketIcon from '../../images/icons/rocket-icon.png'
import bulbIcon from '../../images/icons/bulb-icon.png'
import feetIcon from '../../images/icons/feet-icon.png'
import { useFirestore, useFirestoreSDGs, useFirestoreAssumptions } from "../../firebase/useFirestore";
import { useState, useEffect, useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import { client } from '../../hooks/Client';
import { db, timestamp } from "../../firebase/config.js"
import ButtonClicked from "../../hooks/ButtonClicked";
import deleteIcon from '../../images/icons/delete-icon.png'
import plusButton from '../../images/icons/plus-icon.png'
import {ReactComponent as QuestionIcon}  from '../../images/icons/question-icon.svg'
import uuid from "react-uuid";
import ImpactGuideMenu from "../../hooks/ImpactGuideMenu";
import dashboardIcon from '../../images/icons/dashboard-icon.png'
import eyeIcon from '../../images/icons/eye-icon.png'
import ScrollToTop from "../../hooks/ScrollToTop";

const Assumptions = () => {
    const [goalID, setGoalID] = useState('')

    const menuState = MenuStatus()
    ScrollToTop()

    const goals = useFirestore('Goals') 
    const SDGS = useFirestoreSDGs('SDGs')
    const assumptions = useFirestoreAssumptions(goalID)

    const goalHandler = (e) => {
        const ID = e.target.options[e.target.selectedIndex].dataset.id

        setGoalID(ID)

    }

    const assumptionHandler = (e) => {

        const assumption = e.target.value
        const docid = e.target.dataset.docid

        db.collection('Assumptions')
        .doc(docid)
        .update({
            Assumption: assumption
        })

    }

    const addAssumption = (e) => {

        ButtonClicked(e, 'Opgeslagen')

        db.collection('Assumptions')
        .doc()
        .set({
            Assumption: '',
            ID: uuid(),
            Timestamp: timestamp,
            Compagny: client,
            CompagnyID: client,
            GoalID: goalID
        })

    }

    const deleteAssumption = (e) => {

        const docid = e.target.dataset.docid

        db.collection('Assumptions')
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
            <h1>Aannames</h1>
            <div className='wizard-sub-nav'>
                <NavLink to={`/${client}/SDGs`} >
                    <div className='step-container'>
                        <img src={arrowLeft} alt="" />
                        <p>Bijdrage aan SDG's</p>
                    </div>
                </NavLink>  
                {ImpactGuideMenu(9)}
                <NavLink to={`/${client}/Conditions`} >
                    <div className='step-container'>
                        <p>Externe factoren</p>
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
                    De aannames zijn de zaken die noodzakelijk zijn om je impact doel te bereiken, 
                    maar waarvan je slechts aanneemt dat ze kloppen.
                    </b></p>
                    <p>
                    Het geeft helderheid om inzicht te hebben in je aannames, omdat dit je een completer beeld geeft 
                    van de verschillende aspecten van je veranderplan en je een richting geeft om naar te kijken wanneer er 
                    minder impact wordt behaald dan jullie wensen.
                    </p>
                </div>
            </div>
            <div>
                <div className='activity-meta-title-container'>
                    <img src={rocketIcon} alt="" />
                    <h3>Aan de slag</h3>
                </div> 
                <div className='text-section'>
                    <p><b>1. Selecteer het doel waar je de aannames aan wilt koppelen</b></p>
                    <select name="" id="" onChange={goalHandler}>
                        <option value="">-- Selecteer een doel --</option>
                    {goals && goals.map(goal => (
                        <option data-docid={goal.docid} data-sdgs={goal.SDG} data-id={goal.ID} value={goal.Title}>{goal.Title}</option>
                    ))}
                    </select>
                    <div style={{display: goalID === '' ? 'none' : 'block'}}>
                        <p><b>2. Beheer je aannames</b></p>
                        <div>
                            <div className='list-container' style={{display: displayList()}}>
                                <div className='list-top-row-container'>
                                    <img src={plusButton} onClick={addAssumption} alt="" />
                                </div>
                                <div className='table-container'>
                                    <table>
                                        <tr>
                                            <th>AANNAME</th>
                                            <th>VERWIJDER</th>
                                        </tr>
                                        {assumptions && assumptions.map(assumption => (
                                            <tr key={assumption.ID}>
                                                <td>
                                                    <input type="text" defaultValue={assumption.Assumption} data-docid={assumption.docid} placeholder='Noteer hier de aanname' onChange={assumptionHandler}/>
                                                </td>
                                                <td>
                                                    <img className='table-delete-icon' data-docid={assumption.docid} onClick={deleteAssumption} src={deleteIcon} alt="" />
                                                </td>
                                            </tr>
                                    ))}
                                    </table>
                                </div>
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
                    <p><b>Je kunt je aannames hier terug vinden:</b></p>
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
                    <p>In de volgende stap ga je de externe factoren omschrijven die van invloed zijn op je meetbare impact.</p>
                    <NavLink to={`/${client}/Conditions`} ><button>Volgende stap</button></NavLink>
                </div>
            </div>
        </div> 
    </div>
</div>
  )
}

export default Assumptions