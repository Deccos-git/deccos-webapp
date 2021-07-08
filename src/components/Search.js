import searchIcon from '../images/icons/Search-icon.png'
import {useFirestore} from "../firebase/useFirestore"
import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./RightSideBar"

const Search = () => {

    const docs  = useFirestore("CompagnyMeta")

    let title

    docs && docs.map(doc => {
        title = `Zoek in ${doc.CommunityName}` 
    })

    return (
        <div className="main">
            <LeftSideBar />
            <div id="search-container">
                <h2>{title}</h2>
                <input id="search-bar" type="text" placeholder="Schrijf hier je zoekopdracht" />
                
            </div>
            <RightSideBar />
        </div>
    )
}

export default Search
