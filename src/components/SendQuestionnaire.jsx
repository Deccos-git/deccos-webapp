import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "./LeftSideBarAuthProfileFullScreen";
import RightSideBar from "./rightSideBar/RightSideBar"
import Location from "../hooks/Location"
import MenuStatus from "../hooks/MenuStatus";
import { useFirestoreID } from "../firebase/useFirestore"
import { Editor } from '@tinymce/tinymce-react';
import { useState, useRef } from "react";
import firebase from 'firebase'
import { bucket } from '../firebase/config';
import imageIcon from '../images/icons/image-icon.png'
import videoIcon from '../images/icons/video-icon.png'
import fileIcon from '../images/icons/file-icon.png'
import Modal from 'react-modal';
import { client } from "../hooks/Client";

const SendQuestionnaire = () => {
    const [modalImageOpen, setModalImageOpen] = useState(false);
    const [modalVideoOpen, setModalVideoOpen] = useState(false);
    const [modalFileOpen, setModalFileOpen] = useState(false);
    const [body, setBody] = useState('')

    const menuState = MenuStatus()
    const editorRef = useRef(null);
    const route = Location()[3]
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
    
    const defaultBody = () => {
        return(
            `Geachte heer/mevrouw, <br> 
            U ontvangt deze email omdat u een stakeholder bent van ${client}`
        )
    }

    editorRef.current.insertContent(defaultBody())


    const imageHandler = (e) => {
        const image = e.target.files[0]

        console.log(image)

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

    const bodyHandler = (e) => {
        if (editorRef.current) {
            setBody(editorRef.current.getContent());
            }
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

    const questionnares = useFirestoreID('Questionnaires', route)

    return (
        <div className="main">
        <LeftSideBarAuthProfile />
        <LeftSideBarAuthProfileFullScreen/>
        <div className="profile profile-auth-profile" style={{display: menuState}}>
            {questionnares && questionnares.map(questionnaie => (
                <div>
                     <div className='divider send-questionnaire-title'>
                        <h2>{questionnaie.Title}</h2>
                        <h3>versturen</h3>
                    </div>
                    <div className='divider'>
                        <h3>Voeg een stakeholder toe</h3>
                        <p>Naam</p>
                        <input type="text" placeholder='Vul hier de naam van de stakeholder in' />
                        <p>Email</p>
                        <input type="email" placeholder='Vul hier het emailadres van de stakeholder in'/>
                        <button className='button-simple'>Toevoegen</button>
                    </div>
                    <div className='divider'>
                        <h3>Emailtekst</h3>
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
                        <Editor onChange={bodyHandler}
                        placeholder='test'
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
                    <div className='divider email-example-section'>
                        <h3>Email voorbeeld</h3>
                        <div className='email-example-container'>
                            <div className='email-example-field-container'>
                                <p>Aan:</p>
                            </div>
                            <div className='email-example-field-container'>
                                <p>Kopie:</p>
                            </div>
                            <div className='email-example-field-container'>
                                <p>Onderwerp:</p>
                            </div>
                            <div>
                                <p>{body}</p>
                            </div>
                        </div>
                        <div>
                            <button>Versturen</button>
                        </div>
                    </div>
                </div>
            ))}
            
        </div>
        <RightSideBar />
        </div>
    )
}

export default SendQuestionnaire
