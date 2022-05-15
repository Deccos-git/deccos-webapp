import ChatScreen from "../Community/ChatScreen"
import LeftSideBar from "../LeftSideBar";
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import MenuStatus from "../../hooks/MenuStatus";
import { useFirestore } from "../../firebase/useFirestore"

const ImpactGroup = () => {

    const menuState = MenuStatus()

    const groups = useFirestore('Groups')

  return (
    <div className="main">
        <LeftSideBar />
        <LeftSideBarFullScreen/>
        <div className="main-container" style={{display: menuState}}>
            <div className='page-header'>
                <h1>Impact HQ</h1>
            </div>
            <div className='project-group-container'>
                {groups && groups.map(group => (
                    <ChatScreen group={group}/>
                ))}
            </div>
        </div>  
    </div>
  )
}

export default ImpactGroup