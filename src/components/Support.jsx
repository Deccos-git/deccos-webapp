import {useFirestore} from "../firebase/useFirestore"
import LeftSideBar from "./LeftSideBar"
import LeftSideBarFullScreen from "./LeftSideBarFullScreen"
import MenuStatus from "../hooks/MenuStatus";
import ButtonClicked from "../hooks/ButtonClicked";
import { useState, useContext } from "react";
import { Auth } from '../StateManagment/Auth';
import { client } from "../hooks/Client"
import { db, timestamp } from "../firebase/config"
import Modal from 'react-modal';
import sendIcon from '../images/icons/send-icon.png'
import ScrollToTop from "../hooks/ScrollToTop";

const Support = () => {
  const [authO] = useContext(Auth)

  const [subject, setSubject] = useState('')
  const [question, setQuestion] = useState('')
  const [modalOpen, setModalOpen] = useState(false);

    const menuState = MenuStatus()
    ScrollToTop()
    Modal.setAppElement('#root');

    const modalStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
        },
      };

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
      setModalOpen(true)

      db.collection("Email").doc().set({
        to: "info@deccos.nl",
        cc: "info@Deccos.nl",
        message: {
        subject: `Support vraag op Deccos.`,
        html: `Nieuwe support vraag op Deccos: </br></br>

            Naam: ${authO.UserName}.</br></br>
            Email: ${authO.Email}.</br></br>
            Bedrijf: ${client}.</br></br>
            Onderwerp: ${subject}.</br></br>
            Vraag: ${question}.</br></br>
            `,
        Gebruikersnaam: `${authO.UserName}`,
        Emailadres: authO.Email,
        Type: "Support"
          }     
      }); 
    }

    const closeModal = () => {
      setModalOpen(false);
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
              <h2>Heb je behoefte aan ondersteuning van een van onze impact experts?</h2>

              <h3>Selecteer een onderwerp</h3>
              <select name="" id="" onChange={subjectHandler}>
                <option value="">-- Selecteer een onderwerp --</option>
                <option value="">Algemeen</option>
                <option value="">Probleemanalyse</option>
                <option value="">Stakeholders</option>
                <option value="">Impact doelen stellen</option>
                <option value="">Doelgroep bepalen</option>
                <option value="">Impact op doelgroep</option>
                <option value="">Impact op maatschappij</option>
                <option value="">Bijdrage aan SDG's</option>
                <option value="">Aannames</option>
                <option value="">Externe factoren</option>
                <option value="">Activiteiten</option>
                <option value="">Impact op activiteit</option>
                <option value="">Outputs</option>
                <option value="">Effecten van outputs</option>
                <option value="">SROI</option>
                <option value="">Mijlpalen</option>
                <option value="">Vragenlijsten</option>
                <option value="">Onderzoek opzetten</option>
                <option value="">Onderzoeksanalyse</option>
                <option value="">Projectbeheer</option>
                <option value="">Impactclub</option>
                <option value="">Iets anders</option>
              </select>
              <h3>Stel je vraag</h3>
              <textarea name="" id="" placeholder='Schrijf hier je vraag' cols="30" rows="10" onChange={questionHandler}></textarea>
              <div className='button-container-margin-top'>
                <button onClick={sendForm}>Versturen</button>
              </div>
            </div>
        </div>
        <Modal
            isOpen={modalOpen}
            onRequestClose={closeModal}
            style={modalStyles}
            contentLabel="Support message"
            >
            <img src={sendIcon} alt="" />
            <p><b>Je vraag is verzonden</b></p>
            <p>We nemen zo spoedig mogelijk contact met je op om de ondersteunignsmogelijkheden door te nemen.</p>
            <div className='button-container-margin-top'>
                <button onClick={closeModal}>Sluiten</button>
            </div>
        </Modal>
    </div>
  )
}

export default Support