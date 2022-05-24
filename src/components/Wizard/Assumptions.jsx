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
import firebase from 'firebase'
import uuid from "react-uuid";

const Assumptions = () => {
    const [color, setColor] = useState('')
    const [goalID, setGoalID] = useState('')

    const menuState = MenuStatus()

    const goals = useFirestore('Goals') 
    const colors = useFirestore('Colors')
    const SDGS = useFirestoreSDGs('SDGs')
    const assumptions = useFirestoreAssumptions(goalID)

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
                <p>9 van de 12</p>
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
                <div className='text-section' style={{backgroundColor: color}}>
                    <p><b>
                    De aannames zijn de zaken die noodzakelijk zijn om je impact doel te bereiken, 
                    maar waarvan je slechts aanneemt dat ze kloppen.
                    </b></p>
                    <p>
                    Het geeft helderheid om inzicht te hebben in je aannames, omdat dit je een completer beeld geeft 
                    van de verschillende aspecten van je veranderplan en je een richting geeft om op te kijken wanneer er 
                    minder impact wordt behaald dat jullie wensen.
                    </p>
                </div>
            </div>
            <div>
                <div className='activity-meta-title-container'>
                    <img src={rocketIcon} alt="" />
                    <h3>Aan de slag</h3>
                </div> 
                <div className='text-section' style={{backgroundColor: color}}>
                    <p><b>1. Selecteer het doel waar je de aannames aan wilt koppelen</b></p>
                    <select name="" id="" onChange={goalHandler}>
                        <option value="">-- Selecteer een doel --</option>
                    {goals && goals.map(goal => (
                        <option data-docid={goal.docid} data-sdgs={goal.SDG} data-id={goal.ID} value={goal.Title}>{goal.Title}</option>
                    ))}
                    </select>
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
                                        <th>ACTIE</th>
                                    </tr>
                                    {assumptions && assumptions.map(assumption => (
                                        <tr>
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

export default Assumptions