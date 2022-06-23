import {useFirestore, useFirestoreProblemAnalyses} from "../../firebase/useFirestore"
import LeftSideBar from "../LeftSideBar"
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import MenuStatus from "../../hooks/MenuStatus";
import arrowDownIcon from '../../images/icons/arrow-down-icon.png'
import penIcon from '../../images/icons/pen-icon-white.png'
import { NavLink, Link } from "react-router-dom";
import { client } from '../../hooks/Client';
import { useHistory } from "react-router-dom";
import NoContentNotice from "../../hooks/NoContentNotice";
import ScrollToTop from "../../hooks/ScrollToTop";
import { useState, useEffect } from "react";

const ProblemAnalyseDetail = () => {
    const [centralProblemID, setCentralProblemID] = useState('')

    const menuState = MenuStatus()
    const history = useHistory()
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
    

  return (
    <div className="main">
    <LeftSideBar />
    <LeftSideBarFullScreen/>
    <div className="main-container" style={{display: menuState}}>
        <div className="page-header">
            <h1>Probleemanalyse</h1>
            <div className='edit-icon-header-container'>
                <NavLink activeClassName='active' to={`/${client}/ProblemAnalysis`}>
                    <img src={penIcon} alt="" />
                </NavLink>
            </div>
        </div>
        <div className="card-container">

            <div id='problem-analysis-container'>
                <div className='problem-analysis-card'>
                    <div className='problem-analysis-card-title-container'>
                        <h3>Achterliggende oorzaken</h3>
                    </div>
                    <div>
                        <ol>
                            {indirectCauses && indirectCauses.map(indirectcause => (
                            <li>
                                <div className='problem-list-inner-container'>
                                    {indirectcause.IndirectCause}
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
                        <h3>Directe oorzaken</h3>
                    </div>
                    <div>
                        <ol>
                            {directCauses && directCauses.map(directcause => (
                                <li>
                                    <div className='problem-list-inner-container'>
                                        {directcause.DirectCause}
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>

                <div className='problemanalysis-arrow-container'>
                    <img src={arrowDownIcon} alt="" />
                </div>

                <div className='problem-analysis-card central-problem-card'>
                    <h2 id='central-problem'>Centrale probleem</h2>
                    {centralProblem && centralProblem.map(problem => (
                        <p>{problem.CentralProblem}</p>
                    ))}
                </div>

                <div className='problemanalysis-arrow-container'>
                    <img src={arrowDownIcon} alt="" />
                </div>

                <div className='problem-analysis-card'>
                    <div className='problem-analysis-card-title-container'>
                        <h3>Directe gevolgen</h3>
                    </div>
                    <div>
                        <ol>
                            {directConsequences && directConsequences.map(directconsequence => (
                                <li>
                                    <div className='problem-list-inner-container'>
                                        {directconsequence.DirectConsequence}
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
                        <h3>Verdere gevolgen</h3>
                    </div>
                    <div>
                        <ol>
                            {indirectConsequences && indirectConsequences.map(indirectconsequence => (
                                <li>
                                    <div className='problem-list-inner-container'>
                                        {indirectconsequence.IndirectConsequence}
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>

            </div>  
        </div>
        {NoContentNotice(centralProblem, 'ProblemAnalysis')}
    </div>
</div>
  )
}

export default ProblemAnalyseDetail