import LeftSideBar from "../LeftSideBar"
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import MenuStatus from "../../hooks/MenuStatus";
import {useFirestore, useFirestoreActivities} from "../../firebase/useFirestore"
import { useState, useEffect, useContext } from 'react'
import { Auth } from '../../StateManagment/Auth';
import uuid from 'react-uuid';
import { db, timestamp } from "../../firebase/config.js"
import { client } from "../../hooks/Client"
import deleteIcon from '../../images/icons/delete-icon.png'
import { useHistory } from "react-router-dom";
import arrowLeft from '../../images/icons/arrow-left-icon.png'
import arrowRight from '../../images/icons/arrow-right-icon.png'
import capIcon from '../../images/icons/cap-icon.png'
import rocketIcon from '../../images/icons/rocket-icon.png'
import bulbIcon from '../../images/icons/bulb-icon.png'
import feetIcon from '../../images/icons/feet-icon.png'
import ButtonClicked from "../../hooks/ButtonClicked";
import { NavLink, Link } from "react-router-dom";
import {ReactComponent as QuestionIcon}  from '../../images/icons/question-icon.svg'

const AddMilestone = () => {
  const [authO] = useContext(Auth)

  const [color, setColor] = useState('')
  const [outputID, setOutputID] = useState(null)
  const [instrumentTitle, setInstrumentTitle] = useState(null)
  const [instrumentID, setInstrumentID] = useState('')
  const [title, setTitle] = useState('')
  const [number, setNumber] = useState(0)
  const [headerPhoto, setHeaderPhoto] = useState('')
  const [activityID, setActivityID] = useState('')
  const [compagnyLogo, setCompagnyLogo] = useState('')
  const [compagnyBanner, setCompagnyBanner] = useState('')
  const [compagnyName, setCompagnyName] = useState('')
  const [compagnyID, setCompagnyID] = useState('')

  const menuState = MenuStatus()
  const history = useHistory()

  const instruments = useFirestore('ImpactInstruments')
  const banners = useFirestore('Banners')
  const compagnies = useFirestore('CompagnyMeta')
  const colors = useFirestore('Colors')

    useEffect(() => {
        colors && colors.forEach(color => {
            const background = color.Background 

            setColor(background)
        })

    },[colors])


  useEffect(() => {
    banners && banners.forEach(banner => {
        const header = banner.NewGoal
        setHeaderPhoto(header)
    })
  }, [banners])

  useEffect(() => {
    compagnies && compagnies.forEach(compagny => {
      setCompagnyLogo(compagny.Logo)
      setCompagnyBanner(compagny.ImpactBanner)
      setCompagnyName(compagny.CommunityName)
      setCompagnyID(compagny.ID)
    })

  },[compagnies])

  const outputHandler = (e) => {
    const instrumentTitle = e.target.options[e.target.selectedIndex].dataset.title
    const activityID = e.target.options[e.target.selectedIndex].dataset.activityid
    const outputID = e.target.options[e.target.selectedIndex].dataset.outputid
    const instrumentID = e.target.options[e.target.selectedIndex].dataset.id

    setOutputID(outputID)
    setInstrumentTitle(instrumentTitle)
    setActivityID(activityID)
    setInstrumentID(instrumentID)
  }

  const titleHandler = (e) => {
    const title = e.target.value 

    setTitle(title)
  }

  const numberHandler = (e) => {
    const number = e.target.value 

    setNumber(number)
  }

  const saveMilestone = (e) => {

    ButtonClicked(e, 'Opgeslagen')

    const id = uuid()

    db.collection('Milestones')
    .doc()
    .set({
      ID: id,
      Compagny: client,
      Timestamp: timestamp,
      Instrument: instrumentTitle,
      OutputID: outputID,
      InstrumentID: instrumentID,
      ActivityID: activityID,
      Title: title,
      Number: parseInt(number),
      Succes: false,
      Logo: compagnyLogo,
      Banner: compagnyBanner,
      CompagnyName: compagnyName,
      CompagnyID: compagnyID
    })
    .then(() => {
        db.collection("AllActivity")
        .doc()
        .set({
            Title: title,
            Type: "NewMilestone",
            Compagny: client,
            Timestamp: timestamp,
            ID: id,
            Description: "heeft een nieuwe mijlpaal toegevoegd:",
            ButtonText: "Bekijk mijlpaal",
            User: authO.UserName,
            UserPhoto: authO.Photo,
            UserID: authO.ID,
            Banner: headerPhoto,
            Link: `MilestoneDetail/${id}`
        }) 
    })
    .then(() => {
        db.collection("Search")
        .doc()
        .set({
            Name: title,
            Compagny: client,
            Type: 'Mijlpaal',
            Link: `MilestoneDetail/${id}`
        })
    })

  }


  return (
    <div className="main">
    <LeftSideBar />
    <LeftSideBarFullScreen/>
    <div className="main-container" style={{display: menuState}}>
        <div className="page-header">
            <h1>Mijlpalen</h1>
            <div className='wizard-sub-nav'>
                <NavLink to={`/${client}/ResearchAnalyses`} >
                    <div className='step-container'>
                        <img src={arrowLeft} alt="" />
                        <p>Onderzoeksanalyse</p>
                    </div>
                </NavLink>  
                <p>20 van de 22</p>
                <NavLink to={`/${client}/Projectmanagement`} >
                    <div className='step-container'>
                        <p>Projectbeheer</p>
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
                </div>
            </div>
            <div>
                <div className='activity-meta-title-container'>
                    <img src={rocketIcon} alt="" />
                    <h3>Aan de slag</h3>
                </div> 
                <div className='text-section' style={{backgroundColor: color}}>
              <div>
                <p><b>Selecteer een output</b></p>
                <select name="" id="" onChange={outputHandler}>
                  <option value="">-- Selecteer een output --</option>
                  {instruments && instruments.map(instrument => (
                    <option data-id={instrument.ID} data-title={instrument.Title} data-outputid={instrument.OutputID} data-activityid={instrument.ActivityID} key={instrument.ID}>{instrument.Title}</option>
                  ))}
                </select>
              </div>
              <p><b>Geef de mijlpaal een titel</b></p>
              <input type="text" onChange={titleHandler} />
              <p><b>Geef de mijlpaal een aantal</b></p>
              <input type="number" onChange={numberHandler} />
              <div className=''>
                <button onClick={saveMilestone}>Opslaan</button>
              </div>
              </div>
                <div>
                    <div className='activity-meta-title-container'>
                        <img src={bulbIcon} alt="" />
                        <h3>Tips</h3>
                    </div> 
                    <div className='text-section' style={{backgroundColor: color}}>
                        <ol>
                            <li>Kom je er niet uit of heb je behoefte aan ondersteuning van een impactexpert? 
                                Klik op het <QuestionIcon style={{width: '19px', height: '19px'}}/> icon in de 
                                bovenbalk (onderbalk op mobiel) voor alle ondersteuningsmogelijkheden.</li>
                        </ol>
                    </div>
                </div>
                <div>
                    <div className='activity-meta-title-container'>
                        <img src={feetIcon} alt="" />
                        <h3>Volgende stap</h3>
                    </div> 
                    <div className='text-section' style={{backgroundColor: color}}>
                        <p>In de volgende stap ga je een probleemanalyse maken.</p>
                        <button>Volgende stap</button>
                    </div>
                </div>
            </div> 
        </div>
    </div>

    </div>
  )
}

export default AddMilestone