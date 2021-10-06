import {useFirestore} from "../firebase/useFirestore"
import LeftSideBar from "./LeftSideBar"
import LeftSideBarFullScreen from "./LeftSideBarFullScreen"
import RightSideBar from "./rightSideBar/RightSideBar"
import MenuStatus from "../hooks/MenuStatus";
import algoliasearch from 'algoliasearch/lite'
import {
    InstantSearch,
    Hits,
    SearchBox,
  } from 'react-instantsearch-dom';
import { useHistory } from "react-router-dom";
import { client } from '../hooks/Client';

const searchClient = algoliasearch('BTFVOCIBOO', '4d04d8398ec514e63f0f8fe5bef9d629')

const Search = () => {

    const menuState = MenuStatus()
    const history = useHistory();

    const Hit = ({ hit }) => {

        let state = null

        if(hit.Compagny === client){
            state = "block"
        } else {
            state = "none"
        }
        return (
            <div className="hit-container" style={{display: state}}>
                <h2>{hit.Name}</h2>
                <p>Soort: {hit.Type}</p>
                <button onClick={updateRoute} data-link={hit.Link}>Bekijk</button>
            </div>
        )
    }

    const updateRoute = (e) => {

        const link = e.target.dataset.link

        history.push(`/${client}/${link}`)

    }

    return (
        <div className="main">
            <LeftSideBar />
            <LeftSideBarFullScreen/>
            <div id="search-container" style={{display: menuState}}>
                <InstantSearch indexName="Deccos" searchClient={searchClient}>
                    <div className="right-panel">
                        <SearchBox translations={{
                            placeholder: 'Zoek hier...',
                        }} />
                        <Hits hitComponent={Hit} />
                    </div>
                </InstantSearch>
            </div>
            <RightSideBar />
        </div>
    )
}

export default Search
