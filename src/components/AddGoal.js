import { useState } from 'react'

const AddGoal = () => {

    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [type, setType] = useState("")

    return (
        <div className="card">
            <div className="card-header">
                <h2>Voeg een doel toe</h2>
                <p>Voeg een nieuw doel toe om samen aan te werken</p>
            </div>
            <form id="add-goal-form">
                <div className="divider">
                    <h4>Geef het doel een titel</h4>
                    <input type="text" placeholder="Schrijf hier de titel" />
                </div >
                <div className="divider">
                    <h4>Omschrijf het doel</h4>
                    <textarea name="body" id="body" cols="30" rows="10" placeholder="Schrijf hier de omschrijving"></textarea>
                </div>
                <div>
                    <h4>Is het een intern of een maatschappelijk doel?</h4>
                    <input type="radio" className="input-radio" id="SDG" value="SDG" name="goal-type"/>
                    <label htmlFor="SDG">SDG</label>
                    <input type="radio" className="input-radio" id="internal" value="internal" name="goal-type"/>
                    <label htmlFor="internal">Intern</label>
                </div>
            </form>
            <button>Opslaan</button>
        </div>
    )
}

export default AddGoal
