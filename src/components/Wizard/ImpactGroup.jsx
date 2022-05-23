import ChatScreen from "../Community/ChatScreen"
import LeftSideBar from "../LeftSideBar";
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import MenuStatus from "../../hooks/MenuStatus";
import { useFirestore } from "../../firebase/useFirestore"
import Premium from "../../hooks/Premium";
import PremiumNotice from "../PremiumNotice";

const ImpactGroup = () => {

    const menuState = MenuStatus()
    const premium = Premium() 

    const groups = useFirestore('Groups')

  return (
    <div className="main">
        <LeftSideBar />
        <LeftSideBarFullScreen/>
        <div className="main-container" style={{display: menuState}}>
            <div className='page-header'>
                <h1>Impact HQ</h1>
            </div>
            <div className='project-group-container' style={{display: premium ? 'flex' : 'none'}}>
                {groups && groups.map(group => (
                    <ChatScreen group={group}/>
                ))}
            </div>
            <div style={{display: premium ? 'none' : 'flex'}}>
                <PremiumNotice/>
            </div>
        </div>  
    </div>
  )
}

export default ImpactGroup