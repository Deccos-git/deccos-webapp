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
import ButtonClicked from '../../hooks/ButtonClicked'

const MatchCategories = () => {
    const [colors] = useContext(Colors)
    const [categorie, setCategorie] = useState('')
    const [tag, setTag] = useState('')
    const [categorieSummary, setCategorieSummary] = useState([])
    const [type, setType] = useState('')

    const menuState = MenuStatus()

    const categories = useFirestore('MatchCategories')
    const matchTags = useFirestore('MatchTags')

    const tags = async (categorieID) => {

        const tagArray = []

        await db.collection('MatchTags')
        .where('CategorieID', '==', categorieID)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach((doc) => {

                const tag = doc.data().Tag
                const ID = doc.data().ID
                const docid = doc.id
                const color = doc.data().Color

                const tagObject = {
                    Name: tag,
                    Docid: docid,
                    ID: ID,
                    Color: color
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

            const tagList = await tags(categorie.ID)

            const detailsObject = {
                Categorie: categorie.Categorie,
                ID: categorie.ID,
                Docid: categorie.docid,
                Tags: tagList,
                Type: categorie.Type
            }

            categorieDetail.push(detailsObject)

            categorieList.push(detailsObject)

        }

        return categorieList

    }

    useEffect(() => {
        categorieOverview().then((categorieList) => {
            setCategorieSummary(categorieList)
        })
        
    }, [categories, matchTags])


    const categorieHandler = (e) => {
        const categorie = e.target.value

        setCategorie(categorie)
    }

    const tagHandler = (e) => {
        const tag = e.target.value

        setTag(tag)
    }

    const saveCategorie = (e) => {

        ButtonClicked(e, 'Opgeslagen')

        db.collection('MatchCategories')
        .doc()
        .set({
            Categorie: categorie,
            Timestamp: timestamp,
            ID: uuid(),
            Compagny: client,
            Type: type
        })
    }

    const saveTag = (e) => {

        ButtonClicked(e, 'Toegevoegd')

        const categorie = e.target.dataset.categorie
        const categorieID = e.target.dataset.categorieid
        const type = e.target.dataset.type

        db.collection('MatchTags')
        .doc()
        .set({
            Tag: tag,
            Categorie: categorie,
            CategorieID: categorieID,
            Timestamp: timestamp,
            ID: uuid(),
            Compagny: client,
            Color: '#ffffff',
            Type: type
        })

    }

    const deleteCategorie = (e) => {
        const id = e.target.dataset.id 

        console.log(id)

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

    const typeHandler = (e) => {
        const option = e.target.options

        const categorie = option[option.selectedIndex].value

        setType(categorie)
    }

    
    const ColorTagSelect = ({tag, summary}) => {
        const [tagColor, setTagColor] = useState('')

        useEffect(() => {
            db.collection('MatchTags')
            .doc(tag.Docid)
            .get()
            .then(doc => {
                    const color = doc.data() && doc.data().Color 

                    setTagColor(color)
            })
        },[])

        const tagColorHandler = (e) => {
            const color = e.target.value 
    
            setTagColor(color)
        }

        const saveTagColor = (e) => {

            ButtonClicked(e, 'Opgeslagen')

            const docid = e.target.dataset.id 
    
    
            db.collection('MatchTags')
            .doc(docid)
            .update({
                Color: tagColor
            })
        }

        return (
            <div className='select-tag-color-container' style={{display: summary.Type === 'Main' ? 'flex' : 'none'}}>
                <p>Selecteer kleur</p>
                <input type="color" data-id={tag.Docid} defaultValue={tag.Color} value={tagColor}  className='main-categorie-tag-color' onChange={tagColorHandler} />
                <button className='button-simple' data-id={tag.Docid} onClick={saveTagColor}>Opslaan</button>
            </div>
        )
    }

    return (
        <div className="main" style={{backgroundColor:colors.Background}}>
            <LeftSideBarAuthProfile />
            <LeftSideBarAuthProfileFullScreen/>
            <div className="profile profile-auth-profile" style={{display: menuState}}>
                <div className="card-header">
                    <h1>Categorien en tags</h1>
                    <p>Voeg categorien en tags toe om matches te maken</p>
                </div>
                <div className='divider'>
                    <h2>Categorien</h2>
                    {categorieSummary && categorieSummary.map(summary => (
                    <div className={`categorie-container ${summary.Type}`} key={summary.ID}>
                        <div className='categorie-inner-container'>
                            <p className='categorie-title'>{summary.Categorie}</p>
                            <img src={deleteIcon} alt="" data-id={summary.Docid} onClick={deleteCategorie} />
                        </div>
                        <div className='tag-container'>
                            <h4>Tags</h4>
                            {summary.Tags && summary.Tags.map(tag => (
                                <div className='categorie-inner-container' key={tag.ID} style={{borderLeft: `5px solid ${tag.Color}` }}>
                                    <p>{tag.Name}</p>
                                    <ColorTagSelect tag={tag} summary={summary}/>
                                    <img src={deleteIcon} data-id={tag.Docid} alt="" onClick={deleteTag} />
                                </div>
                            ))}
                            <input type="text" placeholder='Voeg tag toe' onChange={tagHandler} />
                            <div className='button-userrole-container'>
                                <button className='button-simple' data-categorieid={summary.ID} data-categorie={summary.Categorie} data-type={summary.Type} onClick={saveTag}>Toevoegen</button>
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
                <div className='divider'>
                    <h2>Voeg een categorie toe</h2>
                    <p>Categorie</p>
                    <input type="text" placeholder='Geef je categorie een naam' onChange={categorieHandler} />
                    <p>Selecteer categorie type</p>
                    <select name="" id="" onChange={typeHandler}>
                        <option value="Filter">Filter categorie</option>
                        <option value="Main">Hoofd categorie</option>
                    </select>
                    <div className='button-userrole-container'>
                        <button className='button-simple' onClick={saveCategorie}>Opslaan</button>
                    </div>
                </div>
            </div>
            <RightSideBar />
        </div>
    )
}

export default MatchCategories
