import LeftSideBar from "../LeftSideBar"
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import MenuStatus from "../../hooks/MenuStatus";
import arrowLeft from '../../images/icons/arrow-left-icon.png'
import arrowRight from '../../images/icons/arrow-right-icon.png'
import capIcon from '../../images/icons/cap-icon.png'
import rocketIcon from '../../images/icons/rocket-icon.png'
import bulbIcon from '../../images/icons/bulb-icon.png'
import feetIcon from '../../images/icons/feet-icon.png'
import { useFirestore } from "../../firebase/useFirestore";
import { useState, useEffect, useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import { client } from '../../hooks/Client';
import { db, timestamp } from "../../firebase/config.js"
import ButtonClicked from "../../hooks/ButtonClicked";
import {ReactComponent as QuestionIcon}  from '../../images/icons/question-icon.svg'
import ImpactGuideMenu from "../../hooks/ImpactGuideMenu";

const ImpactTargetgroup = () => {
    const [color, setColor] = useState('')
    const [goalDocid, setGoalDocid] = useState('')
    const [targetgroup, setTargetgroup] = useState(null)
    const [impact, setImpact] = useState('')

    const menuState = MenuStatus()
    const goals = useFirestore('Goals') 

    const colors = useFirestore('Colors')

    useEffect(() => {
        colors && colors.forEach(color => {
            const background = color.Background 

            setColor(background)
        })

    },[colors])

    const goalHandler = (e) => {

        const docid = e.target.options[e.target.selectedIndex].dataset.docid 
        const targetgroup = e.target.options[e.target.selectedIndex].dataset.targetgroup 
        const impact = e.target.options[e.target.selectedIndex].dataset.impact

        setGoalDocid(docid)
        setTargetgroup(targetgroup)
        setImpact(impact)

    }

    const impactHandler = (e) => {

        const impact = e.target.value 

        setImpact(impact)

    }

    const saveImpactTargetgroup = (e) => {

        ButtonClicked(e, 'Opgeslagen')

        db.collection('Goals')
        .doc(goalDocid)
        .update({
            ImpactTargetgroup: impact
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
                <div className='text-section' style={{backgroundColor: color}}>
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
                <div className='text-section' style={{backgroundColor: color}}>
                    <p><b>1. Selecteer het doel waar je de impact op de doelgroep aan wilt koppelen</b></p>
                    <select name="" id="" onChange={goalHandler}>
                        <option value="">-- Selecteer een doel --</option>
                    {goals && goals.map(goal => (
                        <option data-docid={goal.docid} data-targetgroup={goal.Targetgroup} data-impact={goal.ImpactTargetgroup} value={goal.Title}>{goal.Title}</option>
                    ))}
                    </select>
                    <p>Doelgroep: {displayTargetgroup()}</p>
                    <p><b>2. Formuleer de impact op de doelgroep</b></p>
                    <textarea type="text" placeholder='Omschrijf hier de impact op je doelgroep' defaultValue={impact} onChange={impactHandler} />
                    <div className='button-container-align-left'>
                        <button className='button-simple' onClick={saveImpactTargetgroup}>Opslaan</button>
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
                <div className='text-section' style={{backgroundColor: color}}>
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