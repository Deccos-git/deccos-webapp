import RightSideBar from ".././rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from ".././LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from ".././LeftSideBarAuthProfileFullScreen";
import MenuStatus from "../../hooks/MenuStatus";
import { useState, useEffect, useContext } from "react";
import { Colors } from "../../StateManagment/Colors";
import { db, timestamp } from "../../firebase/config";
import uuid from 'react-uuid';
import { client } from "../../hooks/Client"
import {useFirestore, useFirestoreMatchTagsType } from "../../firebase/useFirestore"
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
    const mainTags = useFirestoreMatchTagsType('Main')

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

    // Collect profilefield inputs

    const fieldArray = []

    const profileFieldHandler = (e) => {

        const input = e.target.value 
        const title = e.target.dataset.title
        const type = e.target.dataset.type

        fieldArray.push({
            Title: title,
            Input: input,
            Type: type
        })
    }

    // Save new match item

    const saveItem = (e) => {

        e.target.style.color = 'lightgray'
        e.target.innerText = 'Opgeslagen'

        setTimeout(() => {
            e.target.style.color = '#008000'
            e.target.innerText = 'Opslaan'
        }, 3000);

        const id = uuid()

        // Create seperate objects from titles in profile fields

        function groupBy(objectArray, property) {
            return objectArray.reduce((acc, obj) => {
              let key = obj[property]
              if (!acc[key]) {
                acc[key] = []
              }
              acc[key].push(obj)
              return acc
            }, {})
          }

        // Create array from object

        const array = Object.entries(groupBy(fieldArray, 'Title')) 

        // Find longest input in newly created array and pust in new array

        const filteredArray = []

        array.forEach(arr => {
            const inputs = arr[1]
            
                const longest = inputs.reduce(
                    (a, b) => {
                        return a.length > b.length ? a : b
                    }
                );

                filteredArray.push(longest)
            })
        
        // Save new match item

        db.collection('MatchItems')
        .doc()
        .set({
            Title: title,
            Timestamp: timestamp,
            ID: id,
            Banner: bannerPhoto,
            Tags: tagArray,
            Categories: categorieArray,
            Compagny: client,
            ProfileFields: filteredArray

        })
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
                Description: filteredArray
            })
        })
        .then(() => {
            window.location.reload(false);
        })
        
    }

    const matchItemDetailLink = (e) => {

        const id = e.target.dataset.id

        history.push(`/${client}/MatchItemDetail/${id}`)

    }

    const MatchProfileFields = ({field}) => {

            if(field.Type === 'Textfield'){
                return (
                    <div>
                        <p>{field.Title}</p>
                        <input type="text" placeholder={field.Title} data-title={field.Title} data-type={field.Type} onChange={profileFieldHandler} />
                    </div>
                )
            } else if(field.Type === 'Textarea'){
                return (
                    <div>
                        <p>{field.Title}</p>
                        <textarea placeholder={field.Title} data-title={field.Title} data-type={field.Type} onChange={profileFieldHandler}/>
                    </div>
                )
            } else {
                return null
            }
    }

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
        <div className="main" style={{backgroundColor: colors.Background}}>
            <LeftSideBarAuthProfile />
            <LeftSideBarAuthProfileFullScreen/>
            <div className="profile profile-auth-profile" style={{display: menuState}}>
                <div className="card-header">
                    <h1>Match items</h1>
                    <p>Beheer de match items</p>
                </div>
                <div className='divider'>
                    <h2>Match Items</h2>
                    {matchItems && matchItems.map(item=> (
                    <div className='categorie-container' key={item.ID}>
                        <div className='match-item-inner-container'>
                            <div className='match-item-inner-inner-container'>
                                <img className='match-item-banner' src={item.Banner} alt="" style={{border: `3px solid ${typeColor(item)}`}} />
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
                    <h2>Voeg een match item toe</h2>
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
                    <div className='button-userrole-container'>
                        <button className='button-simple' onClick={saveItem}>Opslaan</button>
                    </div>
                </div>
            </div>
            <RightSideBar />
        </div>
    )
}

export default MatchCategories
