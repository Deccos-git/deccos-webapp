import LeftSideBar from "./LeftSideBar"
import LeftSideBarFullScreen from "./LeftSideBarFullScreen"
import Location from "../hooks/Location"
import MenuStatus from "../hooks/MenuStatus";
import { useFirestore } from "../firebase/useFirestore";
import { PieChart, Pie, Cell} from 'recharts';
import completeIcon from '../images/icons/complete-icon.png'

const Home = () => {

    const menuState = MenuStatus()

    const profile = useFirestore('CompagnyMeta')
    const indirectCauses = useFirestore('IndirectCauses')
    const directCauses = useFirestore('DirectCauses')
    const centralProblem = useFirestore('CentralProblem')
    const directConsequences = useFirestore('DirectConsequences')
    const indirectConsequences = useFirestore('IndirectConsequences')

    const currentProgressArray = []

    const addToProgress = (step) => {
        if(step){
            currentProgressArray.push(step)
        } else{
            return
        }
    }

    addToProgress(profile)
    addToProgress(indirectCauses)
    addToProgress(directCauses)
    addToProgress(centralProblem)
    addToProgress(directConsequences)
    addToProgress(indirectConsequences)

    const currentProgress = currentProgressArray.length

    const data = [
        { id: "1", name: "L1", value: 23 },
        { id: "2", name: "L2", value: currentProgress }
        ];
    
    const progress = `${Math.round(currentProgress * 100 / 23 * 10) / 10}%`

  return (
    <div className="main">
    <LeftSideBar />
    <LeftSideBarFullScreen/>
    <div className="main-container" style={{display: menuState}}>
        <div className='page-header'>
            <h1>Home</h1>
        </div>
        <div className='profile-home'>
           <div id='progress-container' className='home-container'>
                <h2>Voortgang</h2>
                <div id='home-progress-bar-container'>
                    <PieChart width={250} height={250}>
                        <text
                        x={25}
                        y={25}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        >
                        {progress}
                        </text>
                        <Pie
                        data={data}
                        dataKey="value"
                        innerRadius="80%"
                        outerRadius="100%"
                        fill="#82ca9d"
                        startAngle={90}
                        endAngle={-270}
                        paddingAngle={0}
                        cornerRadius={5}
                        >
                        <Cell
                        key="test"
                        fill="#CCC"
                        />
                        </Pie>
                    </PieChart>
                </div>
           </div>
           <div id='overview-steps-container' className='home-container'>
               <div className='overview-step-detail-container'>
                   <h2>Stapen</h2>
                   <div className={`home-step-detail-container ${profile ? 'complete-step' : 'non-complete-step'}`} >
                       <h3>1. Profiel aanmaken</h3>
                       <img src={completeIcon} alt="" />
                   </div>
                   <div>
                       <h3>2. Probleemanalyse</h3>
                       <ul>
                           <li style={{backgroundColor: indirectCauses ? '#63cadc' : 'white', color: indirectCauses? 'white' : '#616161'}}>Achterliggende oorzaken</li>
                           <li style={{backgroundColor: centralProblem ? '#63cadc' : 'white', color: centralProblem ? 'white' : '#616161'}}>Centraal probleem</li>
                       </ul>
                   </div>
                   
               </div>

           </div>
        </div>
    </div>
</div>
  )
}

export default Home