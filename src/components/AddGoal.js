import { useState } from 'react'
import { motion } from "framer-motion"
import { db, timestamp } from "../firebase/config.js"
import { client } from '../hooks/Client';
import { Link } from "react-router-dom";
import uuid from 'react-uuid';

const AddGoal = () => {

    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [type, setType] = useState("")

    const variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }

    const titleHandler = (e) => {
        const title = e.target.value
        setTitle(title)
    }

    const bodyHandler = (e) => {
        const body = e.target.value
        setBody(body)
    }

    const typeHandler = (e) => {
        const type = e.target.value
        setType(type)
        console.log(type)
    }

    const id = uuid()

    const saveGoal = () => {
        db.collection("Goals")
        .doc()
        .set({
            Title: title,
            Body: body,
            Type: type,
            Compagny: client,
            Timestamp: timestamp,
            ID: id
        })
        .then(() => {
            db.collection("AllActivity")
            .doc()
            .set({
                Title: title,
                Type: "NewGoal",
                Compagny: client,
                Timestamp: timestamp,
                ID: id
            }) 
        })
    }

    return (
        <motion.div className="card"
        initial="hidden"
        animate="visible"
        variants={variants}>
            <div className="card-header">
                <h2>Voeg een doel toe</h2>
                <p>Voeg een nieuw doel toe om samen aan te werken</p>
            </div>
            <form id="add-goal-form">
                <div className="divider">
                    <h4>Geef het doel een titel</h4>
                    <input type="text" placeholder="Schrijf hier de titel" onChange={titleHandler} />
                </div >
                <div className="divider">
                    <h4>Omschrijf het doel</h4>
                    <textarea 
                    name="body" 
                    id="body" 
                    cols="30" 
                    rows="10" 
                    placeholder="Schrijf hier de omschrijving"
                    onChange={bodyHandler}>
                    </textarea>
                </div>
                <div>
                    <h4>Is het een intern of een sociaal maatschappelijk doel?</h4>
                    <input 
                    type="radio" 
                    className="input-radio" 
                    id="SDG" 
                    value="SDG" 
                    name="goal-type"
                    onChange={typeHandler}/>
                    <label htmlFor="SDG">Sociaal maatschappelijk</label>
                    <input 
                    type="radio" 
                    className="input-radio" 
                    id="internal" 
                    value="internal" 
                    name="goal-type"
                    onChange={typeHandler}/>
                    <label htmlFor="internal">Intern</label>
                </div>
            </form>
            <div id="button-add-goal">
                <Link to={`/${client}/Goals`}><button onClick={saveGoal}>Opslaan</button></Link>
            </div>
        </motion.div>
    )
}

export default AddGoal
