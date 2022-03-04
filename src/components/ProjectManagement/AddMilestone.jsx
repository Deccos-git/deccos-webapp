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
  const [outputTitle, setOutputTitle] = useState(null)
  const [title, setTitle] = useState('')
  const [headerPhoto, setHeaderPhoto] = useState('')

  const menuState = MenuStatus()
  const history = useHistory()

  const outputs = useFirestore('Outputs')
  const banners = useFirestore('Banners')

  useEffect(() => {
    banners && banners.forEach(banner => {
        const header = banner.NewGoal
        setHeaderPhoto(header)
    })
  }, [banners])

  const outputHandler = (e) => {
    const outputID = e.target.options[e.target.selectedIndex].dataset.id 
    const outputTitle = e.target.options[e.target.selectedIndex].dataset.title

    setOutputID(outputID)
    setOutputTitle(outputTitle)
  }

  const titleHandler = (e) => {
    const title = e.target.value 

    setTitle(title)
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
      Output: outputTitle,
      OutputID: outputID,
      Title: title,
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

  const nextStep = () => {

    history.push(`/${client}/TaskSettings`)

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
                <h2>Selecteer een output<sup>*</sup></h2>
                <select name="" id="" onChange={outputHandler}>
                  <option value="">-- Selecteer een output --</option>
                  {outputs && outputs.map(output => (
                    <option data-id={output.ID} data-title={output.Title} key={output.ID}>{output.Title}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className='divider'>
              <h2>Geef de mijlpaal een titel</h2>
              <input type="text" onChange={titleHandler} />
            </div>
            <div>
              <button onClick={saveMilestone}>Opslaan</button>
            </div>
        </div>
        <div className='next-step-impact'>
            <img src={ArrowRightIcon} alt="" onClick={nextStep}/>
            <h3 onClick={nextStep}>Volgende stap: taken toevoegen</h3>
        </div>
    </div>
    <RightSideBar />
    </div>
  )
}

export default AddMilestone