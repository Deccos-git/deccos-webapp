import RightSideBar from "../rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "../LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "../LeftSideBarAuthProfileFullScreen";
import MenuStatus from "../../hooks/MenuStatus";
import { db } from "../../firebase/config.js"
import { useState, useEffect } from "react";
import {useFirestore} from "../../firebase/useFirestore"

const Impacthub = () => {

    const [ID, setID] = useState('') 

    const menuState = MenuStatus()

    const compagnies = useFirestore('CompagnyMeta')

    useEffect(() => {
      compagnies && compagnies.forEach(compagny => {
          const ID = compagny.ID 

          setID(ID)
      })
    }, [compagnies]);
    

    
    return (
       <div className="main">
            <LeftSideBarAuthProfile />
            <LeftSideBarAuthProfileFullScreen/>
            <div className="profile profile-auth-profile" style={{display: menuState}}>
                <div className="card-header">
                    <h1>Impacthub</h1>
                    <p>Verander de instellingen voor de impacthub</p>
                </div>
                <div>
                    <h2>Delen op impacthub</h2>
                </div>
                <div>
                    <a href={`https://deccos.nl/Impacthub/OrganisationDetail/${ID}`}><button>Naar impacthub</button></a>
                   
                </div>
            </div>
            <RightSideBar />
        </div>
    )
}

export default Impacthub
