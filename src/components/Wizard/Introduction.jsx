import LeftSideBar from "../LeftSideBar"
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import MenuStatus from "../../hooks/MenuStatus";

const Introduction = () => {

    const menuState = MenuStatus() 

  return (
    <div className="main">
        <LeftSideBar />
        <LeftSideBarFullScreen/>
        <div className="main-container" style={{display: menuState}}>
            <div className="page-header">
                <h1>Wat is impact meten?</h1>
            </div>
            <div className='profile profile-auth-profile'>
                    
            </div> 
        </div>
    </div>
)
}

export default Introduction