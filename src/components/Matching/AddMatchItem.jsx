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
import spinnerRipple from '../../images/spinner-ripple.svg'
import firebase from 'firebase'
import { bucket } from '../../firebase/config';
import { useHistory } from "react-router-dom";

const MatchCategories = () => {
    const [colors] = useContext(Colors)
    const [title, setTitle] = useState('')
    const [bannerPhoto, setBannerPhoto] = useState("")
    const [loader, setLoader] = useState("")
    const [categorieSummary, setCategorieSummary] = useState([])
    const [showBannerContainer, setShowBannerContainer] = useState('none')

    const menuState = MenuStatus()
    const history = useHistory()

    const matchItems = useFirestore('MatchItems')
    const matchProfileFields = useFirestore('MatchProfileFields')

    const deleteMatchItem  = (e) => {

        const id = e.target.dataset.id 

        db.collection('MatchItems')
        .doc(id)
        .delete()

    }

    const titleHandler = (e) => {
        const title = e.target.value 

        setTitle(title)
    }

    const bannerHandler = (e) => {
        setLoader(spinnerRipple)

        const photo = e.target.files[0]

        const storageRef = bucket.ref("/ProfilePhotos/" + photo.name);
        const uploadTask = storageRef.put(photo)

        uploadTask.then(() => {
          
            uploadTask.on('state_changed', snapshot => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED:
                console.log('Upload is paused');
                break;
            case firebase.storage.TaskState.RUNNING:
                console.log('Upload is running');
                break;
            }
            }, (err) => {
                alert(err)
            }, () => {
            uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            console.log('File available at', downloadURL);

            setShowBannerContainer(true)
            setBannerPhoto(downloadURL)
            setLoader(downloadURL)

                })
            })
        })
    }

    // Display categories and tags in relationship

    const categories = useFirestore('MatchCategories')

    const tags = async (categorieID) => {

        const tagArray = []

        await db.collection('MatchTags')
        .where('CategorieID', '==', categorieID)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach((doc) => {

                const tag = doc.data().Tag
                const categorie = doc.data().Categorie
                const id = doc.id

                const tagObject = {
                    Name: tag,
                    ID: id,
                    Categorie: categorie
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

    // Select tags

    const tagArray = []

    const tagHandler = (e) => {

        const tag = e.target.value

        tagArray.push(tag)

        findCorrespondingCategorie(tag)

    }

    // Get categories

    const categorieArray = []

    const findCorrespondingCategorie = (tag) => {

        db.collection('MatchTags')
        .where('Tag', '==', tag)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const categorie = doc.data().Categorie

                // Check for doubles

                if(categorieArray.includes(categorie)){
                    return
                } else {
                    // Push to array
                    categorieArray.push(categorie)
                }

            })
        })
    }

    // Save new match item

    const saveItem = (e) => {

        e.target.style.color = 'lightgray'
        e.target.innerText = 'Opgeslagen'

        const id = uuid()

        db.collection('MatchItems')
        .doc()
        .set({
            Title: title,
            Timestamp: timestamp,
            ID: id,
            Banner: bannerPhoto,
            Tags: tagArray,
            Categories: categorieArray,
            Compagny: client
        })
        .then(
            tagArray.splice(0,tagArray.length)
        )
        .then(() => {
            db.collection("Search")
            .doc()
            .set({
                Name: title,
                Compagny: client,
                Type: 'MatchItem',
                Link: `MatchItemDetail/${id}`,
                Tags: tagArray,
                Categories: categorieArray,
            })
        })
    }

    const matchItemDetailLink = (e) => {

        const id = e.target.dataset.id

        history.push(`/${client}/MatchItemDetail/${id}`)

    }

    const profileFieldHandler = (e) => {
        const input = e.target.value 

        console.log(input)
    }

    const MatchProfileFields = ({field}) => {

            if(field.Type === 'Textfield'){
                return (
                    <div>
                        <p>{field.Title}</p>
                        <input type="text" placeholder={field.Title} onChange={profileFieldHandler} />
                    </div>
                )
            } else if(field.Type === 'Textarea'){
                return (
                    <div>
                        <p>{field.Title}</p>
                        <textarea placeholder={field.Title} onChange={profileFieldHandler}/>
                    </div>
                )
            } else {
                return null
            }
    }
    
    return (
        <div className="main" style={{backgroundColor: colors.Background}}>
            <LeftSideBarAuthProfile />
            <LeftSideBarAuthProfileFullScreen/>
            <div className="profile profile-auth-profile" style={{display: menuState}}>
                <div className="card-header">
                    <h1>Matchitems</h1>
                    <p>Beheer de matchitems</p>
                </div>
                <div className='divider'>
                    <h4>Match Items</h4>
                    {matchItems && matchItems.map(item=> (
                    <div className='categorie-container' key={item.ID}>
                        <div className='match-item-inner-container'>
                            <div className='match-item-inner-inner-container'>
                                <img className='match-item-banner' src={item.Banner} alt="" />
                                <p className='categorie-title'>{item.Title}</p>
                            </div>
                            <div className='match-item-inner-inner-container'>
                                <button className='button-simple' data-id={item.ID} onClick={matchItemDetailLink}>Bekijk</button>
                                <img src={deleteIcon} alt="" data-id={item.docid} onClick={deleteMatchItem} />
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
                <div className='divider'>
                    <h4>Voeg een match item toe</h4>
                    <p>Titel</p>
                    <input type="text" placeholder='Geef je matchitem een titel' onChange={titleHandler} />
                    <p>Upload een banner</p>
                    <input type="file" onChange={bannerHandler}/>
                    <div className="spinner-container" style={{display:showBannerContainer}}>
                        <img id='add-match-item-banner-preview' src={loader} alt="" />
                    </div> 
                    {matchProfileFields && matchProfileFields.map(field => (
                        <MatchProfileFields field={field}/>
                    ))}
                    <p>Selecteer categorien en tags</p>
                    {categorieSummary && categorieSummary.map(summary => (
                    <div className='categorie-container'>
                        <h4>{summary[0]}</h4>
                        <div className='tag-container'>
                            {summary[2] && summary[2].map(tag => (
                                <div className='add-match-item-categorie-inner-container' key={tag.ID}>
                                    <input className='add-match-item-categorie-input' type="checkbox" data-categorie={tag.Categorie} id={tag.Name} value={tag.Name} onChange={tagHandler}/>
                                    <label htmlFor={tag.Name}>{tag.Name}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                    ))}
                    <div>
                        <button className='button-simple' onClick={saveItem}>Opslaan</button>
                    </div>
                </div>
            </div>
            <RightSideBar />
        </div>
    )
}

export default MatchCategories
