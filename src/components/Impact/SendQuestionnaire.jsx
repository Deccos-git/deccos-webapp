import LeftSideBar from "../LeftSideBar"
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import MenuStatus from "../../hooks/MenuStatus";
import arrowLeft from '../../images/icons/arrow-left-icon.png'
import arrowRight from '../../images/icons/arrow-right-icon.png'
import capIcon from '../../images/icons/cap-icon.png'
import rocketIcon from '../../images/icons/rocket-icon.png'
import bulbIcon from '../../images/icons/bulb-icon.png'
import feetIcon from '../../images/icons/feet-icon.png'
import sendIcon from '../../images/icons/send-icon.png'
import Location from "../../hooks/Location"
import { useFirestoreID, useFirestore, useFirestoreStakeholders } from "../../firebase/useFirestore"
import { useState, useRef, useEffect } from "react";
import { client } from "../../hooks/Client";
import { db, timestamp } from "../../firebase/config";
import { NavLink, Link } from "react-router-dom";
import eyeIcon from '../../images/icons/eye-icon.png'
import listIcon from '../../images/icons/list-icon.png'
import ImpactGuideMenu from "../../hooks/ImpactGuideMenu";
import {ReactComponent as QuestionIcon}  from '../../images/icons/question-icon.svg'
import ButtonClicked from "../../hooks/ButtonClicked";

