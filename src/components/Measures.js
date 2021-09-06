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
            <div className="card-overview">
                <div className="block">
                    <h2>Aantal bijdragen {contributions.length}</h2>
                </div>
                <div className="block">
                    <h2>Aantal doelen {goals.length}</h2>
                </div>

            </div>
            <RightSideBar />
        </div>
    )
}

export default Measures
