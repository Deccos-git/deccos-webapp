import RightSideBar from ".././rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from ".././LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from ".././LeftSideBarAuthProfileFullScreen";
import MenuStatus from "../../hooks/MenuStatus";
import { useState, useEffect, useContext } from "react";
import { Colors } from "../../StateManagment/Colors";
import { db, timestamp } from "../../firebase/config";
import uuid from 'react-uuid';
import { client } from "../../hooks/Client"
import {useFirestore } from "../../firebase/useFirestore"
import deleteIcon from '../../images/icons/delete-icon.png'

const RoadMap = () => {
    const [colors] = useContext(Colors)
    const [categorie, setCategorie] = useState('')
    const [tag, setTag] = useState('')
    const [backgroundColor, setBackgroundColor] = useState(colors.Background)
    const [categorieSummary, setCategorieSummary] = useState([])

    const menuState = MenuStatus()

    const categories = useFirestore('MatchCategories')

    const tags = async (categorieID) => {

        const tagArray = []

        await db.collection('MatchTags')
        .where('CategorieID', '==', categorieID)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach((doc) => {

                const tag = doc.data().Tag
                const id = doc.id

                const tagObject = {
                    Name: tag,
                    ID: id
                }

                tagArray.push(tagObject)
               
                })
            })

        return tagArray

    }

    const categorieOverview = async () => {

        const categorieList = []

        for(const categorie of categories){

            const categorieDetail = []

            categorieDetail.push(categorie.Categorie)
            categorieDetail.push(categorie.ID)

            const tagList = await tags(categorie.ID)

            categorieDetail.push(tagList)

            categorieList.push(categorieDetail)

        }

        return categorieList

    }

    useEffect(() => {
        categorieOverview().then((categorieList) => {
            setCategorieSummary(categorieList)
        })
        
    }, [categories])

    console.log(categorieSummary)

    const categorieHandler = (e) => {
        const categorie = e.target.value

        setCategorie(categorie)
    }

    const tagHandler = (e) => {
        const tag = e.target.value

        setTag(tag)
    }

    const saveCategorie = () => {

        db.collection('MatchCategories')
        .doc()
        .set({
            Categorie: categorie,
            Timestamp: timestamp,
            ID: uuid(),
            Compagny: client
        })
    }

    const saveTag = (e) => {

        const categorie = e.target.dataset.categorie
        const categorieID = e.target.dataset.categorieid

        db.collection('MatchTags')
        .doc()
        .set({
            Tag: tag,
            Categorie: categorie,
            CategorieID: categorieID,
            Timestamp: timestamp,
            ID: uuid(),
            Compagny: client
        })
    }

    const deleteCategorie = (e) => {
        const id = e.target.dataset.id 

        db.collection('MatchCategories')
        .doc(id)
        .delete()

    }

    const deleteTag = (e) => {
        const id = e.target.dataset.id 

        db.collection('MatchTags')
        .doc(id)
        .delete()

    }

    return (
        <div className="main" style={{backgroundColor:backgroundColor}}>
            <LeftSideBarAuthProfile />
            <LeftSideBarAuthProfileFullScreen/>
            <div className="profile profile-auth-profile" style={{display: menuState}}>
                <div className="card-header">
                    <h1>Stappenplan</h1>
                    <p>Voeg een stappenplan toe aan de matches</p>
                </div>
                <div className='divider'>
                    <h4>Stappen</h4>
                    {categorieSummary && categorieSummary.map(summary => (
                    <div className='categorie-container' key={summary.ID}>
                        <div className='categorie-inner-container'>
                            <p className='categorie-title'>{summary[0]}</p>
                            <img src={deleteIcon} alt="" data-id={summary[1]} onClick={deleteCategorie} />
                        </div>
                        <div className='tag-container'>
                            <h4>Tags</h4>
                            {summary[2] && summary[2].map(tag => (
                                <div className='categorie-inner-container' key={tag.ID}>
                                    <p>{tag.Name}</p>
                                    <img src={deleteIcon} data-id={tag.ID} alt="" onClick={deleteTag} />
                                </div>
                            ))}
                            <input type="text" placeholder='Voeg tag toe' onChange={tagHandler} />
                            <button className='button-simple' data-categorieid={summary[1]} data-categorie={summary[0]} onClick={saveTag}>Opslaan</button>
                        </div>
                    </div>
                    ))}
                </div>
                <div className='divider'>
                    <h4>Voeg een stap toe</h4>
                    <p>Categorie</p>
                    <input type="text" placeholder='Geef je categorie een naam' onChange={categorieHandler} />
                    <div>
                        <button className='button-simple' onClick={saveCategorie}>Opslaan</button>
                    </div>
                </div>
            </div>
            <RightSideBar />
        </div>
    )
}

export default RoadMap
