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
    const [filterTags, setFilterTags] = useState(null)
    const [filter, setFilter] = useState([])
    const [filteredItems, setFilteredItems] = useState([])
    const [filteredTags, setFilteredTags] = useState([])
    const [items, setItems] = useState()

    const menuState = MenuStatus()
    const history = useHistory()

    const matchItems = useFirestoreTimestamp('MatchItems')
    const categories = useFirestore('MatchCategories')
    const tags = useFirestore('MatchTags')
    const mainTags = useFirestoreMatchTagsType('Main')

    const matchItemDetailLink = (e) => {
        const id = e.target.dataset.id

        history.push(`/${client}/MatchItemDetail/${id}`)
    }

    // Get all items
    const allItems = () => {

        const filterArray = []

        matchItems && matchItems.forEach(item => {

            const filterObject = {
                Title: item.Title,
                Banner: item.Banner,
                Categories: item.Categories,
                ID: item.ID,
                Tags: item.Tags,
            }

            filterArray.push(filterObject)

        })

        return filterArray

    }

    // Set all items to filtered array in state
    useEffect(() => {

        const filterArray = []

        matchItems && matchItems.forEach(item => {

            const filterObject = {
                Title: item.Title,
                Banner: item.Banner,
                Categories: item.Categories,
                ID: item.ID,
                Tags: item.Tags,
            }

            filterArray.push(filterObject)

        })

        setItems(filterArray)

    },[matchItems])

    // Get user filter inputs
    const filterTagHandler = (e) => {
        const option = e.target.options

        const tagSelected = option[option.selectedIndex].value
        const categorie = e.target.dataset.categorie

        if(tagSelected !== 'All'){
            setFilteredTags([...filteredTags, tagSelected])
            handleNewOptionInCategorie(categorie, tagSelected)
        } else if(tagSelected === 'All'){
            handleAllOption(categorie)
        }
    }

    const handleNewOptionInCategorie = (categorie, tagSelected) => {
        filterTags && filterTags[categorie].forEach((tag) => {
            if(filteredTags.includes(tag.Tag) && tag.Tag !== tagSelected){
                const index = filteredTags.indexOf(tag.Tag)
                filteredTags.splice(index, 1)
                setFilteredTags([...filteredTags, tagSelected])
            }
        })
    }

    const handleAllOption = (categorie) => {

        filterTags && filterTags[categorie].forEach((tag) => {
            const index = filteredTags.indexOf(tag.Tag)
            if(index > -1){
                filteredTags.splice(index, 1)
                setFilteredTags([...filteredTags])
            }
        })
    }

    const filterButton = () => {
        const newArray = []

        allItems() && allItems().forEach(item => {
           
            if(filteredTags.every(tag => item.Tags.includes(tag))){
                newArray.push(item)
            }
        })

        setItems(newArray)
    }
    
    // Set all tags in state
    useEffect(() => {

        // Get all tags and categories in an array
        const tagArray = tags && tags.map(tag => {
            return {Categorie: tag.Categorie,
                    Tag: tag.Tag}
        })

        // Group the array by categorie
        if (tagArray){
            const groupBy = (tagArray, property) => {
                return tagArray.reduce((acc, obj) => {
                  let key = obj[property]
                  if (!acc[key]) {
                    acc[key] = []
                  }
                  acc[key].push(obj)
                  return acc
                }, {})
              }

            // Create array of grouped tags
            const arrayOfSelectedTags = groupBy(tagArray, 'Categorie')

            // Set state with filtertags
            setFilterTags(arrayOfSelectedTags)
        } 

    }, [tags])

    // Create filter tags
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

            const tagList = await findTags(categorie.Categorie)

            const categorieObject = {
                Categorie: categorie.Categorie,
                Tags: tagList,
                ID: categorie.ID
            }

            categorieList.push(categorieObject)
        }
        
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

            if(item.Tags && item.Tags.includes(tagMain)){
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
                               <select name="" id="" data-categorie={filter.Categorie} onChange={filterTagHandler}>
                                   <option value="All">-- Alle --</option>
                                   {filter.Tags.map(tag => (
                                       <option value={tag}>{tag}</option>
                                   ))}
                               </select>
                           </div>
                       ))}
                       <button onClick={filterButton}>Filter</button>
                    </div>
                </div>
                <div className="card-container">
                    {items && items.map(item => (
                        <div className="goal-list card" key={item.ID}>
                            <img className="match-card-banner" src={item.Banner && item.Banner} alt="" style={{border: `3px solid ${typeColor(item)}`}} />
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
