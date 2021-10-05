import {useFirestore} from "../firebase/useFirestore"
import LeftSideBar from "./LeftSideBar"
import LeftSideBarFullScreen from "./LeftSideBarFullScreen"
import RightSideBar from "./rightSideBar/RightSideBar"
import MenuStatus from "../hooks/MenuStatus";

const Search = () => {

    const docs  = useFirestore("CompagnyMeta")
    const menuState = MenuStatus()

    let title

    docs && docs.map(doc => {
        title = `Zoek in ${doc.CommunityName}` 
    })

    return (
        <div className="main">
            <LeftSideBar />
            <LeftSideBarFullScreen/>
            <div id="search-container" style={{display: menuState}}>
                <h2>{title}</h2>
                <input id="search-bar" type="text" placeholder="Schrijf hier je zoekopdracht" />
                
            </div>
            <RightSideBar />
        </div>
    )
}

export default Search
