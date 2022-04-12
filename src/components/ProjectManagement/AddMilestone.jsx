import RightSideBar from "../rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "../LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "../LeftSideBarAuthProfileFullScreen";
import MenuStatus from "../../hooks/MenuStatus";
import {useFirestore, useFirestoreActivities} from "../../firebase/useFirestore"
import { useState, useEffect, useContext } from 'react'
import { Auth } from '../../StateManagment/Auth';
import uuid from 'react-uuid';
import { db, timestamp } from "../../firebase/config.js"
import { client } from "../../hooks/Client"
import deleteIcon from '../../images/icons/delete-icon.png'
import { useHistory } from "react-router-dom";
import ArrowRightIcon from '../../images/icons/arrow-right-icon.png'
import spinnerRipple from '../../images/spinner-ripple.svg'
import firebase from 'firebase'
import { bucket } from '../../firebase/config';
import ButtonClicked from "../../hooks/ButtonClicked";

const AddMilestone = () => {
  const [authO] = useContext(Auth)

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
    <LeftSideBarAuthProfile />
    <LeftSideBarAuthProfileFullScreen/>
    <div className="profile profile-auth-profile" style={{display: menuState}}>
        <div className="settings-inner-container">
            <div className="divider card-header">
                <h1>Mijlpaal toevoegen</h1>
            </div>
            <div className='divider'>
              <div>
                <h2>Selecteer een instrument<sup>*</sup></h2>
                <select name="" id="" onChange={outputHandler}>
                  <option value="">-- Selecteer een instrument --</option>
                  {instruments && instruments.map(instrument => (
                    <option data-id={instrument.ID} data-title={instrument.Output.Output} data-outputid={instrument.OutputID} data-activityid={instrument.ActivityID} key={instrument.ID}>{instrument.Output.Output}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className='divider'>
              <h2>Geef de mijlpaal een titel</h2>
              <input type="text" onChange={titleHandler} />
            </div>
            <div className='divider'>
              <h2>Geef de mijlpaal een aantal</h2>
              <input type="number" onChange={numberHandler} />
            </div>
            <div>
              <button onClick={saveMilestone}>Opslaan</button>
            </div>
        </div>
    </div>
    <RightSideBar />
    </div>
  )
}

export default AddMilestone