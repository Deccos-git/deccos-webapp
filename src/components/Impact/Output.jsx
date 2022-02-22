import RightSideBar from "../rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "../LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "../LeftSideBarAuthProfileFullScreen";
import MenuStatus from "../../hooks/MenuStatus";
import { db } from "../../firebase/config.js"
import { useState, useEffect } from "react";
import {useFirestore} from "../../firebase/useFirestore"
import { client } from "../../hooks/Client"
import deleteIcon from '../../images/icons/delete-icon.png'
import settingsIcon from '../../images/icons/settings-icon.png'
import { useHistory } from "react-router-dom";
import plusIcon from '../../images/icons/plus-icon.png'
import { Link } from "react-router-dom";

const Output = () => {

    const menuState = MenuStatus()
    const history = useHistory()

    const outputs = useFirestore('Outputs')

    const outputLink = (e) => {

        const ID = e.target.dataset.id

        history.push(`/${client}/OutputDetail/${ID}`)

    }

    const deleteOutput = (e) => {

        const docid = e.target.dataset.docid

        db.collection('Outputs')
        .doc(docid)
        .delete()
    }

    const numberOfIndicators = (output) => {

        const customOutput = output.Output.length
        const members = output.Members ? 1 : 0
        const matches = output.Matches ? 1 : 0

        const indicators = customOutput + members + matches

        return indicators

    }

    console.log(outputs)

  return (
    <div className="main">
            <LeftSideBarAuthProfile />
            <LeftSideBarAuthProfileFullScreen/>
            <div className="profile profile-auth-profile" style={{display: menuState}}>
                <div className="card-header">
                    <h1>Impact resultaten</h1>
                    <p>Verander de instellingen van de impact resultaten</p>
                </div>
                <div className='divider'>
                    <h3>Resultaat toevoegen</h3>
                    <Link to={`/${client}/AddOutput`} ><img id="plus-icon-goal-settings" src={plusIcon} alt="" /></Link>
                </div>
                <div>
                    <h4>Resultaten</h4>
                    {outputs && outputs.map(output => (
                        <div id="members-container" key={output.ID}>
                            <h3 id={output.ID} >{output.ActivityTitle}</h3>
                            <p id='number-indicators-output'>{numberOfIndicators(output)} indicatoren</p>
                            <div className='icon-container-activities'>
                                <img src={settingsIcon} alt="" className="userrole-users-delete-button" data-id={output.ID} onClick={outputLink}/>
                                <img src={deleteIcon} alt="" className="userrole-users-delete-button" data-docid={output.docid} onClick={deleteOutput} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <RightSideBar />
        </div>
  )
}

export default Output