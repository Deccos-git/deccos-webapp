import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "./LeftSideBarAuthProfileFullScreen";
import RightSideBar from "./rightSideBar/RightSideBar"
import { useState } from 'react'
import { motion } from "framer-motion"
import { db, timestamp } from "../firebase/config.js"
import { client } from '../hooks/Client';
import { Link } from "react-router-dom";
import uuid from 'react-uuid';
import { useFirestore, useFirestoreChannelName } from '../firebase/useFirestore.js';
import { Editor } from '@tinymce/tinymce-react';
import { useRef, useContext, useEffect } from 'react';
import firebase from 'firebase'
import { bucket } from '../firebase/config';
import spinnerRipple from '../images/spinner-ripple.svg'
import { Auth } from '../StateManagment/Auth';
import MenuStatus from "../hooks/MenuStatus";
import imageIcon from '../images/icons/image-icon.png'
import Modal from 'react-modal';

const AddNews = () => {
    const [authO] = useContext(Auth)

    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [bannerPhoto, setBannerPhoto] = useState("")
    const [loader, setLoader] = useState("")
    const [headerPhoto, setHeaderPhoto] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [channelID, setChannelID] = useState('')

    const banners = useFirestore('Banners')
    const channels = useFirestoreChannelName('News')

    const editorRef = useRef(null);
    const menuState = MenuStatus()
    const id = uuid()
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

    // Set channel ID to state

    useEffect(() => {
        channels && channels.forEach(channel => {
            if(channel.Name === 'News'){
                setChannelID(channel.ID)
            }
        })
    }, [channels])

    const variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }

    useEffect(() => {
        banners && banners.forEach(banner => {
            const header = banner.NewNews
            console.log(header)
            setHeaderPhoto(header)
        })
    }, [banners])

    const titleHandler = (e) => {
        const title = e.target.value
        setTitle(title)
    }

    const bodyHandler = (e) => {
        if (editorRef.current) {
            setBody(editorRef.current.getContent());
            }
    }

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
                        <embed src="${downloadURL}" width="90% height="90%"></embed>
                        `
                    )
                } else {
                    editorRef.current.insertContent(`<div> src=${downloadURL}</div>`);
                }
                }
                })
            })
        })
    }

    const closeModal = () => {
        setModalOpen(false);
      }
    
    const afterOpenModal = () => {

    }
    
    const saveEvent = (e) => {

        db.collection("News")
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
            Banner: bannerPhoto,
            ChannelID: channelID
        })
        .then(() => {
            db.collection("AllActivity")
            .doc()
            .set({
                Title: title,
                Type: "NewNews",
                Compagny: client,
                Timestamp: timestamp,
                ID: id,
                Description: "heeft een nieuws item toegevoegd:",
                ButtonText: "Bekijk bericht",
                User: authO.UserName,
                UserPhoto: authO.Photo,
                UserID: authO.ID,
                Banner: headerPhoto,
                Link: `NewsDetail/${id}`
            }) 
        })
        .then(() => {
            db.collection("Search")
            .doc()
            .set({
                Name: title,
                Compagny: client,
                Type: 'Nieuws item',
                Link: `NewsDetail/${id}`
            })
        })
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
                        <h2>Voeg een nieuws item toe</h2>
                        <p>Voeg een nieuws item toe om de leden van de community op de hoogte te houden van de laatste ontwikkelingen</p>
                </div>
                <form id="add-goal-form">
                    <div className="divider">
                        <h4>Geef het nieuws item een titel</h4>
                        <input type="text" placeholder="Schrijf hier de titel" onChange={titleHandler} />
                    </div>
                    <Modal
                        isOpen={modalOpen}
                        onAfterOpen={afterOpenModal}
                        onRequestClose={closeModal}
                        style={modalStyles}
                        contentLabel="Upload file"
                    >
                    <div className='add-image-container'>
                        <img src={imageIcon} alt="" />
                        <p>Voeg een plaatje of video toe</p>
                        <input onChange={imageHandler} type="file" />
                    </div>
                    </Modal>
                    <div className="divider">
                        <h4>Schrijf het nieuws item</h4>
                        <Editor onChange={bodyHandler}
                        apiKey="dz1gl9k5tz59z7k2rlwj9603jg6xi0bdbce371hyw3k0auqm"
                        onInit={(evt, editor) => editorRef.current = editor}
                        init={{
                        height: 500,
                        menubar: false,
                        plugins: [
                            'advlist autolink lists link image charmap print preview anchor',
                            'searchreplace visualblocks code fullscreen',
                            'insertdatetime media table paste code help'
                        ],
                        toolbar: 'undo redo | formatselect | ' +
                        'bold italic backcolor | imageFunction | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                        setup: function (editor) {

                            editor.ui.registry.addButton('imageFunction', {
                              icon: 'image',
                              onAction: function (_) {
                                setModalOpen(true);
                              },
                            });
                        },
                        content_style: 'body { font-family: Raleway, sans-serif; font-size:14px; color: gray }'
                        }}
                        />
                    </div>
                    <div className="divider">
                        <h4>Voeg een bannerfoto toe</h4>
                        <input onChange={photoHandler} type="file" />
                        <div className="spinner-container">
                            <img src={loader} alt="" />
                        </div> 
                    </div>
                </form>
                <div id="button-add-event">
                    <Link to={`/${client}/News`}><button onClick={saveEvent}>Opslaan</button></Link>
                </div>
            </motion.div>
            <RightSideBar />
        </div>
    )
}

export default AddNews
