import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "./LeftSideBarAuthProfileFullScreen";
import RightSideBar from "./rightSideBar/RightSideBar"
import Location from "../hooks/Location"
import { useFirestoreIntroductions } from "../firebase/useFirestore";
import MenuStatus from "../hooks/MenuStatus";
import deleteIcon from '../images/icons/delete-icon.png'
import { db } from "../firebase/config";

const MyIntroduction = () => {

    const route = Location()[3]
    const menuState = MenuStatus()

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    const introductions = useFirestoreIntroductions("Introductions", route)

    const deleteIntroduction = (e) => {
        const docid = e.target.dataset.docid 

        db.collection('Introductions')
        .doc(docid)
        .delete()
    }
    
    return (
        <div className="main">
              <LeftSideBarAuthProfile />
             <LeftSideBarAuthProfileFullScreen/>
             <div className="card-overview">
                <div className="page-header">
                    <h1>Mijn introductie</h1>
                </div>
                {introductions && introductions.map(introduction => (
                    <div className="introductions-container" style={{display: menuState}}>
                        <div className="introduction-list-inner-container">
                            <p>{introduction.Body}</p>
                            <p>{introduction.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
                            <div className='delete-button-my-introductions-container'>
                                <img data-docid={introduction.docid} src={deleteIcon} alt="" onClick={deleteIntroduction} />
                            </div>
                        </div>
                    </div>
                ))}
             </div>
             <RightSideBar />
        </div>
    )
}

export default MyIntroduction
