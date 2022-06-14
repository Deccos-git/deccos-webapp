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
import arrowDownIcon from '../../images/icons/arrow-down-icon.png'
import { useFirestore, useFirestoreProblemAnalyses } from "../../firebase/useFirestore";
import { useState, useEffect, useContext } from "react";
import uuid from 'react-uuid';
import {ReactComponent as QuestionIcon}  from '../../images/icons/question-icon.svg'
import { client } from '../../hooks/Client';
import { NavLink, Link } from "react-router-dom";
import { db, timestamp } from "../../firebase/config.js"
import deleteIcon from '../../images/icons/delete-icon.png'
import eyeIcon from '../../images/icons/eye-icon.png'
import ImpactGuideMenu from "../../hooks/ImpactGuideMenu";
import problemIcon from '../../images/icons/problem-icon.png'
import ScrollToTop from "../../hooks/ScrollToTop";
import { SavedIcon } from "../../StateManagment/SavedIcon";

const ProblemAnalysis = () => {
    const [saved, setSaved] = useContext(SavedIcon)

    const [centralProblemID, setCentralProblemID] = useState('')


    const menuState = MenuStatus() 
    ScrollToTop()
    
    const centralProblem = useFirestore('CentralProblem')
    const directCauses = useFirestoreProblemAnalyses('DirectCauses', centralProblemID && centralProblemID)
    const indirectCauses = useFirestoreProblemAnalyses('IndirectCauses', centralProblemID && centralProblemID)
    const indirectConsequences = useFirestoreProblemAnalyses('IndirectConsequences', centralProblemID && centralProblemID)
    const directConsequences = useFirestoreProblemAnalyses('DirectConsequences', centralProblemID && centralProblemID)

    useEffect(() => {
      centralProblem && centralProblem.forEach(problem => {
          setCentralProblemID(problem.ID)
      })
    }, [centralProblem])
    

    const centralProblemHandler = (e) => {
        const centralProblem = e.target.value 
        const docid = e.target.dataset.docid

        db.collection('CentralProblem')
        .doc(docid)
        .update({
            CentralProblem: centralProblem
        })
        .then(() => {
           setSaved('flex')
        })
    }

    const directCauseHandler = (e) => {
        const docid = e.target.dataset.docid
        const directCause = e.target.value

        db.collection('DirectCauses')
        .doc(docid)
        .update({
            DirectCause: directCause
        })
        .then(() => {
           setSaved('flex')
        })
    }

    const indirectCauseHandler = (e) => {
        const docid = e.target.dataset.docid
        const indirectCause = e.target.value 

        db.collection('IndirectCauses')
        .doc(docid)
        .update({
            IndirectCause: indirectCause
        })
        .then(() => {
           setSaved('flex')
        })
    }

    const directConsequenceHandler = (e) => {
        const directConsequence = e.target.value 
        const docid = e.target.dataset.docid

        db.collection('DirectConsequences')
        .doc(docid)
        .update({
            DirectConsequence: directConsequence
        })
        .then(() => {
           setSaved('flex')
        })
    }

    const indirectConsequenceHandler = (e) => {
        const indirectConsequence = e.target.value 
        const docid = e.target.dataset.docid

        db.collection('IndirectConsequences')
        .doc(docid)
        .update({
            IndirectConsequence: indirectConsequence
        })
        .then(() => {
           setSaved('flex')
        })
    }

    const createIndirectConsequence = (e) => {
        db.collection('IndirectConsequences')
        .doc()
        .set({
            CompagnyID: client,
            CentralProblemID: centralProblemID,
            ID: uuid(),
            Timestamp: timestamp,
            IndirectConsequence: ''
        })
    }

    const deleteIndirectConsequence = (e) => {

        const docid = e.target.dataset.docid

        db.collection('IndirectConsequences')
        .doc(docid)
        .delete()
    }

    const createDirectConsequence = (e) => {
        db.collection('DirectConsequences')
        .doc()
        .set({
            CompagnyID: client,
            CentralProblemID: centralProblemID,
            ID: uuid(),
            Timestamp: timestamp,
            DirectConsequence: ''
        })
    }

    const deletedirectConsequence = (e) => {

        const docid = e.target.dataset.docid

        db.collection('DirectConsequences')
        .doc(docid)
        .delete()
    }

    const createDirectCause = (e) => {
        db.collection('DirectCauses')
        .doc()
        .set({
            CompagnyID: client,
            CentralProblemID: centralProblemID,
            ID: uuid(),
            Timestamp: timestamp,
            DirectCause: ''
        })
    }

    const deleteDirectCause = (e) => {

        const docid = e.target.dataset.docid

        db.collection('DirectCauses')
        .doc(docid)
        .delete()
    }

    const createIndirectCause = (e) => {
        db.collection('IndirectCauses')
        .doc()
        .set({
            CompagnyID: client,
            CentralProblemID: centralProblemID,
            ID: uuid(),
            Timestamp: timestamp,
            IndirectCause: ''
        })
    }

    const deleteIndirectCause = (e) => {

        const docid = e.target.dataset.docid

        db.collection('IndirectCauses')
        .doc(docid)
        .delete()
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
                {ImpactGuideMenu(2)}
                <NavLink to={`/${client}/StakeholderAnalysis`} >
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
                <div className='text-section'>
                    <p><b>Het eerste aspect van je impact management is de probleemanalyse.</b></p>
                    <p>Als sociale organisatie wil je een maatschappelijk probleem oplossen. 
                        Aangezien dit maatschappelijke probleem zo essentieel is voor een sociale organisatie is het 
                        belangrijk om het probleem helder voor ogen te hebben. Dat geeft inzicht in de aard van het 
                        probleem en geeft richting aan de oplossing die jullie als organisatie willen aandragen.
                    </p>
                    <p>
                        Om het maatschappelijke probleem inzichtelijk te krijgen beginnen we met formuleren van het 
                        centrale probleem. Het is belangrijk om daar concreet in te zijn: 
                    </p>
                    <ul>
                        <li>Wie heeft het probleem?</li>
                        <li>Wat is het probleem precies?</li>
                        <li>Waar vindt het probleem plaats?</li>
                        <li>Wanneer vindt het probleem plaats?</li>
                        <li>Etc.</li>
                    </ul>
                    <p>
                        Wanneer het centrale probleem is geformuleerd onderzoek je wat de directe en indirecte oorzaken 
                        en gevolgen zijn van het probleem.
                    </p>
                    <p>
                        De directe oorzaken hebben een rechtstreekse invloed op het centrale probleem. 
                        De indirecte oorzaken zorgen ervoor dat de directe oorzaken zijn ontstaan. 
                    </p>
                    <p>
                        De directe gevolgen worden rechtstreeks door het centrale probleem veroorzaakt. 
                        De indirecte gevolgen zijn een consequentie van de directe gevolgen.
                    </p>
                </div>
            </div>
            <div>
                <div className='activity-meta-title-container'>
                    <img src={rocketIcon} alt="" />
                    <h3>Aan de slag</h3>
                </div> 
                <div className='text-section'>

                    <div className='problem-analysis-card'>
                        <div className='problem-analysis-card-title-container'>
                            <p>Achterliggende oorzaken</p>
                            <img src={plusIcon} alt="" onClick={createIndirectCause} />
                        </div>
                        <div>
                            <ol>
                                {indirectCauses && indirectCauses.map(indirectcause => (
                                <li key={indirectcause.ID}>
                                    <div className='problem-list-inner-container'>
                                        <input type="text" data-docid={indirectcause.docid} defaultValue={indirectcause.IndirectCause} onChange={indirectCauseHandler}/>
                                        <img src={deleteIcon} data-docid={indirectcause.docid} onClick={deleteIndirectCause} />
                                    </div>
                                </li>
                                ))}
                            </ol>
                        </div>
                    </div>

                    <div className='problemanalysis-arrow-container'>
                        <img src={arrowDownIcon} alt="" />
                    </div>

                    <div className='problem-analysis-card'>
                        <div className='problem-analysis-card-title-container'>
                            <p>Directe oorzaken</p>
                            <img src={plusIcon} alt="" onClick={createDirectCause}/>
                        </div>
                        <div>
                            <ol>
                            {directCauses && directCauses.map(directCause => (
                                    <li key={directCause.ID}>
                                        <div className='problem-list-inner-container'>
                                            <input type="text" data-docid={directCause.docid} defaultValue={directCause.DirectCause} onChange={directCauseHandler}/>
                                            <img src={deleteIcon} data-docid={directCause.docid} onClick={deleteDirectCause} />
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>

                    <div className='problemanalysis-arrow-container'>
                        <img src={arrowDownIcon} alt="" />
                    </div>

                    {centralProblem && centralProblem.map(problem => (
                        <div className='problem-analysis-card central-problem-card'>
                            <p id='central-problem'>Centrale probleem</p>
                            <input type="text" data-docid={problem.docid} defaultValue={problem.CentralProblem} placeholder='Noteer hier het centrale probleem' onChange={centralProblemHandler} />
                        </div>
                    ))}

                    <div className='problemanalysis-arrow-container'>
                        <img src={arrowDownIcon} alt="" />
                    </div>

                    <div className='problem-analysis-card'>
                        <div className='problem-analysis-card-title-container'>
                            <p>Directe gevolgen</p>
                            <img src={plusIcon} alt="" onClick={createDirectConsequence} />
                        </div>
                        <div>
                            <ol>
                                {directConsequences && directConsequences.map(directconsequence => (
                                    <li key={directconsequence.ID}>
                                        <div className='problem-list-inner-container'>
                                            <input type="text" data-docid={directconsequence.docid} defaultValue={directconsequence.DirectConsequence} onChange={directConsequenceHandler}/>
                                            <img src={deleteIcon} data-docid={directconsequence.docid} onClick={deletedirectConsequence} />
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>

                    <div className='problemanalysis-arrow-container'>
                        <img src={arrowDownIcon} alt="" />
                    </div>

                    <div className='problem-analysis-card'>
                        <div className='problem-analysis-card-title-container'>
                            <p>Verdere gevolgen</p>
                            <img src={plusIcon} alt="" onClick={createIndirectConsequence} />
                        </div>
                        <div>
                            <ol>
                                {indirectConsequences && indirectConsequences.map(indirectconsequence => (
                                    <li key={indirectconsequence.ID}>
                                        <div className='problem-list-inner-container'>
                                            <input type="text" data-docid={indirectconsequence.docid} defaultValue={indirectconsequence.IndirectConsequence} onChange={indirectConsequenceHandler}/>
                                            <img src={deleteIcon} data-docid={indirectconsequence.docid} onClick={deleteIndirectConsequence} />
                                        </div>
                                    </li>
                                ))}
                            </ol>
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
                    <p><b>Je kunt je probleemanalyse hier terug vinden:</b></p>
                    <div className="channel-inner-div">
                        <div className='activity-meta-title-container'>
                            <img src={problemIcon} alt="" />
                            <NavLink to={`/${client}/ProblemAnalysisDetail`}>Probleemanalyse</NavLink>
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
                        <li>Kom je er niet uit of heb je behoefte aan ondersteuning van een impactexpert? 
                            Klik op het 
                            <NavLink to={`/${client}/Support`} >
                                <QuestionIcon style={{width: '19px', height: '19px'}}/> 
                            </NavLink>
                            icon in de 
                            bovenbalk (onderbalk op mobiel) voor alle ondersteuningsmogelijkheden.</li>
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
                    <p>In de volgende stap ga je de stakeholders in kaart brengen.</p>
                    <NavLink to={`/${client}/StakeholderAnalysis`} ><button>Volgende stap</button></NavLink>
                </div>
            </div>
        </div> 
    </div>
</div>
  )
}

export default ProblemAnalysis