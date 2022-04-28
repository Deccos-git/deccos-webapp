import LeftSideBarAuthProfile from "../LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "../LeftSideBarAuthProfileFullScreen";
import RightSideBar from "../rightSideBar/RightSideBar"
import Location from "../../hooks/Location"
import MenuStatus from "../../hooks/MenuStatus";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { client } from "../../hooks/Client"
import plusIcon from '../../images/icons/plus-icon.png'
import { useFirestore } from "../../firebase/useFirestore"
import { db } from "../../firebase/config.js"
import settingsIcon from '../../images/icons/settings-icon.png'
import deleteIcon from '../../images/icons/delete-icon.png'

const SROI = () => {

    const menuState = MenuStatus()
    const history = useHistory()

    const SROIs = useFirestore('SROIs')

    const SROILink = (e) => {

        const ID = e.target.dataset.id

        history.push(`/${client}/SROISettingsDetail/${ID}`)

    }

    const deleteSROI = (e) => {

        const docid = e.target.dataset.docid

        db.collection('SROIs')
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
                <h1>SROI</h1>
            </div>
            <div className='divider'>
                <h2>SROI toevoegen</h2>
                <Link to={`/${client}/AddSROI`} ><img id="plus-icon-goal-settings" src={plusIcon} alt="" /></Link>
            </div>
            <div className='divider'>
                <h2>SROI's</h2>
            {SROIs && SROIs.map(SROI => (
                <div id="members-container" key={SROI.ID}>
                    <p>{SROI.Title}</p>
                    <div className='icon-container-activities'>
                        <img src={settingsIcon} alt="" className="userrole-users-delete-button" data-id={SROI.ID} onClick={SROILink}/>
                        <img src={deleteIcon} alt="" className="userrole-users-delete-button" data-docid={SROI.docid} onClick={deleteSROI} />
                    </div>
                </div>
            ))}
        </div>
        </div>
    </div>
    <RightSideBar />
    </div>
  )
}

export default SROI