import LeftSideBar from "../LeftSideBar";
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import RightSideBar from "../rightSideBar/RightSideBar"
import Location from "../../hooks/Location"
import MenuStatus from "../../hooks/MenuStatus";
import { useFirestore } from "../../firebase/useFirestore"
import { db, timestamp } from "../../firebase/config.js"
import uuid from 'react-uuid';
import { useState } from "react";
import { client } from "../../hooks/Client";
import deleteIcon from '../../images/icons/delete-icon.png'

const Stakeholders = () => {
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')

    const menuState = MenuStatus()
    const route = Location()[3]

    const stakeholders = useFirestore("Stakeholders")

    const nameHandler = (e) => {
        const name = e.target.value

        setName(name)
    }

    const emailHandler = (e) => {
        const email = e.target.value

        setEmail(email)
    }

    const addStakeholder = () => {

        db.collection("Stakeholders")
        .doc()
        .set({
            Compagny: client,
            Timestamp: timestamp,
            ID: uuid(),
            Name: name,
            Email: email
        })
    }

    const deleteStakeholders = (e) => {
        const id = e.target.dataset.id 

        db.collection('Stakeholders')
        .doc(id)
        .delete()
    }

    return (
        <div className="main">
        <LeftSideBar />
        <LeftSideBarFullScreen/>
        <div className="profile profile-auth-profile" style={{display: menuState}}>
            <div className="divider card-header">
                <h1>Stakeholders</h1>
                <p>Pas de instellingen van je stakeholders aan</p>
            </div>
            <div className='divider'>
                <h3>Stakeholders</h3>
            {stakeholders && stakeholders.map(stakeholder => (
                <div className='stakeholder-container'>
                    <p>{stakeholder.Name}</p>
                    <p>{stakeholder.Email}</p>
                    <img src={deleteIcon} alt="" className="userrole-users-delete-button" data-id={stakeholder.docid} onClick={deleteStakeholders}/>
                </div>
            ))}
            </div>
            <div className='divider'>
                        <h3>Voeg een stakeholder toe</h3>
                        <p>Naam</p>
                        <input type="text" placeholder='Vul hier de naam van de stakeholder in' onChange={nameHandler}/>
                        <p>Email</p>
                        <input type="email" placeholder='Vul hier het emailadres van de stakeholder in' onChange={emailHandler}/>
                        <button className='button-simple' onClick={addStakeholder}>Toevoegen</button>
                    </div>
            
        </div>
        <RightSideBar />
        </div>
    )
}

export default Stakeholders
