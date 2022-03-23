import RightSideBar from "../rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "../LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "../LeftSideBarAuthProfileFullScreen";
import MenuStatus from "../../hooks/MenuStatus";
import { Link } from "react-router-dom";
import { client } from "../../hooks/Client"
import plusIcon from '../../images/icons/plus-icon.png'
import deleteIcon from '../../images/icons/delete-icon.png'
import {useFirestore} from "../../firebase/useFirestore"
import { useHistory } from "react-router-dom";
import { db } from "../../firebase/config.js"
import settingsIcon from '../../images/icons/settings-icon.png'

const Instruments = () => {

    const menuState = MenuStatus()
    const history = useHistory()

    const instruments = useFirestore('ImpactInstruments')

    const instrumentLink = (e) => {

        const ID = e.target.dataset.id

        history.push(`/${client}/InstrumentSettingsDetail/${ID}`)

    }

    const deleteInstrument = (e) => {

        const docid = e.target.dataset.docid

        db.collection('ImpactInstruments')
        .doc(docid)
        .delete()

    }

  return (
    <div className="main">
    <LeftSideBarAuthProfile />
    <LeftSideBarAuthProfileFullScreen/>
    <div className="profile profile-auth-profile" style={{display: menuState}}>
        <div className="settings-inner-container">
            <div className="divider card-header">
                <h1>Meetinstrumenten</h1>
            </div>
        </div>
        <div className='divider'>
            {instruments && instruments.map(instrument => (
                <div id="members-container" key={instrument.ID}>
                    <p>{instrument.Output.Output}</p>
                    <div className='icon-container-activities'>
                        <img src={settingsIcon} alt="" className="userrole-users-delete-button" data-id={instrument.ID} onClick={instrumentLink}/>
                        <img src={deleteIcon} alt="" className="userrole-users-delete-button" data-docid={instrument.docid} onClick={deleteInstrument} />
                    </div>
                </div>
            ))}
        </div>
    </div>
    <RightSideBar />
    </div>
  )
}

export default Instruments