import { useFirestore } from "../firebase/useFirestore"
import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./rightSideBar/RightSideBar"

const Measures = () => {

    const contributions = useFirestore("Contributions")
    const goals = useFirestore("Goals")

    console.log()
    console.log(goals.length)

    return (
        <div className="main">
            <LeftSideBar />
            <div className="main-container">
                <div className="card-container">
                    <div className="block">
                        <h2>Aantal doelen </h2>
                        <div>
                            <p>{goals.length}</p>
                        </div>
                    </div>
                    <div className="block">
                        <h2>Aantal bijdragen</h2>
                        <div>
                            <p>{contributions.length}</p>
                        </div>
                    </div>
                </div>
            </div>
         
            <RightSideBar />
        </div>
    )
}

export default Measures
