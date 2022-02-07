import LeftSideBarAuthProfile from "../LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "../LeftSideBarAuthProfileFullScreen";
import RightSideBar from "../rightSideBar/RightSideBar"
import { useState } from 'react'
import { motion } from "framer-motion"
import { db, timestamp } from "../../firebase/config.js"
import { client } from '../../hooks/Client';
import { Link } from "react-router-dom";
import uuid from 'react-uuid';
import { useFirestore } from '../../firebase/useFirestore.js';
import { Editor } from '@tinymce/tinymce-react';
import { useRef, useContext, useEffect } from 'react';
import firebase from 'firebase'
import { bucket } from '../../firebase/config';
import spinnerRipple from '../../images/spinner-ripple.svg'
import imageIcon from '../../images/icons/image-icon.png'
import videoIcon from '../../images/icons/video-icon.png'
import fileIcon from '../../images/icons/file-icon.png'
import { Auth } from '../../StateManagment/Auth';
import MenuStatus from "../../hooks/MenuStatus";
import Modal from 'react-modal';

const AddArticle = () => {
    const [authO] = useContext(Auth)

    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [categorie, setCategorie] = useState("")
    const [newCategorie, setNewCategorie] = useState("")
    const [bannerPhoto, setBannerPhoto] = useState("")
    const [loader, setLoader] = useState("")
    const [headerPhoto, setHeaderPhoto] = useState('')
    const [compagnyId, setCompagnyID] = useState('')
    const [modalImageOpen, setModalImageOpen] = useState(false);
    const [modalVideoOpen, setModalVideoOpen] = useState(false);
    const [modalFileOpen, setModalFileOpen] = useState(false);
    const [channelID, setChannelID] = useState('')

    const id = uuid()
    const compagny = useFirestore("CompagnyMeta")
    const banners = useFirestore('Banners')
    const channels = useFirestore("Channels")

    const editorRef = useRef(null);
    const menuState = MenuStatus()
    Modal.setAppElement('#root');

    const modalStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
        },
      };

    // Set banner image in state
    
    useEffect(() => {
        banners && banners.forEach(banner => {
            const header = banner.NewArticle
            setHeaderPhoto(header)
        })
    }, [banners])

    // Set compagny id in state

    useEffect(() => {
        compagny && compagny.forEach(comp => {
            setCompagnyID(comp.docid)
        })
    }, [compagny])

    // Set channel ID to state

    useEffect(() => {
        channels && channels.forEach(channel => {
            if(channel.Name === 'Kenniscentrum'){
                setChannelID(channel.ID)
            }
        })

    }, [channels])

    const variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }

    const titleHandler = (e) => {
        const title = e.target.value
        setTitle(title)
    }

    const bodyHandler = (e) => {
        if (editorRef.current) {
            setBody(editorRef.current.getContent());
            }
    }

    // Add image, video and/or pdf to editor

    const imageHandler = (e) => {
        const image = e.target.files[0]

        const fileType = image.type.split("/")

        const storageRef = bucket.ref("/ProfilePhotos/" + image.name);
        const uploadTask = storageRef.put(image)

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

            if (editorRef.current) {
                if(fileType[0] === "image"){
                    editorRef.current.insertContent(
                        `
                        <img style="width:80%" src="${downloadURL}">
                        `
                        )
                } else if(fileType[0] === "video"){
                    editorRef.current.insertContent(
                        `
                        <video width="90%" height="90%" controls autoplay muted>
                            <source src="${downloadURL}">
                        </video>
                        `
                    )
                } else if(fileType[0] === "application"){
                    editorRef.current.insertContent(

                        `
                        <a href='${downloadURL}' target="_blank">
                            ${image.name}
                        </a>
                        `
                    )
                } else {
                    editorRef.current.insertContent(`<div> src=${downloadURL}</div>`);
                }
                }
                })
                .then(() => {
                    closeImageModal()
                    closeVideoModal()
                    closeFileModal()
                })

            })
        })
    }

    const categoryHandler = (e) => {
        const option = e.target.options

        const categorie = option[option.selectedIndex].innerHTML

        setCategorie(categorie)
    }

    const newCategorieHandler = (e) => {
        const newCategorie = e.target.value

        setNewCategorie(newCategorie)
    }

    // Upload banner image

    const photoHandler = (e) => {
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

            setBannerPhoto(downloadURL)
            setLoader(downloadURL)

                })
            })
        })
    }

    const saveNewcategorie = (e) => {

        e.preventDefault()

        compagnyId && 
        db.collection("CompagnyMeta")
        .doc(compagnyId)
        .update({
            Categories: firebase.firestore.FieldValue.arrayUnion(newCategorie)
        })
    }
    

    const saveArticle = (e) => {

        db.collection("KnowledgeCentre")
        .doc()
        .set({
            Title: title,
            Body: body,
            Compagny: client,
            Timestamp: timestamp,
            ID: id,
            User: authO.UserName,
            UserPhoto: authO.Photo,
            UserID: authO.ID,
            Categorie: categorie,
            Banner: bannerPhoto,
            ChannelID: channelID
        })
        .then(() => {
            db.collection("AllActivity")
            .doc()
            .set({
                Title: title,
                Type: "NewArticle",
                Compagny: client,
                Timestamp: timestamp,
                ID: id,
                Description: "heeft een nieuw artikel toegevoegd:",
                ButtonText: "Bekijk artikel",
                User: authO.UserName,
                UserPhoto: authO.Photo,
                UserID: authO.ID,
                Banner: headerPhoto,
                Link: `ArticleDetail/${id}`
            }) 
        })
        .then(() => {
            db.collection("Search")
            .doc()
            .set({
                Name: title,
                Compagny: client,
                Type: 'Artikel',
                Link: `ArticleDetail/${id}`
            })
        })
    }

    const closeImageModal = () => {
        setModalImageOpen(false);
      }

    const closeVideoModal = () => {
    setModalVideoOpen(false);
    }

    const closeFileModal = () => {
        setModalFileOpen(false);
    }
    

    return (
        <div className="main">
             <LeftSideBarAuthProfile />
            <LeftSideBarAuthProfileFullScreen/>
            <motion.div className="article"
            initial="hidden"
            animate="visible"
            variants={variants}
            style={{display: menuState}}>
                <div className="card-header">
                    <h2>Voeg een artikel toe</h2>
                    <p>Voeg een nieuw artikel voor de leden van de community</p>
                </div>
                <form id="add-goal-form">
                    <div className="divider">
                        <h4>Geef het artikel een titel</h4>
                        <input type="text" placeholder="Schrijf hier de titel" onChange={titleHandler} />
                    </div >
                    <Modal
                        isOpen={modalImageOpen}
                        onRequestClose={closeImageModal}
                        style={modalStyles}
                        contentLabel="Upload file"
                    >
                    <div className='add-image-container'>
                        <img src={imageIcon} alt="" />
                        <p>Upload een plaatje</p>
                        <input onChange={imageHandler} type="file" />
                    </div>
                    </Modal>
                    <Modal
                        isOpen={modalVideoOpen}
                        onRequestClose={closeVideoModal}
                        style={modalStyles}
                        contentLabel="Upload file"
                    >
                    <div className='add-image-container'>
                        <img src={videoIcon} alt="" />
                        <p>Upload een plaatje video</p>
                        <input onChange={imageHandler} type="file" />
                    </div>
                    </Modal>
                    <Modal
                        isOpen={modalFileOpen}
                        onRequestClose={closeFileModal}
                        style={modalStyles}
                        contentLabel="Upload file"
                    >
                    <div className='add-image-container'>
                        <img src={fileIcon} alt="" />
                        <p>Upload een document</p>
                        <input onChange={imageHandler} type="file" />
                    </div>
                    </Modal>
                    <div className="divider">
                        <h4>Schrijf je artikel</h4>
                        <Editor onChange={bodyHandler}
                        apiKey="dz1gl9k5tz59z7k2rlwj9603jg6xi0bdbce371hyw3k0auqm"
                        onInit={(evt, editor) => editorRef.current = editor}
                        init={{
                        height: 500,
                        menubar: false,
                        statusbar: false,
                        plugins: [
                            'advlist autolink lists link image charmap print preview anchor',
                            'searchreplace visualblocks code fullscreen',
                            'insertdatetime media table paste code help'
                        ],
                        toolbar: 'undo redo | formatselect | ' +
                        'bold italic backcolor | imageFunction | videoFunction | fileFunction | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                        setup: function (editor) {

                            editor.ui.registry.addButton('imageFunction', {
                              icon: 'image',
                              onAction: function (_) {
                                setModalImageOpen(true);
                              },
                            });

                            editor.ui.registry.addButton('videoFunction', {
                                icon: 'embed',
                                onAction: function (_) {
                                  setModalVideoOpen(true);
                                },
                              });

                              editor.ui.registry.addButton('fileFunction', {
                                icon: 'document-properties',
                                onAction: function (_) {
                                  setModalFileOpen(true);
                                },
                              });
                        },
                        content_style: 'body { font-family: Raleway, sans-serif; font-size:14px; color: gray }'
                        }}
                        />
                    </div>
                    <div className="divider">
                        <h4>Voeg een categorie toe</h4>
                        {compagny && compagny.map(comp => (
                                <select name="" id="" onChange={categoryHandler} key={uuid()}>
                                     {comp.Categories.map(cat => (
                                        <option value="" key={uuid()}>{cat}</option>
                                    ))}
                                </select>
                        ))}
                        <p>Voeg een nieuwe categorie toe aan de categorielijst</p>
                        <input type="text" placeholder="Schrijf hier je catgeorie" onChange={newCategorieHandler} />
                        <p className="button-minimal" onClick={saveNewcategorie}>Voeg toe</p>
                    </div>
                    <div>
                        <p>Voeg een bannerfoto toe</p>
                        <input onChange={photoHandler} type="file" />
                        <div className="spinner-container">
                            <img src={loader} alt="" />
                        </div> 
                    </div>
                </form>
                <div id="button-add-goal">
                    <Link to={`/${client}/KnowledgeCentre`}><button onClick={saveArticle}>Opslaan</button></Link>
                </div>
            </motion.div>
            <RightSideBar />
        </div>
    )
}

export default AddArticle
