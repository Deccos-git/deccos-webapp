import {useFirestore} from "../../firebase/useFirestore"
import LeftSideBar from "../LeftSideBar"
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import MenuStatus from "../../hooks/MenuStatus";
import arrowUpIcon from '../../images/icons/arrow-up-icon-white.png'
import penIcon from '../../images/icons/pen-icon.png'
import { NavLink, Link } from "react-router-dom";
import { client } from '../../hooks/Client';

const ProblemAnalyseDetail = () => {

    const problemAnalysis  = useFirestore("ProblemAnalysis")
    const menuState = MenuStatus()


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
            {problemAnalysis && problemAnalysis.map(problem => (
                 <div>
                <div className='problem-analysis-card'>
                    <div className='problem-analysis-card-title-container'>
                        <h3>Verdere gevolgen</h3>
                    </div>
                    <div>
                        <ol>
                            {problem.IndirectConsequences && problem.IndirectConsequences.map(indirectconsequence => (
                                <li>
                                    <div className='problem-list-inner-container'>
                                        {indirectconsequence}
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
                <div className='problemanalysis-arrow-container'>
                    <img src={arrowUpIcon} alt="" />
                </div>
                <div className='problem-analysis-card'>
                    <div className='problem-analysis-card-title-container'>
                        <h3>Directe gevolgen</h3>
                    </div>
                    <div>
                        <ol>
                            {problem.DirectConsequences && problem.DirectConsequences.map(directconsequence => (
                                <li>
                                    <div className='problem-list-inner-container'>
                                        {directconsequence}
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
                <div className='problemanalysis-arrow-container'>
                    <img src={arrowUpIcon} alt="" />
                </div>
                <div className='problem-analysis-card central-problem-card'>
                    <h2 id='central-problem'>Centrale probleem</h2>
                    <p>{problem.CentralProblem}</p>
                </div>
                <div className='problemanalysis-arrow-container'>
                    <img src={arrowUpIcon} alt="" />
                </div>
                <div className='problem-analysis-card'>
                    <div className='problem-analysis-card-title-container'>
                        <h3>Directe oorzaken</h3>
                    </div>
                    <div>
                        <ol>
                            {problem.DirectCauses && problem.DirectCauses.map(directcause => (
                                <li>
                                    <div className='problem-list-inner-container'>
                                        {directcause}
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
                <div className='problemanalysis-arrow-container'>
                    <img src={arrowUpIcon} alt="" />
                </div>
                <div className='problem-analysis-card'>
                    <div className='problem-analysis-card-title-container'>
                        <h3>Achterliggende oorzaken</h3>
                    </div>
                    <div>
                        <ol>
                            {problem.IndirectCauses && problem.IndirectCauses.map(indirectcause => (
                            <li>
                                <div className='problem-list-inner-container'>
                                    {indirectcause}
                                </div>
                            </li>
                            ))}
                        </ol>
                    </div>
                </div>  
            </div>  
            ))
            }
        </div>
    </div>
</div>
  )
}

export default ProblemAnalyseDetail