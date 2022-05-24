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

const ImpactSociety = () => {
    const [color, setColor] = useState('')
    const [goalDocid, setGoalDocid] = useState('')
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
        const impact = e.target.options[e.target.selectedIndex].dataset.impact

        setGoalDocid(docid)
        setImpact(impact)

    }

    const impactHandler = (e) => {

        const impact = e.target.value 

        setImpact(impact)

    }

    const saveImpactSociety = (e) => {

        ButtonClicked(e, 'Opgeslagen')

        db.collection('Goals')
        .doc(goalDocid)
        .update({
            ImpactSociety: impact
        })

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
                <p>7 van de 12</p>
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
                <div className='text-section' style={{backgroundColor: color}}>
                    <p><b>
                        Wanneer de impact op de doelgroep is verwezenlijkt, welke impact heeft dat dan op de maatschappij in zijn geheel?
                    </b></p>
                    <p>
                        Bij het bepalen van jullie impact op de maatschappij is het minder relevant dat de impact concreet en meetbaar zijn. 
                        Het gaat vaak om bredere maatschappelijke effecten.
                    </p>
                    <p>
                        Let er op dat je impact om de maatschappij binnen de context van het geselecteerde impact doel houdt.
                    </p>
                </div>
            </div>
            <div>
                <div className='activity-meta-title-container'>
                    <img src={rocketIcon} alt="" />
                    <h3>Aan de slag</h3>
                </div> 
                <div className='text-section' style={{backgroundColor: color}}>
                    <p><b>1. Selecteer het doel waar je de impact op de maatschappij aan wilt koppelen</b></p>
                    <select name="" id="" onChange={goalHandler}>
                        <option value="">-- Selecteer een doel --</option>
                    {goals && goals.map(goal => (
                        <option data-docid={goal.docid} data-impact={goal.ImpactSociety} value={goal.Title}>{goal.Title}</option>
                    ))}
                    </select>
                    <p><b>2. Formuleer de impact op de maatschappij</b></p>
                    <textarea type="text" placeholder='Schrijf hier de naam van de doelgroep' defaultValue={impact} onChange={impactHandler} />
                    <div className='button-container-align-left'>
                        <button className='button-simple' onClick={saveImpactSociety}>Opslaan</button>
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

export default ImpactSociety