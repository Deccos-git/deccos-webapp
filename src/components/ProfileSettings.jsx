import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "./LeftSideBarAuthProfileFullScreen";
import RightSideBar from "./rightSideBar/RightSideBar"
import MenuStatus from "../hooks/MenuStatus"
import plusIcon from '../images/icons/plus-icon.png'
import deleteIcon from '../images/icons/delete-icon.png'
import RegistrationField from '../images/Design/RegistrationFields/textfield.png'
import RegistrationArea from '../images/Design/RegistrationFields/textarea.png'
import RegistrationRadio from '../images/Design/RegistrationFields/radio.png'
import RegistrationDropdown from '../images/Design/RegistrationFields/dropdown.png'
import { useFirestore, useFirestoreProfileFields } from "../firebase/useFirestore";
import { db, timestamp } from "../firebase/config";
import uuid from 'react-uuid';
import { client } from "../hooks/Client";
import { useState, useEffect } from "react";

const ProfileSettings = () => {
    const [title, setTitle] = useState("")
    const [position, setPosition] = useState(0)
    const [type, setType] = useState('test')

    console.log('test')

    const profileFields = useFirestoreProfileFields()

    useEffect(() => {
        const positionArry = []

        profileFields && profileFields.forEach(field => {

            positionArry.push(field.Position)

            setPosition(positionArry.length + 1)
                
        })

    }, [profileFields])

    const menuState = MenuStatus()
    const id = uuid()

    const deleteField = (e) => {

        const id = e.target.dataset.id
        const title = e.target.dataset.title

        db.collection("ProfileFields")
        .doc(id)
        .delete()
        .then(() => {
            db.collection("AboutMe")
            .where("Title", "==", title)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {

                    db.collection("AboutMe")
                    .doc(doc.id)
                    .delete()
                })
            })
        })
    }

    const addField = (e) => {
        const html = e.target.dataset.html

        db.collection("ProfileFields")
        .doc()
        .set({
            Timestamp: timestamp,
            ID: id,
            Compagny: client,
            HTML: html,
            Type: type,
            Title: title,
            Position: position,
            Template: true,
            Button: `<button class="button-simple button-about-me" >Opslaan</button>`
        })
    }

    const titleHandler = (e) => {
        const title = e.target.value

        setTitle(title)
    }

    const textFieldHTML = () => {
        const html = 
        `<div>
            <h3>${title}</h3>
            <input type="text"/>
        </div>`

        return html
    }

    const textAreaHTML = () => {
        const html = 
        `<div>
            <h3>${title}</h3>
            <textarea type="text"/>
        </div>`

        return html
    }

    return (
        <div className="main">
            <LeftSideBarAuthProfile />
            <LeftSideBarAuthProfileFullScreen/>
            <div className="profile profile-auth-profile" style={{display: menuState}}>
                <div className="settings-inner-container">
                    <div className="card-header">
                        <h1>Profielen</h1>
                        <p>Beheer de instellingen van de gebruikersprofielen</p>
                    </div>
                    <div className="divider">
                        <h2>Profielvelden</h2>
                        {profileFields && profileFields.map(field => (
                            <div>
                                <div dangerouslySetInnerHTML={{ __html: field.HTML }}></div>
                                <img onClick={deleteField} data-title={field.Title} data-id={field.docid} className="profile-settings-delete-icon" src={deleteIcon} alt="" />
                            </div>
                        ))}
                    </div>
                    <div className="divider">
                        <h2>Veld toevoegen</h2>
                        <h3>Geef het profielveld een titel</h3>
                        <input onChange={titleHandler} type="text" placeholder="Geef je profielveld een titel" />
                        <h3>Kies een veldsoort</h3>
                        <form>
                            <div className='select-profiel-field-container'>
                                <input type="radio" id='input' name='add-profile-field' onChange={() => setType('input')}/>
                                <label htmlFor="input">
                                    <div className="add-registration-field-container">
                                        <p>Textveld</p>
                                        <img src={RegistrationField} alt="" />
                                    </div>
                                </label>
                            </div>
                            <div className='select-profiel-field-container'>
                                <input type="radio" id='textarea' name='add-profile-field' />
                                <label htmlFor="textarea">
                                    <div className="add-registration-field-container" onChange={() => setType('textarea')}>
                                        <p data-type={"textArea"}>Textvak</p>
                                        <img data-type={"textArea"} src={RegistrationArea} alt="" />
                                    </div>
                                </label>
                            </div>
                        </form>
                        
                        
                        {/* <div className="add-registration-field-container" data-type={"Radio"} >
                            <img className="drag-icon" src={plusIcon} alt="" />
                            <p data-type={"radio"}>Meerkeuze knoppen</p>
                            <img data-type={"radio"} src={RegistrationRadio} alt="" />
                        </div> */}
                       <button className='button-simple' onClick={addField}>Toevoegen</button>
                    </div>
                </div>
            </div>
            <RightSideBar />
        </div>
    )
}

export default ProfileSettings
