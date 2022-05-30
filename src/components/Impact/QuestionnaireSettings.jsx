import LeftSideBar from "../LeftSideBar";
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import Location from "../../hooks/Location"
import MenuStatus from "../../hooks/MenuStatus";
import { useHistory } from "react-router-dom";
import { client } from "../../hooks/Client"
import plusIcon from '../../images/icons/plus-icon.png'
import { useFirestore, useFirestoreQuestionnaireFields } from "../../firebase/useFirestore"
import { db } from "../../firebase/config.js"
import penIcon from '../../images/icons/pen-icon.png'
import { NavLink } from "react-router-dom";
import Premium from "../../hooks/Premium";
import PremiumNotice from "../PremiumNotice";
import NoContentNotice from "../../hooks/NoContentNotice";

const QuestionnaireSettings = () => {

    const menuState = MenuStatus()
    const history = useHistory()
    const premium = Premium() 

    const questionnaires = useFirestore('Questionnaires')

    const FieldCount = ({questionnaire}) => {

        const questionnaireFields = useFirestoreQuestionnaireFields(questionnaire.ID)

        return(
            <p>{questionnaireFields.length}</p>
        )

    }

  return (
    <div className="main">
    <LeftSideBar />
    <LeftSideBarFullScreen/>
    <div className="main-container" style={{display: menuState}}>
        <div className='page-header'>
            <h1>Vragenlijsten</h1>
                <div className='edit-icon-header-container'>
                    <NavLink activeClassName='active' to={`/${client}/Questionnaires`}>
                        <img src={penIcon} alt="" />
                    </NavLink>
                </div>
        </div>
        <div className='profile profile-auth-profile' style={{display: premium ? 'flex' : 'none'}}>
            <div className='table-container'>
                <table>
                    <tr>
                        <th>TITEL</th>
                        <th>VRAGEN</th>
                    </tr>
                    {questionnaires && questionnaires.map(questionnaire => (
                        <tr>
                            <td>{questionnaire.Title}</td>
                            <td> <FieldCount questionnaire={questionnaire}/></td>
                        </tr>
                    ))}
                </table>
            </div>
        </div>
        <div className='premium-notice-outer-container' style={{display: premium ? 'none' : 'flex'}}>
            <PremiumNotice/>
        </div>
        {NoContentNotice(questionnaires, 'Questionnaires')}
    </div>
</div>
  )
}

export default QuestionnaireSettings
