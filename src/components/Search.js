import {useFirestore} from "../firebase/useFirestore"
import LeftSideBar from "./LeftSideBar"
import LeftSideBarFullScreen from "./LeftSideBarFullScreen"
import MenuStatus from "../hooks/MenuStatus";
import { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Auth } from '../StateManagment/Auth';

const Search = () => {
    const [authO] = useContext(Auth)
    const [input, setInput] = useState('')

    const menuState = MenuStatus()
    const history = useHistory();

    const searchItems = useFirestore('Search')

    const searchInputHandler = (e) => {
        const input = e.target.value 

        setInput(input)
    }

    const filter = () => {

        const itemArray = []

        searchItems && searchItems.forEach(item => {
            if(item.Name.includes(input)){
                itemArray.push(item)
            } else if(item.Description){
                item.Description.forEach(description => {
                    if(description.Input.includes(input)){
                        itemArray.push(item)
                    }
                })
            }
        })

        return itemArray
    }

    return (
        <div className="main">
            <LeftSideBar />
            <LeftSideBarFullScreen/>
            <div className="main-container">
                <div id='search-bar-container'>
                    <input type="text" placeholder={`Waar ben je naar op zoek, ${authO.ForName}?`} onChange={searchInputHandler} />
                </div>
                <div id="search-container" style={{display: menuState}}>
                    {filter().map(item => (
                        <div id='search-item-container'>
                            <div>
                                <h3>Text</h3>
                                <p>{item.Name}</p>
                            </div>
                            <div>
                                <h3>{item.Description && 'Omschrijving'}</h3>
                                {item.Description && item.Description.map(input => (
                                <p>{input.Input}</p>
                            ))}
                            </div>
                            <div>
                                <h3>Type</h3>
                                <p>{item.Type}</p>
                            </div>
                            <a href={item.Link}><button>Bekijk</button></a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Search
