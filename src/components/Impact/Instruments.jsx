import RightSideBar from "../rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "../LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "../LeftSideBarAuthProfileFullScreen";
import MenuStatus from "../../hooks/MenuStatus";
import { Link } from "react-router-dom";
import { client } from "../../hooks/Client"
import plusIcon from '../../images/icons/plus-icon.png'
import deleteIcon from '../../images/icons/delete-icon.png'
import {useFirestore} from "../../firebase/useFirestore"

const Instruments = () => {

    const menuState = MenuStatus()

    const instruments = useFirestore('ImpactInstruments')

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
                <div key={instrument.ID}>
                    <p>{instrument.OutputTitle}</p>
                </div>
            ))}

        </div>
    </div>
    <RightSideBar />
    </div>
  )
}

export default Instruments