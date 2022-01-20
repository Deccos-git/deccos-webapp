import {useFirestoreTimestamp, useFirestore, useFirestoreMatchTagsType} from "../../firebase/useFirestore"
import LeftSideBar from "../LeftSideBar"
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import RightSideBar from "../rightSideBar/RightSideBar";
import MenuStatus from "../../hooks/MenuStatus";
import { client } from '../../hooks/Client';
import { useHistory } from "react-router-dom";
import { useEffect, useState } from 'react'
import { db, timestamp } from "../../firebase/config.js"

const MatchItems = () => {
    const [filterTag, setFilterTag] = useState(null)
    const [filter, setFilter] = useState([])
    const [tagsList, setTagsList] = useState([])

    const menuState = MenuStatus()
    const history = useHistory()

    const matchItems = useFirestoreTimestamp('MatchItems')
    const categories = useFirestore('MatchCategories')
    const mainTags = useFirestoreMatchTagsType('Main')

    const matchItemDetailLink = (e) => {
        const id = e.target.dataset.id

        history.push(`/${client}/MatchItemDetail/${id}`)
    }

    // Get user filter inputs

    const filterTagHandler = (e) => {
        const option = e.target.options

        const tag = option[option.selectedIndex].innerHTML

        if(tag === '-- Selecteer --'){
            setFilterTag(null)
        } else {
            setFilterTag(tag)
        }
    }

    // Filter items based on user filter data

    const filteredArray = () => {

        const filterArray = []

        matchItems && matchItems.forEach(item => {

            if(filterTag !== null){

                    if(item.Tags.includes(filterTag)){

                        const filterObject = {
                            Title: item.Title,
                            Banner: item.Banner,
                            Categories: item.Categories,
                            ID: item.ID,
                            Tags: item.Tags
                        }
        
                        filterArray.push(filterObject)
                    }
            } else if(filterTag === null){
                
                const itemObject = {
                    Title: item.Title,
                    Banner: item.Banner,
                    ID: item.ID,
                    Color: item.Color,
                    Tags: item.Tags
                }
    
                filterArray.push(itemObject)

            }            
        })

        return filterArray

    }

    const findTags = async (categorie) => {

        const tags = []

        await db.collection('MatchTags')
        .where('Categorie', '==', categorie)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach( async doc => {
                const tag = doc.data().Tag

                tags.push(tag)
            })
        })

        return tags

    }

    const filters = async () => {

        const categorieList = []

        for(const categorie of categories){

            console.log(categorie)

            const tagList = await findTags(categorie.Categorie)

            const categorieObject = {
                Categorie: categorie.Categorie,
                Tags: tagList,
                ID: categorie.ID
            }

            categorieList.push(categorieObject)
        }

        console.log(categorieList)
        
        return categorieList
    }

    useEffect(() => {
        filters().then(filter => {
            setFilter(filter)
        })
    }, [categories])

    const typeColor = (item) => {

        let color = ''

        mainTags && mainTags.forEach(tag => {
            const tagMain = tag.Tag

            if(item.Tags.includes(tagMain)){
                color = tag.Color
            }
        })

        return color

    }

    return (
        <div className="main">
            <LeftSideBar />
            <LeftSideBarFullScreen/>
            <div className="card-overview goal-detail-container" style={{display: menuState}}>
                <div className="page-header">
                    <h1>Match items</h1>
                </div>
                <div id='match-items-filter-container'>
                    <div id="filter-select-container">
                       {filter && filter.map(filter => (
                           <div id="filter-inner-container" key={filter.ID}>
                               <h3>{filter.Categorie}</h3>
                               <select name="" id="" onChange={filterTagHandler}>
                                   <option value="">-- Alle --</option>
                                   {filter.Tags.map(tag => (
                                       <option value="">{tag}</option>
                                   ))}
                               </select>
                           </div>
                       ))}
                    </div>
                </div>
                <div className="card-container">
                    {filteredArray() && filteredArray().map(item => (
                        <div className="goal-list card" key={item.ID}>
                            <img className="match-card-banner" src={item.Banner} alt="" style={{border: `3px solid ${typeColor(item)}`}} />
                            <div className="goalcard-body-div">
                                <h2>{item.Title}</h2>
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
