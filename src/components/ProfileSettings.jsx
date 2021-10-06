import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "./LeftSideBarAuthProfileFullScreen";
import RightSideBar from "./rightSideBar/RightSideBar"
import MenuStatus from "../hooks/MenuStatus"
import plusIcon from '../images/icons/plus-icon.png'
import RegistrationField from '../images/Design/RegistrationFields/textfield.png'
import RegistrationArea from '../images/Design/RegistrationFields/textarea.png'
import RegistrationRadio from '../images/Design/RegistrationFields/radio.png'
import RegistrationDropdown from '../images/Design/RegistrationFields/dropdown.png'
import { useFirestore, useFirestoreProfileFields } from "../firebase/useFirestore";
import { db, timestamp } from "../firebase/config";
import uuid from 'react-uuid';
import { client } from "../hooks/Client";
import { useDrag} from 'react-dnd'
import { useState, useEffect } from "react";

const ProfileSettings = () => {
    const [title, setTitle] = useState("")
    const [position, setPosition] = useState(0)

    const [{isDragging}, drag] = useDrag(() => ({
        type: "div",
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
        })
    }))

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

    const deleteField = () => {

    }

    const addField = (e) => {
        const type = e.target.dataset.type
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
            Button: `<button>Opslaan</button>`
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
            <input type="text" placeholder="Hier staat de gebruikers text" />
        </div>`

        return html
    }

    return (
        <div className="main">
            <LeftSideBarAuthProfile />
            <LeftSideBarAuthProfileFullScreen/>
            <div className="profile" style={{display: menuState}}>
                <div className="card-header">
                    <h2>Profiel instellingen</h2>
                    <p>Beheer de instellingen van de gebruikersprofielen</p>
                </div>
                <div className="divider">
                    <h3>Profielvelden</h3>
                    {profileFields && profileFields.map(field => (
                        <div dangerouslySetInnerHTML={{ __html: field.HTML }}></div>
                    ))}
                    <h4>Veld toevoegen</h4>
                    <div className="add-registration-field-container" >
                        <img className="drag-icon" src={plusIcon} data-html={textFieldHTML()} data-type={"TextField"}  onClick={addField} />
                        <p>Textveld</p>
                        <input onChange={titleHandler} type="text" placeholder="Geef je textveld een titel" />
                        <img src={RegistrationField} alt="" />
                    </div>
                    <div className="add-registration-field-container" data-type={"TextArea"} >
                        <img className="drag-icon" src={plusIcon} data-type={"TextArea"}  onClick={addField} />
                        <p data-type={"textArea"}>Textvak</p>
                        <textarea onChange={titleHandler} type="text" placeholder="Geef je textvak een titel" />
                        <img data-type={"textArea"} src={RegistrationArea} alt="" />
                    </div>
                    <div className="add-registration-field-container" data-type={"Radio"} >
                        <img className="drag-icon" src={plusIcon} alt="" />
                        <p data-type={"radio"}>Meerkeuze knoppen</p>
                        <img data-type={"radio"} src={RegistrationRadio} alt="" />
                    </div>
                    <div className="add-registration-field-container" data-type={"Dropdown"} >
                        <img className="drag-icon" src={plusIcon} alt="" />
                        <p data-type={"dropdown"} >Meerkeuze lijst</p>
                        <img data-type={"dropdown"} src={RegistrationDropdown} alt="" />
                    </div>
                </div>
            </div>
            <RightSideBar />
        </div>
    )
}

export default ProfileSettings
