import {useFirestoreTimestamp, useFirestore, useFirestoreID} from "../../firebase/useFirestore"
import LeftSideBar from "../LeftSideBar"
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import RightSideBar from "../rightSideBar/RightSideBar";
import MenuStatus from "../../hooks/MenuStatus";
import { client } from '../../hooks/Client';
import { useHistory } from "react-router-dom";
import { useRef, useEffect } from 'react'
import { db, timestamp } from "../../firebase/config.js"

const MatchItems = () => {

    const menuState = MenuStatus()
    const history = useHistory()
    const elementRef = useRef()

    const matchItems = useFirestoreTimestamp('MatchItems')
    const tags = useFirestore('MatchTags')

    const matchItemDetailLink = (e) => {
        const id = e.target.dataset.id

        history.push(`/${client}/MatchItemDetail/${id}`)
    }

    const filterCategorieHandler = (e) => {
        const option = e.target.options

        const categorie = option[option.selectedIndex].innerHTML

        console.log(categorie)
    }

    const ItemArray = []

    matchItems && matchItems.forEach(item => {

        const categorieArray = []

        const tagArray = []

        tags && tags.forEach(tag => {
            const categorie = tag.Categorie

            if(item.Tags.includes(tag.Tag)){

                const tags = [
                    categorie,
                    tag.Tag
                ]

                tagArray.push(tags) 
            }
        })

        categorieArray.push(tagArray)

        const ItemObject = {
            Title: item.Title,
            Banner: item.Banner,
            Categories: categorieArray,
            ID: item.ID
        }

        ItemArray.push(ItemObject)
    })

    return (
        <div className="main">
            <LeftSideBar />
            <LeftSideBarFullScreen/>
            <div className="card-overview goal-detail-container" style={{display: menuState}}>
                <div className="page-header">
                    <h1>Match items</h1>
                </div>
                <div>
                    <p>Categorien</p>
                    <select name="" id="" onChange={filterCategorieHandler}>
                        <option value="">-- Selecteer een categorie --</option>
                        
                    </select>
                </div>
                <div className="card-container">
                    {ItemArray && ItemArray.map(item => (
                        <div className="goal-list card" key={item.ID}>
                            <img className="goal-card-banner" src={item.Banner} alt="" />
                            <div className="goalcard-body-div">
                                <h2>{item.Title}</h2>
                            </div>
                            <div>
                                {item.Categories.map(tags => (
                                    <>
                                    {tags && tags.map(tag => (
                                        <>
                                        <h5>{tag[0]}</h5>
                                        <p>{tag[1]}</p>
                                        </>             
                                    ))}
                                    </>    
                                ))}
                            </div>
                            <div className="button-container">
                                <button className="goal-card-button" data-id={item.ID} onClick={matchItemDetailLink} >Bekijk</button>
                            </div>
                        </div>
                    ))}
                </div>
            
            </div>
            <RightSideBar />
        </div>
    )
}

export default MatchItems
