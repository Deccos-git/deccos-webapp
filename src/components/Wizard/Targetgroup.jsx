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
import eyeIcon from '../../images/icons/eye-icon.png'


const Targetgroup = () => {
    const [color, setColor] = useState('')
    const [goalDocid, setGoalDocid] = useState('')
    const [title, setTitle] = useState('')

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

        setGoalDocid(docid)
        setTitle(targetgroup)

    }

    const titleHandler = (e) => {

        const title = e.target.value 

        setTitle(title)

    }

    const saveTargetgroup = (e) => {

        ButtonClicked(e, 'Opgeslagen')

        db.collection('Goals')
        .doc(goalDocid)
        .update({
            Targetgroup: title
        })

    }

  return (
    <div className="main">
    <LeftSideBar />
    <LeftSideBarFullScreen/>
    <div className="main-container" style={{display: menuState}}>
        <div className="page-header">
            <h1>Doelgroep bepalen</h1>
            <div className='wizard-sub-nav'>
                <NavLink to={`/${client}/GoalTitle`} >
                    <div className='step-container'>
                        <img src={arrowLeft} alt="" />
                        <p>Impactdoelen</p>
                    </div>
                </NavLink>  
                {ImpactGuideMenu(5)}
                <NavLink to={`/${client}/ImpactTargetgroup`} >
                    <div className='step-container'>
                        <p>Impact op doelgroep</p>
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
                    <p><b>Je doelgroep is de stakeholder op wie je het meest directe invloed hebt.</b></p>
                    <p>
                    De doelgroep is in een later stadium van het impact management proces het onderwerp van je impact 
                    onderzoek. Het is dus belangrijk om helder te hebben wie je doelgroep is. Soms is dat rechttoe rechtaan, 
                    zoals bij een organisatie die nieuwkomers helpt. Soms is dat echter minder voor de hand liggend, zoals 
                    wanneer je bijvoorbeeld ondersteunende diensten levert aan bedrijven die mensen met een afstand 
                    tot de arbeidsmarkt ondersteunen. Je doelgroep is dan de bedrijven en niet de mensen met een afstand 
                    tot de arbeidsmarkt.
                    </p>
                    <p>
                    Als je gaat onderzoeken wat je impact is ga je de effecten bijhouden die je activiteiten hebben op je doelgroep. 
                    Je doelgroep is de groep mensen of bedrijven waar je je activiteiten (diensten en/of producten) aan aanbiedt. 
                    </p>
                </div>
            </div>
            <div>
                <div className='activity-meta-title-container'>
                    <img src={rocketIcon} alt="" />
                    <h3>Aan de slag</h3>
                </div> 
                <div className='text-section' style={{backgroundColor: color}}>
                    <p><b>1. Selecteer het doel waar je de doelgroep aan wilt koppelen</b></p>
                    <select name="" id="" onChange={goalHandler}>
                        <option value="">-- Selecteer een doel --</option>
                    {goals && goals.map(goal => (
                        <option data-docid={goal.docid} data-targetgroup={goal.Targetgroup} value={goal.Title}>{goal.Title}</option>
                    ))}
                    </select>
                    <p><b>1. Formuleer de doelgroep</b></p>
                    <input type="text" placeholder='Schrijf hier de naam van de doelgroep' defaultValue={title} onChange={titleHandler} />
                    <div className='button-container-align-left'>
                        <button className='button-simple' onClick={saveTargetgroup}>Opslaan</button>
                    </div>
                </div>
            </div>
            <div>
                <div className='activity-meta-title-container'>
                    <img src={eyeIcon} alt="" />
                    <h3>Bekijk</h3>
                </div> 
                <div className='text-section' style={{backgroundColor: color}}>
                    <p>Je kunt je doelengroep(en) hier terug vinden:</p>
                    <div className='button-container-margin-top'>
                        <NavLink to={`/${client}/ImpactProgress`} ><button>Impactdashboard</button></NavLink>
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
                    <p>In de volgende stap ga je de impact die jullie organisatie maakt op de doelgroep omschrijven.</p>
                    <NavLink to={`/${client}/ImpactTargetgroup`} ><button>Volgende stap</button></NavLink>
                </div>
            </div>
        </div> 
    </div>
</div>
  )
}

export default Targetgroup