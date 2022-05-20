import {useFirestore} from "../firebase/useFirestore"
import LeftSideBar from "./LeftSideBar"
import LeftSideBarFullScreen from "./LeftSideBarFullScreen"
import MenuStatus from "../hooks/MenuStatus";
import ButtonClicked from "../hooks/ButtonClicked";
import { useState } from "react";

const Support = () => {
  const [subject, setSubject] = useState('')
  const [question, setQuestion] = useState('')

    const menuState = MenuStatus()

    const subjectHandler = (e) => {

      const subject = e.target.options[e.target.selectedIndex].innerText 

      setSubject(subject)

    }

    const questionHandler = (e) => {

      const question = e.target.value 

      setQuestion(question)

    }

    const sendForm = (e) => {

      ButtonClicked(e, 'Verstuurd')




    }

  return (
    <div className="main">
        <LeftSideBar />
        <LeftSideBarFullScreen/>
        <div className="main-container" style={{display: menuState}}>
            <div className="page-header">
                <h1>Ondersteuning</h1>
            </div>
            <div className='article'>
              <h2>Heb je behoefte aan ondersteuning van een van onze impactexperts?</h2>

              <h3>Selecteer een onderwerp</h3>
              <select name="" id="" onChange={subjectHandler}>
                <option value="">-- Selecteer een onderwerp --</option>
                <option value="">Algemeen</option>
                <option value="">Probleemanalyse</option>
                <option value="">Stakeholders</option>
              </select>
              <h3>Stel je vraag</h3>
              <textarea name="" id="" placeholder='Schrijf hier je vraag' cols="30" rows="10" onChange={questionHandler}></textarea>
              <div className='button-container-margin-top'>
                <button onClick={sendForm}>Versturen</button>
              </div>
            </div>
        </div>
    </div>
  )
}

export default Support