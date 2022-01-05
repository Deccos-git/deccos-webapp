import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "./LeftSideBarAuthProfileFullScreen";
import RightSideBar from "./rightSideBar/RightSideBar"
import Location from "../hooks/Location"
import MenuStatus from "../hooks/MenuStatus";
import { useFirestoreID, useFirestore } from "../firebase/useFirestore"
import { useState, useRef, useEffect } from "react";
import { client } from "../hooks/Client";
import { db, timestamp } from "../firebase/config";

const SendQuestionnaire = () => {
    const route = Location()[3]
    const key = Location()[4]


    const defaultBody = () => {
        return(
            `<p>Geachte heer/mevrouw, <br><br>
            U ontvangt deze email omdat u een stakeholder bent van ${client}. <br>
            Wij willen graag onze impact meten en hebben daarvoor een vragenlijst opgesteld. <br><br>

            Wij zouden het erg op prijs stellen als u de tijd wilt nemen om deze vragenlijst in te vullen. <br>
            Uw input geeft ons de mogelijkheid om te zien of wij op de goede weg zijn om de impact die wij willen maken te realiseren.<br><br>

            U kunt de vragenlijst <a href='https://deccos.nl/${client}/questionnary/${route}'>hier</a> vinden.<br>
            Uw toegangscode is ${key}. <br><br>

            Met vriendelijke groet,<br><br>

            ${client}
            </p>
            `
        )
    }

    const [body, setBody] = useState(defaultBody())
    const [compagnyEmail, setCompagnyEmail] = useState('')
    const [subject, setSubject] = useState('Onderwerp')
    const [emailList, setEmailList] = useState([])

    const menuState = MenuStatus()
    const editorRef = useRef(null);

    const admins = useFirestore("Admins")
    const stakeholders = useFirestore("Stakeholders")
    const questionnares = useFirestoreID('Questionnaires', route)

    useEffect(() => {
        admins && admins.forEach(admin => {
            setCompagnyEmail(admin.Email)
        })
     
    }, [admins])

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

        const email = e.target.dataset.email

        const emailArray = []

        emailList.forEach(listItem => {
            emailArray.push(listItem)
        })

        emailArray.push(email)

        setEmailList(emailArray)

    }

    const removeEmailAdress = (e) => {

        const email = e.target.dataset.email

        const postition = emailList.indexOf(email) 

        const array = emailList 

        array.splice(postition, 1) 

        setEmailList(array)

    }

    const sendQuestionnaire = (e) => {

        e.target.innerText = 'Verstuurd'
        e.target.style.borderColor = 'lightgray'
        e.target.style.color = 'lightgray'

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

    return (
        <div className="main">
        <LeftSideBarAuthProfile />
        <LeftSideBarAuthProfileFullScreen/>
        <div className="profile profile-auth-profile" style={{display: menuState}}>
            {questionnares && questionnares.map(questionnaie => (
                <div key={questionnaie.ID}>
                     <div className='divider send-questionnaire-title'>
                        <h2>{questionnaie.Title}</h2>
                        <h3>versturen</h3>
                    </div>
                    <div className='divider'>
                        <h3>Stakeholders</h3>
                        <div>
                        {stakeholders && stakeholders.map(stakeholder => (
                            <div>
                                <div className='stakeholder-container'>
                                    <p>{stakeholder.Name}</p>
                                    <p>{stakeholder.Email}</p>
                                    <button className='button-simple' data-email={stakeholder.Email} onClick={addStakeholder}>Voeg toe</button>
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>
                    <div className='divider email-example-section'>
                        <h3>Email voorbeeld</h3>
                        <div className='email-example-container'>
                            <div className='email-example-field-container'>
                                <p><b>Aan:</b></p>
                                <div id='stakeholder-email-container'>
                                    {emailList && emailList.map(email => (
                                        <div>
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
                                <input type="text" onChange={subjectHandler} placeholder='Onderwerp'/>
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
        <RightSideBar />
        </div>
    )
}

export default SendQuestionnaire
