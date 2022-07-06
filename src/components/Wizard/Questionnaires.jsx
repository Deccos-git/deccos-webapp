import LeftSideBar from "../LeftSideBar"
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import MenuStatus from "../../hooks/MenuStatus";
import arrowLeft from '../../images/icons/arrow-left-icon.png'
import arrowRight from '../../images/icons/arrow-right-icon.png'
import capIcon from '../../images/icons/cap-icon.png'
import rocketIcon from '../../images/icons/rocket-icon.png'
import bulbIcon from '../../images/icons/bulb-icon.png'
import feetIcon from '../../images/icons/feet-icon.png'
import { useFirestore, useFirestoreQuestionnaireFields, useFirestoreOpenSourceQuestionnnaires, useFirestoreOpenSourceQuestionnnairesID } from "../../firebase/useFirestore";
import { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import uuid from 'react-uuid';
import {ReactComponent as QuestionIcon}  from '../../images/icons/question-icon.svg'
import { client } from '../../hooks/Client';
import { NavLink, Link } from "react-router-dom";
import penIcon from '../../images/icons/pen-icon.png'
import deleteIcon from '../../images/icons/delete-icon.png'
import plusButton from '../../images/icons/plus-icon.png'
import { db, timestamp } from "../../firebase/config.js"
import Premium from "../../hooks/Premium";
import PremiumNotice from "../PremiumNotice";
import ImpactGuideMenu from "../../hooks/ImpactGuideMenu";
import eyeIcon from '../../images/icons/eye-icon.png'
import dashboardIcon from '../../images/icons/dashboard-icon.png'
import listIcon from '../../images/icons/list-icon.png'
import ScrollToTop from "../../hooks/ScrollToTop";
import { SavedIcon } from "../../StateManagment/SavedIcon";
import { Auth } from '../../StateManagment/Auth';
import { MobileMenu } from '../../StateManagment/MobileMenu';
import Modal from 'react-modal';

const Questionnaires = () => {
    const [saved, setSaved] = useContext(SavedIcon)
    const [admin, setAdmin] = useState('none')
    const [authO] = useContext(Auth)
    const [modalOpen, setModalOpen] = useState(false);
    const [modalOpenSourceOpen, setModalOpenSourceOpen] = useState(false);
    const [openSourceQuestionnaireID, setOpenSourceQuestionnaireID] = useState(null)
    const [openSourceTitle, setOpenSourceTitle] = useState('')
    const [openSourceShortHand, setOpenSourceShortHand] = useState('')
    const [openSourceCategory, setOpenSourceCategory] = useState('')
    const [openSourceTargetGroup, setOpenSourceTargetGroup] = useState('')
    const [openSourceEvidenceBased, setOpenSourceEvidenceBased] = useState('')
    const [openSourceAuthor, setOpenSourceAuthor] = useState('')
    const [openSourceLink, setOpenSourceLink] = useState('')
    const [selectedOpenSourceQuestionnaireTitle, setSelectedOpenSourceQuestionnaireTitle] = useState(null)
    const [selectedOpenSourceQuestionnaireID, setSelectedOpenSourceQuestionnaireID] = useState(null)

    useEffect(() => {
        if(authO.ID == '6a8bf-08c3-a1ad-d04d-231ebe51dc60'){
            setAdmin('flex')
        } else {
            setAdmin('none')
        }
    }, [authO])

    const [name, setName] = useState('')

    const history = useHistory()
    const menuState = MenuStatus() 
    const id = uuid()
    const premium = Premium() 
    ScrollToTop()
    Modal.setAppElement('#root');

    const modalStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
        },
      };
    
    const questionnaires = useFirestore('Questionnaires')
    const openSourceQuestionnaires = useFirestoreOpenSourceQuestionnnaires()
    const selectedOpenSourceQuestionnaire = useFirestoreOpenSourceQuestionnnairesID(openSourceQuestionnaireID && openSourceQuestionnaireID)
    const compagny = useFirestore('CompagnyMeta')

    useEffect(() => {
        compagny && compagny.forEach(comp => {
            setName(comp.CommunityName)
        })
    })

    const deleteQuestionnaire = (e) => {
        const docid = e.target.dataset.docid

        db.collection('Questionnaires')
        .doc(docid)
        .delete()
    }

    const viewQuestionnaire = (e) => {

        const id = e.target.dataset.id

        history.push(`/${client}/AddQuestionnaire/${id}`)
    }

    const addQuestionnaire = () => {
        db.collection('Questionnaires')
        .doc()
        .set({
            ID: id,
            Timestamp: timestamp,
            Compagny: client,
            CompagnyID: client,
        })
    }

    const titleHandler = (e) => {
        const docid = e.target.dataset.docid 
        const title = e.target.value

        db.collection('Questionnaires')
        .doc(docid)
        .update({
            Title: title
        })
        .then(() => {
            setSaved('flex')
         })

    }

    const FieldCount = ({questionnaire}) => {

        const questionnaireFields = useFirestoreQuestionnaireFields(questionnaire.ID)

        return(
            <p>{questionnaireFields.length}</p>
        )

    }

    const addOpenSourceQuestionnaire = () => {

        db.collection('OpenSourceQuestionnaires')
        .doc()
        .set({
            ID: uuid(),
            Timestamp: timestamp,
            Title: openSourceTitle,
            Shorthand: openSourceShortHand,
            Category: openSourceCategory,
            TargetGroup: openSourceTargetGroup,
            EvidenceBased: openSourceEvidenceBased,
            Author: openSourceAuthor,
            Link: openSourceLink,

        })
        .then(setModalOpen(false))
    }

    const openSourceTitleHandler = (e) => {

        const value = e.target.value 

        setOpenSourceTitle(value)

    }

    const openSourceShortHandHandler = (e) => {

        const value = e.target.value 

        setOpenSourceShortHand(value)

    }

    const openSourceCategoryHandHandler = (e) => {

        const value = e.target.value 

        setOpenSourceCategory(value)

    }

    const openSourceTargetGroupHandHandler = (e) => {

        const value = e.target.value 

        setOpenSourceTargetGroup(value)

    }

    const openSourceEvidenceBasedHandHandler = (e) => {

        const value = e.target.value 

        setOpenSourceEvidenceBased(value)

    }

    const openSourceAuthorHandHandler = (e) => {

        const value = e.target.value 

        setOpenSourceAuthor(value)

    }

    const openSourceLinkHandHandler = (e) => {

        const value = e.target.value 

        setOpenSourceLink(value)

    }

    const editOpenSourceQuestionnaire = (e) => {

        const id = e.target.dataset.id

        history.push(`/${client}/Questionnaire/${id}`)
    }

    const copyOpenSourceQuestionnaire = async (e) => {

        const id = e.target.dataset.id

        setOpenSourceQuestionnaireID(id)

        selectedOpenSourceQuestionnaire && selectedOpenSourceQuestionnaire.forEach(questionnaire => {
            const title = questionnaire.Title 

            setSelectedOpenSourceQuestionnaireTitle(title)
            setSelectedOpenSourceQuestionnaireID(id)

            setModalOpenSourceOpen(true)
        })
        
    }

    const saveSelectedOpenSourceQuestionnaire = () => {

        db.collection('Questionnaires')
        .doc()
        .set({
            ID: selectedOpenSourceQuestionnaireID,
            Timestamp: timestamp,
            Compagny: client,
            CompagnyID: client,
            Title: selectedOpenSourceQuestionnaireTitle
        })
        .then(() => {
            setModalOpenSourceOpen(false)
        })
    } 

    const showOpenSourceQuestionnaire = (e) => {

        const id = e.target.dataset.id

        history.push(`/${client}/OpenSourceQuestionnaire/${id}`)


    }


  return (
    <div className="main">
        <LeftSideBar />
        <LeftSideBarFullScreen/>
        <div className="main-container" style={{display: menuState}}>
            <div className="page-header">
                <h1>Vragenlijsten</h1>
                <div className='wizard-sub-nav'>
                    <NavLink to={`/${client}/MeasureOutput`} >
                        <div className='step-container'>
                            <img src={arrowLeft} alt="" />
                            <p>Mijlpalen stellen</p>
                        </div>
                    </NavLink>  
                    {ImpactGuideMenu(17)}
                    <NavLink to={`/${client}/Research`} >
                        <div className='step-container'>
                            <p>Onderzoek opzetten</p>
                            <img src={arrowRight} alt="" />
                        </div>
                    </NavLink>
                </div>
            </div>
            <div className='profile profile-auth-profile'>
                <div>
                    <div className='activity-meta-title-container'>
                        <img src={capIcon} alt="" />
                        <h3>Uitleg</h3>
                    </div> 
                <div className='text-section'>
                   <p><b>Vragenlijsten zijn een handig middel om de impact die je 
                       maakt op je doelgroep te achterhalen.</b></p>
                    <p>
                        Op Deccos kun je zelf een vragenlijst maken en delen of gebruik maken van bestaande vragenlijsten.
                    </p>
                </div>
                <div>
                    <div className='activity-meta-title-container'>
                        <img src={rocketIcon} alt="" />
                        <h3>Aan de slag</h3>
                    </div> 
                    <div className='text-section'>
                        <div style={{display: premium ? 'block' : 'none'}}>
                            <p><b>Vragenlijsten van {name}</b></p>
                            <div className='list-container'>
                                <div className='list-top-row-container'>
                                        <img src={plusButton} alt="" onClick={addQuestionnaire}/>
                                </div>
                                <div className='table-container'>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>TITEL</th>
                                                <th>VRAGEN</th>
                                                <th>AANPASSEN</th>
                                                <th>VERWIJDER</th>
                                            </tr>
                                        </thead>
                                        {questionnaires && questionnaires.map(questionnaire => (
                                            <tr key={questionnaires.ID}>
                                                <td>
                                                    <input type="text" placeholder="Schrijf hier de titel" data-docid={questionnaire.docid} defaultValue={questionnaire.Title} onChange={titleHandler}/>
                                                </td>
                                                <td>
                                                    <FieldCount questionnaire={questionnaire}/>
                                                </td>
                                                <td>
                                                    <img className='table-delete-icon' data-id={questionnaire.ID} onClick={viewQuestionnaire} src={penIcon} alt="" />
                                                </td>
                                                <td>
                                                    <img className='table-delete-icon' data-docid={questionnaire.docid} onClick={deleteQuestionnaire} src={deleteIcon} alt="" />
                                                </td>
                                            </tr>
                                        ))}
                                    </table>
                                </div>
                            </div>
                            <p><b>Open source vragenlijsten</b></p>
                            <div className='list-container'>
                                <div className='list-top-row-container'>
                                    <img src={plusButton} alt="plus icon" onClick={() => setModalOpen(true)} style={{display: admin}} />
                                </div>
                                <div className='table-container'>
                                    <table>
                                        <tr>
                                            <th>TITEL</th>
                                            <th>AFKORTING</th>
                                            <th>CATEGORIE</th>
                                            <th>DOELGROEP</th>
                                            <th>EVIDENCE BASED</th>
                                            <th>AUTHOR</th>
                                            <th>BEKIJK</th>
                                            <th>TOEVOEGEN</th>
                                            <th style={{display: admin}} >AANPASSEN</th>
                                        </tr>
                                        {openSourceQuestionnaires && openSourceQuestionnaires.map(questionnaire => (
                                            <tr key={questionnaire.ID}>
                                                <td>
                                                    <a href={questionnaire.Link} target='_blank'><p>{questionnaire.Title}</p></a>
                                                </td>
                                                <td>
                                                    <p>{questionnaire.Shorthand}</p>
                                                </td>
                                                <td>
                                                    <p>{questionnaire.Category}</p>
                                                </td>
                                                <td>
                                                    <p>{questionnaire.TargetGroup}</p>
                                                </td>
                                                <td>
                                                    <p>{questionnaire.EvidenceBased}</p>
                                                </td>
                                                <td>
                                                    <p>{questionnaire.Author}</p>
                                                </td>
                                                <td>
                                                    <img className='table-delete-icon' data-id={questionnaire.ID} src={eyeIcon} alt="eye icon" onClick={showOpenSourceQuestionnaire} />
                                                </td>
                                                <td>
                                                    <img className='table-delete-icon' src={plusButton} data-id={questionnaire.ID} alt="plus icon" onClick={copyOpenSourceQuestionnaire} />
                                                </td>
                                                <td className='open-source-pen-icon-container' style={{display: admin}}>
                                                    <img className='table-delete-icon' className='table-delete-icon' data-id={questionnaire.ID} onClick={editOpenSourceQuestionnaire} src={penIcon} alt="" />
                                                </td>
                                            </tr>
                                        ))}
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div style={{display: premium ? 'none' : 'flex'}}>
                            <PremiumNotice/>
                        </div>
                    </div>
                    </div>
                </div>
                <div>
                    <div className='activity-meta-title-container'>
                        <img src={eyeIcon} alt="" />
                        <h3>Bekijk</h3>
                    </div> 
                    <div className='text-section'>
                        <p><b>Je kunt je de vragenlijsten hier terug vinden:</b></p>
                        <div className="channel-inner-div">
                        <div className='activity-meta-title-container'>
                            <img src={listIcon} alt="" />
                            <NavLink activeClassName='active' to={`/${client}/QuestionnaireSettings`}>Vragenlijsten</NavLink>
                        </div>
                    </div>
                    </div>
                </div>
                <div>
                    <div className='activity-meta-title-container'>
                        <img src={bulbIcon} alt="" />
                        <h3>Tips</h3>
                    </div> 
                    <div className='text-section'>
                        <ol>
                            <li>
                                Kom je er niet uit of heb je behoefte aan ondersteuning van een impactexpert? 
                                Klik op het 
                                <NavLink to={`/${client}/Support`} >
                                    <QuestionIcon style={{width: '19px', height: '19px'}}/> 
                                </NavLink>
                                icon in de 
                                bovenbalk (onderbalk op mobiel) voor alle ondersteuningsmogelijkheden.
                            </li>
                            <li>Benieuwd naar de impact van andere sociale MKB'ers? Neem eens een kijkje in de <a href="https://deccos.nl/Milestones">Deccos Impactclub</a>.</li>
                        </ol>
                    </div>
                </div>
                <div>
                    <div className='activity-meta-title-container'>
                        <img src={feetIcon} alt="" />
                        <h3>Volgende stap</h3>
                    </div> 
                    <div className='text-section'>
                        <p>In de volgende stap ga je een onderzoek vormgeven.</p>
                        <NavLink to={`/${client}/Research`} ><button>Volgende stap</button></NavLink>
                    </div>
                </div>
            </div> 
        </div>
        <Modal
            isOpen={modalOpen}
            onRequestClose={() => setModalOpen(false)}
            style={modalStyles}
            contentLabel="Add open source questionnaire"
            >
            <div className='add-image-container'>
                <h4>Voeg een open source vragenlijst toe</h4>
                <h4>Titel</h4>
                <input type="text" placeholder='Beschrijf hier de titel' onChange={openSourceTitleHandler}/>
                <h4>Afkorting</h4>
                <input type="text" placeholder='Beschrijf hier de afkorting' onChange={openSourceShortHandHandler}/>
                <h4>Categorie</h4>
                <input type="text" placeholder='Beschrijf hier de categorie' onChange={openSourceCategoryHandHandler}/>
                <h4>Doelgroep</h4>
                <input type="text" placeholder='Beschrijf hier de doelgroep' onChange={openSourceTargetGroupHandHandler}/>
                <h4>Evidence based</h4>
                <input type="text" placeholder='Beschrijf hier de mate van evidence based' onChange={openSourceEvidenceBasedHandHandler}/>
                <h4>Auteur</h4>
                <input type="text" placeholder='Beschrijf hier de auteur' onChange={openSourceAuthorHandHandler}/>
                <h4>Link</h4>
                <input type="text" placeholder='Beschrijf hier de link' onChange={openSourceLinkHandHandler}/>
                <button onClick={addOpenSourceQuestionnaire}>Opslaan</button>
            </div>
        </Modal>
        <Modal
            isOpen={modalOpenSourceOpen}
            onRequestClose={() => setModalOpenSourceOpen(false)}
            style={modalStyles}
            contentLabel="Copy open source questionnaire"
            >
            <div className='add-image-container'>
                <h4>Open source vragenlijst toevoegen</h4>
                <p>{selectedOpenSourceQuestionnaireTitle}</p>
                <button onClick={saveSelectedOpenSourceQuestionnaire}>Toevoegen</button>
            </div>
        </Modal>
    </div>
  )
}

export default Questionnaires