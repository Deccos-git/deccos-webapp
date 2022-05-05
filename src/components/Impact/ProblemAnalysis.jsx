import LeftSideBar from "../LeftSideBar"
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import MenuStatus from "../../hooks/MenuStatus";
import arrowLeft from '../../images/icons/arrow-left-icon.png'
import arrowRight from '../../images/icons/arrow-right-icon.png'
import capIcon from '../../images/icons/cap-icon.png'
import rocketIcon from '../../images/icons/rocket-icon.png'
import bulbIcon from '../../images/icons/bulb-icon.png'
import feetIcon from '../../images/icons/feet-icon.png'
import plusIcon from '../../images/icons/plus-icon.png'
import { useFirestore } from "../../firebase/useFirestore";
import { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import uuid from 'react-uuid';
import {ReactComponent as QuestionIcon}  from '../../images/icons/question-icon.svg'
import { client } from '../../hooks/Client';
import { NavLink, Link } from "react-router-dom";
import { db, timestamp } from "../../firebase/config.js"
import ButtonClicked from "../../hooks/ButtonClicked";
import Modal from 'react-modal';
import firebase from 'firebase'

const ProblemAnalysis = () => {
    const [color, setColor] = useState('')
    const [centralProblem, setCentralProblem] = useState('')
    const [directCause, setDirectCause] = useState('')
    const [indirectCause, setIndirectCause] = useState([])
    const [directConsequence, setDirectConsequence] = useState([])
    const [indirectConsequence, setIndirectConsequence] = useState([])
    const [modalDirectCauseOpen, setModalDirectCauseOpen] = useState(false);
    const [modalIndirectCauseOpen, setModalIndirectCauseOpen] = useState(false);
    const [modalIndirectConsequencesOpen, setModalIndirectConsequencesOpen] = useState(false);
    const [modalDirectConsequencesOpen, setModalDirectConsequencesOpen] = useState(false);

    const history = useHistory()
    const menuState = MenuStatus() 
    const id = uuid()
    Modal.setAppElement('#root');
    
    const colors = useFirestore('Colors')
    const problemAnalysis = useFirestore('ProblemAnalysis') 

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

    useEffect(() => {
        colors && colors.forEach(color => {
            const background = color.Background 

            setColor(background)
        })

    },[colors])

    const centralProblemHandler = (e) => {
        const centralProblem = e.target.value 

        setCentralProblem(centralProblem)
    }

    const saveCentralProblem = (e) => {

        const docid = e.target.dataset.docid

        ButtonClicked(e, 'Opgeslagen')

        db.collection('ProblemAnalysis')
        .doc(docid)
        .update({
            CentralProblem: centralProblem
        })
    }

    const directCauseHandler = (e) => {
        const directCause = e.target.value 

        setDirectCause(directCause)
    }

    const indirectCauseHandler = (e) => {
        const indirectCause = e.target.value 

        setIndirectCause(indirectCause)
    }

    const directConsequenceHandler = (e) => {
        const directConsequence = e.target.value 

        setDirectConsequence(directConsequence)
    }

    const indirectConsequenceHandler = (e) => {
        const indirectConsequence = e.target.value 

        setIndirectConsequence(indirectConsequence)
    }

    const saveDirectCause = (e) => {
        const docid = e.target.dataset.docid

        ButtonClicked(e, 'Opgeslagen')

        db.collection('ProblemAnalysis')
        .doc(docid)
        .update({
            DirectCauses: firebase.firestore.FieldValue.arrayUnion(directCause)
        })
    }

    const saveIndirectCause = (e) => {
        const docid = e.target.dataset.docid

        ButtonClicked(e, 'Opgeslagen')

        db.collection('ProblemAnalysis')
        .doc(docid)
        .update({
            IndirectCauses: firebase.firestore.FieldValue.arrayUnion(indirectCause)
        })
    }

    const saveDirectConsequence = (e) => {
        const docid = e.target.dataset.docid

        ButtonClicked(e, 'Opgeslagen')

        db.collection('ProblemAnalysis')
        .doc(docid)
        .update({
            DirectConsequences: firebase.firestore.FieldValue.arrayUnion(directConsequence)
        })
    }

    const saveIndirectConsequence = (e) => {
        const docid = e.target.dataset.docid

        ButtonClicked(e, 'Opgeslagen')

        db.collection('ProblemAnalysis')
        .doc(docid)
        .update({
            IndirectConsequences: firebase.firestore.FieldValue.arrayUnion(indirectConsequence)
        })
    }


    const closeDirectCauseModal = () => {
        setModalDirectCauseOpen(false);
      }

    const closeIndirectCauseModal = () => {
        setModalIndirectCauseOpen(false);
    }

    const closeIndirectConsequencesModal = () => {
        setModalIndirectConsequencesOpen(false);
    }

    const closeDirectConsequencesModal = () => {
        setModalDirectConsequencesOpen(false);
    }



  return (
    <div className="main">
    <LeftSideBar />
    <LeftSideBarFullScreen/>
    <div className="main-container" style={{display: menuState}}>
        <div className="page-header">
            <h1>Probleemanalyse</h1>
            <div className='wizard-sub-nav'>
                <NavLink to={`/${client}/Explainer`} >
                    <div className='step-container'>
                        <img src={arrowLeft} alt="" />
                        <p>Wat is impact management?</p>
                    </div>
                </NavLink>  
                <p>2 van de 12</p>
                <NavLink to={`/${client}/Stakeholders`} >
                    <div className='step-container'>
                        <p>Stakeholders</p>
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
                <div className='text-section' style={{backgroundColor: color}}>
                    <p>Zorg ervoor dat je formulerening concreet zijn. </p>
                    <p>Betrek je stakeholders bij het verfijnen van je probleemanalyse.</p>
                </div>
            </div>
            <div>
                <div className='activity-meta-title-container'>
                    <img src={rocketIcon} alt="" />
                    <h3>Aan de slag</h3>
                </div> 
                <div className='text-section' style={{backgroundColor: color}}>
                    {problemAnalysis && problemAnalysis.map(problem => (
                    <div>
                         <Modal
                        isOpen={modalIndirectConsequencesOpen}
                        onRequestClose={closeIndirectConsequencesModal}
                        style={modalStyles}
                        contentLabel="Voeg een verder gevolg toe"
                        >
                        <div className='add-image-container'>
                            <img src={rocketIcon} alt="" />
                            <p>Voeg een verder gevolg toe</p>
                            <input onChange={indirectConsequenceHandler} type="text" />
                            <button className='button-simple' data-docid={problem.docid} onClick={saveIndirectConsequence}>Opslaan</button>
                        </div>
                        </Modal>
                        <div className='problem-analysis-card'>
                            <div className='problem-analysis-card-title-container'>
                                <p>Verdere gevolgen</p>
                                <img src={plusIcon} alt="" onClick={() => setModalIndirectConsequencesOpen(true)} />
                            </div>
                            <div>
                                <ol>
                                    {problem.IndirectConsequences && problem.IndirectConsequences.map(indirectconsequence => (
                                        <li>{indirectconsequence}</li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                        <Modal
                        isOpen={modalDirectConsequencesOpen}
                        onRequestClose={closeDirectConsequencesModal}
                        style={modalStyles}
                        contentLabel="Voeg een direct gevolg toe"
                        >
                        <div className='add-image-container'>
                            <img src={rocketIcon} alt="" />
                            <p>Voeg een direct gevolg toe</p>
                            <input onChange={directConsequenceHandler} type="text" />
                            <button className='button-simple' data-docid={problem.docid} onClick={saveDirectConsequence}>Opslaan</button>
                        </div>
                        </Modal>
                        <div className='problem-analysis-card'>
                            <div className='problem-analysis-card-title-container'>
                                <p>Directe gevolgen</p>
                                <img src={plusIcon} alt="" onClick={() => setModalDirectConsequencesOpen(true)} />
                            </div>
                            <div>
                                <ol>
                                    {problem.DirectConsequences && problem.DirectConsequences.map(directconsequence => (
                                        <li>{directconsequence}</li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                        <div className='problem-analysis-card central-problem-card'>
                            <p id='central-problem'>Centrale probleem</p>
                            <input type="text" defaultValue={problem.CentralProblem} placeholder='Noteer hier het centrale probleem' onChange={centralProblemHandler} />
                            <button className='button-simple' data-docid={problem.docid} onClick={saveCentralProblem}>Opslaan</button>
                        </div>
                        <Modal
                        isOpen={modalDirectCauseOpen}
                        onRequestClose={closeDirectCauseModal}
                        style={modalStyles}
                        contentLabel="Voeg een directe oorzaak toe"
                        >
                        <div className='add-image-container'>
                            <img src={rocketIcon} alt="" />
                            <p>Voeg een direct oorzaak toe</p>
                            <input onChange={directCauseHandler} type="text" />
                            <button className='button-simple' data-docid={problem.docid} onClick={saveDirectCause}>Opslaan</button>
                        </div>
                        </Modal>
                        <div className='problem-analysis-card'>
                            <div className='problem-analysis-card-title-container'>
                                <p>Directe oorzaken</p>
                                <img src={plusIcon} alt="" onClick={() => setModalDirectCauseOpen(true)}/>
                            </div>
                            <div>
                                <ol>
                                    {problem.DirectCauses && problem.DirectCauses.map(directcause => (
                                        <li>{directcause}</li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                        <Modal
                        isOpen={modalIndirectCauseOpen}
                        onRequestClose={closeIndirectCauseModal}
                        style={modalStyles}
                        contentLabel="Voeg een achterliggende oorzaak toe"
                        >
                        <div className='add-image-container'>
                            <img src={rocketIcon} alt="" />
                            <p>Voeg een achterliggende oorzaak toe</p>
                            <input onChange={indirectCauseHandler} type="text" />
                            <button className='button-simple' data-docid={problem.docid} onClick={saveIndirectCause}>Opslaan</button>
                        </div>
                        </Modal>
                        <div className='problem-analysis-card'>
                            <div className='problem-analysis-card-title-container'>
                                <p>Achterliggende oorzaken</p>
                                <img src={plusIcon} alt="" onClick={() => setModalIndirectCauseOpen(true)} />
                            </div>
                            <div>
                                <ol>
                                    {problem.IndirectCauses && problem.IndirectCauses.map(indirectcause => (
                                        <li>{indirectcause}</li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
            <div>
                <div className='activity-meta-title-container'>
                    <img src={bulbIcon} alt="" />
                    <h3>Tips</h3>
                </div> 
                <div className='text-section' style={{backgroundColor: color}}>
                    <ol>
                        <li>Kom je er niet uit of heb je behoefte aan ondersteuning van een impactexpert? 
                            Klik op het <QuestionIcon style={{width: '19px', height: '19px'}}/> icon in de 
                            bovenbalk (onderbalk op mobiel) voor alle ondersteuningsmogelijkheden.</li>
                    </ol>
                </div>
            </div>
            <div>
                <div className='activity-meta-title-container'>
                    <img src={feetIcon} alt="" />
                    <h3>Volgende stap</h3>
                </div> 
                <div className='text-section' style={{backgroundColor: color}}>
                    <p>In de volgende stap ga je de stakeholders in kaart brengen.</p>
                    <NavLink to={`/${client}/Stakeholders`} >
                        <button>Volgende stap</button>
                    </NavLink>
                </div>
            </div>
        </div> 
    </div>
</div>
  )
}

export default ProblemAnalysis