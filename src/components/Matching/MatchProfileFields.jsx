import RightSideBar from ".././rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from ".././LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from ".././LeftSideBarAuthProfileFullScreen";
import MenuStatus from "../../hooks/MenuStatus";
import RegistrationField from '../../images/Design/RegistrationFields/textfield.png'
import RegistrationArea from '../../images/Design/RegistrationFields/textarea.png'
import { useState, useEffect, useContext } from "react";
import { Colors } from "../../StateManagment/Colors";
import { db, timestamp } from "../../firebase/config";
import uuid from 'react-uuid';
import { client } from "../../hooks/Client"
import {useFirestore } from "../../firebase/useFirestore"
import deleteIcon from '../../images/icons/delete-icon.png'

const MatchProfileFields = () => {
    const [colors] = useContext(Colors)
    const [title, setTitle] = useState("")
    const [type, setType] = useState('')
    const [classType, setClassType] = useState('')

    const menuState = MenuStatus()

    const profileFields = useFirestore('MatchProfileFields')

    const titleHandler = (e) => {
        const title = e.target.value

        setTitle(title)
    }

    const typeHandler = (e) => {
        const type = e.target.dataset.type
        const classType = e.target.dataset.classtype

        setType(type)
        setClassType(classType)
    }

    const addField = (e) => {

        db.collection("MatchProfileFields")
        .doc()
        .set({
            Timestamp: timestamp,
            ID: uuid(),
            Compagny: client,
            Type: type,
            Title: title,
            Class: classType,
        })
    }

    const deleteField = (e) => {

        const id = e.target.dataset.id

        db.collection("MatchProfileFields")
        .doc(id)
        .delete()
    }


    return (
        <div className="main" style={{backgroundColor:colors.Background}}>
        <LeftSideBarAuthProfile />
        <LeftSideBarAuthProfileFullScreen/>
        <div className="profile profile-auth-profile" style={{display: menuState}}>
            <div className="card-header">
                <h1>Profielvelden</h1>
                <p>Beheer de profielvelden van je match items</p>
            </div>
            <div className="divider">
                <h2>Profielvelden</h2>
                {profileFields && profileFields.map(field => (
                    <div className={field.Class}>
                        <div>
                            <h3>{field.Title}</h3>
                            <p>{field.Type}</p>
                        </div>
                        <img onClick={deleteField} data-title={field.Title} data-id={field.docid} className="profile-settings-delete-icon" src={deleteIcon} alt="" />
                    </div>
                ))}
            </div>
            <div className='divider'>
                <h2>Veld toevoegen</h2>
                <h3>Geef het profielveld een titel</h3>
                <input onChange={titleHandler} type="text" placeholder="Geef je profielveld een titel" />
                <h3>Kies een veldsoort</h3>
                <form>
                    <div className='select-profiel-field-container'>
                        <input type="radio" id='input' name='add-profile-field' data-classtype='field-input-container' data-type={'Textfield'} onChange={typeHandler}/>
                        <label htmlFor="input">
                            <div className="add-registration-field-container">
                                <p>Textveld</p>
                                <img src={RegistrationField} alt="" />
                            </div>
                        </label>
                    </div>
                    <div className='select-profiel-field-container'>
                        <input type="radio" id='textarea' name='add-profile-field' data-classtype='field-textarea-container' data-type={'Textarea'} onChange={typeHandler} />
                        <label htmlFor="textarea">
                            <div className="add-registration-field-container">
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
        <RightSideBar />
    </div>
    )
}

export default MatchProfileFields