const SendQuestionnaire = () => {
    const route = Location()[3]

    const [compagnyEmail, setCompagnyEmail] = useState('')
    const [subject, setSubject] = useState()
    const [emailList, setEmailList] = useState([])
    const [categorie, setCategorie] = useState('')

    const menuState = MenuStatus()
    const editorRef = useRef(null);

    const admins = useFirestore("Admins")
    const stakeholders = useFirestoreStakeholders(categorie)
    const questionnares = useFirestoreID('Questionnaires', route)

    useEffect(() => {
        admins && admins.forEach(admin => {
            setCompagnyEmail(admin.Email)
        })
     
    }, [admins])

    useEffect(() => {
        questionnares && questionnares.forEach(questionnare => {
            setSubject(`Vragenlijst '${questionnare.Title}' van ${client}`)
        })

    },[questionnares])

    const defaultBody = () => {
        return(
            `<p>Geachte heer/mevrouw, <br><br>
            U ontvangt deze email omdat u een stakeholder bent van ${client}. <br>
            Wij willen graag onze impact meten en hebben daarvoor een vragenlijst opgesteld. <br><br>

            Wij zouden het erg op prijs stellen als u de tijd wilt nemen om deze vragenlijst in te vullen. <br>
            Uw input geeft ons de mogelijkheid om te zien of wij op de goede weg zijn om de impact die wij willen realiseren.<br><br>

            U kunt de vragenlijst <a href='https://deccos.nl/${client}/Questionnaires/${route}'>hier</a> vinden.<br>

            Met vriendelijke groet,<br><br>

            ${client}
            </p>
            `
        )
    }

    const [body, setBody] = useState(defaultBody())

    const bodyHandler = () => {
        if (editorRef.current) {
            setBody(editorRef.current.getContent());
            }
    }

    const subjectHandler = (e) => {
        const subject = e.target.value

        setSubject(subject)
    }

    const addStakeholder = (e) => {

        e.target.style.color = 'gray'
        e.target.innerText = 'Toegevoegd'

        const email = e.target.dataset.email

        const emailArray = []

        emailList.forEach(listItem => {
            emailArray.push(listItem)
        })

        emailArray.push(email)

        setEmailList(emailArray)

    }

    const removeEmailAdress = (e) => {

        e.target.style.display = 'none'

        const email = e.target.dataset.email

        const postition = emailList.indexOf(email) 

        const array = emailList 

        console.log(array)

        array.splice(postition, 1) 

        setEmailList(array)

    }

    const sendQuestionnaire = (e) => {

        ButtonClicked(e, 'Verzonden')

        console.log(emailList)
        console.log(subject)

        db.collection("Email").doc().set({
            to: emailList,
            cc: "info@Deccos.nl",
            message: {
            subject: `${subject} `,
            html: `${body}`,
            Emailadres: compagnyEmail,
            Type: "Questionnairy",
            Timestamp: timestamp
              }     
          });

    }

    const categorieHandler = (e) => {
        const categorie = e.target.options[e.target.selectedIndex].innerText
       
        setCategorie(categorie)
    }

    return (
        <div className="main">
        <LeftSideBar />
        <LeftSideBarFullScreen/>
        <div className="main-container" style={{display: menuState}}>
            <div className="page-header">
                <h1>Vragenlijst versturen</h1>
                <div className='wizard-sub-nav-introduction'>
                    <NavLink to={`/${client}/Research`} >
                        <div className='step-container'>
                            <p>Onderzoek</p>
                            <img src={arrowLeft} alt="" />
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
                   <p><b>Vragenlijsten kunnen via Deccos worden verstuurd naar je stakeholders.</b></p>
                    <p>
                        Je respondenten krijgen een link naar de vragenlijst via een door Deccos verstuurde email. 
                        Hieronder kun je invullen naar welke stakeholders je de vragenlijst wilt versturen en 
                        welk boodschap je mee wilt geven in de email. 
                    </p>

                    <p>Wanneer er een vragenlijst is ingevuld ontvang je een email notificatie.</p>
                </div>
                <div>
                    <div className='activity-meta-title-container'>
                        <img src={rocketIcon} alt="" />
                        <h3>Aan de slag</h3>
                    </div> 
                    <div className='text-section'>
                        <h3>Selecteer stakeholders</h3>
                            <select name="" id="" onChange={categorieHandler}>
                                <option value="" style={{color: '#d3d3d3'}}> -- Categorie --</option>
                                <option value="Doelgroep">Doelgroep</option>
                                <option value="Financier">Financier</option>
                                <option value="Investeerder">Investeerder</option>
                                <option value="Gemeente">Gemeente</option>
                                <option value="Provincie">Provincie</option>
                                <option value="Rijk">Rijk</option>
                                <option value="Klant">Klant</option>
                                <option value="Netwerk">Netwerk</option>
                            </select>
                        {questionnares && questionnares.map(questionnare => (
                            <div key={questionnare.ID}>
                                <div className='table-container' style={{display: categorie === "" ? 'none' : 'flex', marginTop: '20px'}}>
                                    <table>
                                        <tr>
                                            <th>NAAM</th>
                                            <th>EMAIL</th>
                                            <th>TOEVOEGEN</th>
                                        </tr>
                                        {stakeholders && stakeholders.map(stakeholder => (
                                            <tr key={stakeholder.ID}>
                                                <td>
                                                    <p>{stakeholder.Name}</p>
                                                </td>
                                                <td>
                                                    <p>{stakeholder.Email}</p>
                                                </td>
                                                <td>
                                                    <button className='button-simple' data-email={stakeholder.Email} onClick={addStakeholder}>Voeg toe</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </table>
                                </div>
                                <div>
                                </div>
                                <div className='email-example-section'>
                                    <h3>Email voorbeeld</h3>
                                    <div className='email-example-container'>
                                        <div className='email-example-field-container'>
                                            <p><b>Aan:</b></p>
                                            <div id='stakeholder-email-container'>
                                                {emailList && emailList.map(email => (
                                                    <div key={email}>
                                                        <p data-email={email} onClick={removeEmailAdress}>{email} x</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className='email-example-field-container'>
                                            <p><b>Kopie:</b></p>
                                            <p>{compagnyEmail}</p> 
                                        </div>
                                        <div className='email-example-field-container'>
                                            <p><b>Onderwerp:</b></p>
                                            <input type="text" onChange={subjectHandler} defaultValue={`Vragenlijst '${questionnare.Title}' van ${client}`}/>
                                        </div>
                                        <div>
                                            <p><b>Text</b></p>
                                            <textarea name="" id="" cols="30" rows="10" onChange={bodyHandler} defaultValue={body}></textarea>
                                        </div>
                                    </div>
                                    <div>
                                        <button onClick={sendQuestionnaire}>Versturen</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div>
                        <div className='activity-meta-title-container'>
                            <img src={eyeIcon} alt="" />
                            <h3>Bekijk</h3>
                        </div> 
                        <div className='text-section'>
                            <p><b>Je kunt je de verstuurde vragenlijst hier terug vinden:</b></p>
                            <div className="channel-inner-div">
                            <div className='activity-meta-title-container'>
                                <img src={listIcon} alt="" />
                                <a href="">Verstuurde vragenlijst</a>
                            </div>
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
                        <p>Terug naar onderzoek:</p>
                        <NavLink to={`/${client}/Research`} ><button>Naar onderzoek</button></NavLink>
                    </div>
                </div>
            </div> 
        </div>
    </div>
    )
}

export default SendQuestionnaire
